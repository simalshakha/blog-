const express =require('express');
const router =express.Router();

const Post = require('../models/post');
const postController = require('../controllers/post');
const upload = require('../middleware/multer.js');

router.get('/', async (req, res) => {
    try {
        let perPage = 10;
        let page = parseInt(req.query.page) || 1;
        const data = await Post.aggregate([
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: 'users', // this is the collection name, not model name
              localField: 'user', // in Post schema
              foreignField: '_id', // in User schema
              as: 'userInfo'
            }
          },
          { $unwind: '$userInfo' }, // turn userInfo array into a single object
          {
            $project: {
              title: 1,
              description: 1,
              image: 1,
              tags: 1,
              content: 1,
              createdAt: 1,
              updatedAt: 1,
              fullName: '$userInfo.fullName'
            }
          }
        ])
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
    const imageUrl = req.file.path; // Either a Cloudinary URL or a local path

    // Send response in Editor.js expected format
    res.status(200).json({
      success: 1,
      file: {
        url: imageUrl
      }
    });

    console.log("Image uploaded successfully:", imageUrl);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      success: 0,
      message: 'Image upload failed'
    });
  }
});

module.exports=router