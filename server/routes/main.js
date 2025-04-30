const express =require('express');
const router =express.Router();

router.get('/', (req, res) => {
    const locals = {
        title: "Blogs",
        description: "can post blogs"
    };
    // console.log('Rendering page with title:', "Blogs");

    res.render('index', { locals });
});




module.exports=router