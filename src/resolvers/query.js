const { models } = require("mongoose")

module.exports ={
        //add the following to the existing module.exports object:
        
        notes: async (parent, args, { models }) =>{
            //find all notes
            return await models.Note.find().limit(100);
        },
        
        note: async (parent,args, {models}) =>{
            //find a specific note based on id
            return await models.Note.findById(args.id);
        },


        user: async (parent, {username}, {models}) =>{
            //find a user given their username
            return await models.User.findOne({username});
        },
        users: async (parent, args, {models}) =>{
            //find all users
            return await models.User.find().limit(100);
        },
        me: async (parent, args, {models, user}) => {
            //find a user given the current user context
            return await models.User.findById(user.id);
        },

        noteFeed: async(parent, {cursor}, {models}) =>{
            //hardcode the limit to 10 items
            const limit = 10;

            //set hasNextPage default value to false
            let hasNextPage = false;

            //if there is no cursor, the default query should be empty
            let cursorquery = {};

            //if there is a cursor, query should look for notes with ObjectID
            //less than that of cursor
            if(cursor){
                cursorquery = {_id:{$lt: cursor}};
            }
            //find the limit + 1 of notes in db, sorted newest to oldest
            let notes = await models.Note.find(cursorquery)
            .sort({_id: -1}).limit(limit+1);

            //if the length of notes is greaterthan limit set 
            //hasNextPage to true and slice notes to limit
            if(notes.length > limit){
                hasNextPage = true;
                notes = notes.slice(0,-1);
            }

            //the newcursor will be the mongo objectId of the last item of the feed array
            const newCursor = notes[notes.length -1]._id;

            return{
                notes,
                cursor : newCursor,
                hasNextPage
            }



        }
}