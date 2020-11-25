const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({

    // mongoDB에 있는 User모델에서 객체정보들을 가져올 수 있다.
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type:String,
        maxlength: 50
    },
    description :{
        type:String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type:String
    },
    thumbnail: {
        type: String
    }


// 만든 date, 업데이트한 date 표시된다.
}, { timestamps:true })

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }