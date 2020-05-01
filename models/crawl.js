const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    // name: {
    //     type: String,
    //     require: true,
    //     min: 6,
    //     max: 255
    // },
    // email: {
    //     type: String,
    //     require: true,
    //     min: 12,
    //     max: 255
    // },
    // password: {
    //     type: String,
    //     require: true,
    //     min: 8,
    //     max: 1024
    // },
    // createdDate: {
    //     type: Date,
    //     default: Date.now
    // }
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
module.exports = mongoose.model('Posts', userSchema)