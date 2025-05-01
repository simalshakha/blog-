const express =require('express');
const router =express.Router();

const post = require('../models/post');

router.get('/', async(req, res) => {
    const locals = {
        title: "Blogs",
        description: "can post blogs"
    };
    try{
        const data=await post.find();
        res.render('index', { locals,data });
    }catch(error){
        console.log(error);
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