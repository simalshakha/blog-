const express =require('express');
const router =express.Router();

const Post = require('../models/post');
const Topic = require('../models/topics');


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
            .limit(perPage) // ✅ Fixed typo here
            .exec();

        const count = await Post.countDocuments(); // ✅ Better method for counting docs

        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage); // ✅ Fixed Math casing

        res.render("index", {
            locals,
            data,
            current: page,
            nextpage: hasNextPage ? nextPage : null
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

    

router.get('/post/:id', async (req, res) => {
    try {
        

        const slug = req.params.id;

        // const data = await Post.findById(slug); 
        const data = await Post.findById(slug).populate('user', 'username');
        const topics = await Topic.find({ post: slug });
        console.log('Full Post:', topics);

        res.render('post', { data,username:data.user.username,topics }); // Fixed typo 'loscal'

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});



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


// function insertpostdata(){
//     post.insertMany([
//     {
//         title:"building  a blog",
//         body: "this is body"
//     },
// ])
// }
// insertpostdata();



module.exports=router