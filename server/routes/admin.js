const express =require('express');
const router =express.Router();

const post = require('../models/post');
const user = require('../models/user');

const adminLayout='../views/layouts/admin';


router.get('/admin', async (req, res) => {
    try {
        
        res.render('admin/index',{layout: adminLayout}); 

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/admin', async (req, res) => {
    try {
        const{username,password}=req.body;
        
        if(req.body.username=='admin'&& req.body.password== '123')
        {
            res.send('you are login');
        }
        else
        { 
            res.send('you are not login');
        }

    } catch (error) {
        console.log(error);
        res.redirect('/admin')
    }
});
module.exports=router
