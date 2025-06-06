const express =require('express');
const router =express.Router();

const Post = require('../models/post');
const postController = require('../controllers/post');
const upload = require('../middleware/multer.js');

router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "Blogs",
            description: "can post blogs"
        };
        let perPage = 10;
        let page = parseInt(req.query.page) || 1;
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * (page - 1))
            .limit(perPage) 
            .exec();
        const count = await Post.countDocuments(); 
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage); 
        res.json({
            data,
            current: page,
            nextpage: hasNextPage ? nextPage : null
        });
        console.log("data", data);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/post/:id', postController.getPostById);

router.post('/search', async (req, res) => {
    try {
        let searchterm=req.body.searchterm;
        const searchnospecialchar=searchterm.replace(/[^a-zA-z0-9 ]/g,"");
        const data=await post.find({
            $or:[
                {title:{$regex:new RegExp(searchnospecialchar,'i')}},
                {body:{$regex:new RegExp(searchnospecialchar,'i')}}
            ]

        })        



        res.send("search"),data;


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path; // ← This is the Cloudinary URL
    res.status(200).json({ imageUrl }); // Send to frontend or save in DB
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});
module.exports=router