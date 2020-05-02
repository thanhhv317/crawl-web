const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    content: {
        type: String,
        require: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Posts', postSchema)