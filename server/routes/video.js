const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const path = require('path')
const { auth } = require("../middleware/auth");
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')


let storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, file, cb)=>{
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false)
        }
        cb(null, true)
    }
});

const upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {

    //console.log("2"+req.files)
    // 클라이언트에서 받은 비디오 서버에 저장
    upload(req, res, err => {
        if(err){
            return res.json({success : false, err})
        }
        return res.json({success:true, url: res.req.file.path, filename: res.req.file.filename})
    })


})

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보들을 몽고디비에 저장한다.    
    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({succe})
        
    })
})

// LandingPage에 전시하기 위해서 모든 비디오 정보를 가져오기 위해 사용
router.get('/getVideos', (req, res) => {
    // 비디오 정보들을 몽고디비에서 가져와서 클라이언트에게 전달.    
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({ success : true, videos})
        })


})


// VideoDetailPage에서 videoId에 해당하는 Video만 가져오기 위해 사용
router.post('/getVideoDetail', (req, res) => {
    // 클라이언트에서 보낸 postID를 통해 video Id를 찾겠다.

    console.log(req.body)

    // populate을 사용하면 매개변수를 통해 mongodb에서 관련 모든 정보를 가져올 수 있다.
    Video.findOne({ "_id": req.body.videoId })   
        .populate('writer')
        .exec((err, VideoDetail) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({success : true, VideoDetail})
        })
    
        
})



router.post('/thumbnail', (req, res) => {
    // 썸네일 생성 하고 비디오 러닝타임도 가져오기..(정보)

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        //console.dir(metadata)
        //console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames){
        console.log('will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function(){
        console.log('ScreenShots taken');
        return res.json({success:true, url:filePath, fileDuration: fileDuration})
    })
    .on('error', function(err){
        console.error(err)
        return res.json({success:false, err})
    })
    .screenshot({
        count:3,
        folder: 'uploads/thumbnails',
        size : '320x240',
        filename: 'thumbnail-%b.png'
    })
})


module.exports = router;

/*
router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});
*/