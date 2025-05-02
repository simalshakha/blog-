const express =require('express');
const router =express.Router();

const post = require('../models/post');

router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "Blogs",
            description: "can post blogs"
        };

        let perPage = 1;
        let page = parseInt(req.query.page) || 1;

        const data = await post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * (page - 1))
            .limit(perPage) // ✅ Fixed typo here
            .exec();

        const count = await post.countDocuments(); // ✅ Better method for counting docs

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

        const data = await post.findById(slug); 

        res.render('post', { data }); // Fixed typo 'loscal'

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