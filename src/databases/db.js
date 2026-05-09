const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    }

});

const noteSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    tags: {
        type: [String],
        default: []
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

}, {
    timestamps: true
});

const userModel = mongoose.model("user", userSchema);
const noteModel = mongoose.model("notes", noteSchema);

module.exports = {
    userModel,
    noteModel
};