// Import the model made with notes mongoose schema
const Note = require('./note');
const User = require('./user');

//create an object named models to be exported for simplicity
const models = {
    Note,
    User
};

module.exports = models;