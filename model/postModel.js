const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },

    content : {
        type: String,
        required : true
    }
},{
    timestamps : true
})

postSchema.methods.toJSON = function () {
    const post = this 
    const postObj = post.toObject()
    postObj.owner = {
        name : "Mamour"
    }

    return postObj
}


const postModel = mongoose.model('post',postSchema)

module.exports = postModel