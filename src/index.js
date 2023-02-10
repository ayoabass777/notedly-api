const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const jwt = require('jsonwebtoken')

//Adjust http headers to be more secure
const helmet = require('helmet');

//Cross origin Resource Sharing
const cors = require('cors');

const depthLimit = require('graphql-depth-limit');
  const {createComplexityLimitRule} = require('graphql-validation-complexity')

//Import .env file
require('dotenv').config();

// Start local module imports
//Import database connection 
const db = require('./db');

//Import schema model (made from mongeese schema)
const models = require('./models');

//Import graphql schema from schema module
const typeDefs = require('./schema');

//provide resolve functions for schema fields by importing from resolver folder
const resolvers = require('./resolvers')

//=======================================================

//Run server on port specified in env file or port 4000
const port = process.env.PORT || 4000;

//storing db_host value as a variable
const DB_HOST = process.env.DB_HOST;

const app = express();

//Connect to database
db.connect(DB_HOST);

//Security middleware
app.use(helmet());
//CORS middleware
app.use(cors());


//Get the user info from a JWT
const getUser = token => {
    if (token) {
      try {
        // return the user information from the token
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        // if there's a problem with the token, throw an error
        throw new Error('Session invalid');
      }
    }
  };

// Apollo server setup
//updated to include `validationRules`
const server = new ApolloServer({typeDefs, resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: async ({req}) => {
        //get the user token from the header
        const token = req.headers.authorization;
        //trying to retrieve a user with token
        const user = await getUser(token);
        //Add the db model and user to the context
        return{ models, user };
    }
});


//Apply the Applo GraphQL middleware  and set path to /api 
server.applyMiddleware({app, path:'/api'});

app.listen({port}, ()=> console.log(`Graphql server running at localhost:${port}${server.graphqlPath}`)
);

