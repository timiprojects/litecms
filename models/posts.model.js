const mongoose = require('mongoose')

const postsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cmsUsers'
    }],
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cmsCategory'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, {toJSON: {virtuals: true}})

postsSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('cmsPosts', postsSchema)