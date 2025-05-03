const express =require('express');
const router =express.Router();

const post = require('../models/post');
const user = require('../models/user');

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


const adminLayout='../views/layouts/admin';
const jwtsecret=process.env.JWT_SECRET



const authMiddleware=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unautorized'});
    }
    try{
        const decoded=jwt.verify(token,jwtSecret);
        req.userId=decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({message:'Unautorized'});

    }
}



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
        const { username, password } = req.body;
        const user =await User.findOne({username});
        if(!user)
            {
            return res.status(401).send('Internal Server Error');
            }
        
        const ispasswordvalid = await bcrypt.compare(password,user.password);
        if(!ispasswordvalid)
            {
            return res.status(401).send('Internal Server Error');
            }
        const token =jwt.sign({userId:user._id},jwtSecret);
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard');



    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});
router.get('/dashboard',authMiddleware,async(req,res)=>{
    try{

        const data=await post.find();
        res.render('/admin/dashboard',{data});

    }catch(error){
    res.render('admin/dashboard');}
})


router.get('/add-post',authMiddleware,async(req,res)=>{
    try{
        const newpost=new post({
            title: req.body.title,
            body: req.body.body
        })
        await post.create(newpost);
        res.redirect('/dashboard');
        
    }catch(error){
    res.render('admin/dashboard');}
})


router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
        };

        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }

router.post('/register', async (req, res) => {
    try {
        const{username,password}=req.body;
        const hashedpassword=await bcrypt.hash(password,10);
        try{
            const user=await user.create({
                username,
                password:hashedpassword
            });
            res.status(201).json({message:'user created',user});
        }catch(error){
            if (error.code===11000){
                res.status(409).json({message:'user existed',user});
            }
            res.status(500).json({message:'internal server error',user});
        }

    } catch (error) {
        console.log(error);
        res.redirect('/admin')
    }
});

router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

});


router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
});


module.exports = router;