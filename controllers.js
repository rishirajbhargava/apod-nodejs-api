const asyncHandler= require("express-async-handler");
require("dotenv").config();

const bcrypt = require('bcrypt');

const User = require('./models/User');


const API_KEY = process.env.API_KEY;


const getImage = asyncHandler(async (req,res)=>{

    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    const options={
        "method" :'GET',
    };

    const response = await fetch(url, options)
    .then(res=> res.json())
    .catch(err=>{
        console.log({meassage:"some error"});
    })
    res.status(200).render('home',{response, user:req.user});

});



const getLogin =asyncHandler(async (req,res)=>{
    res.status(200).render('login' , { message: "Please Login to continue!", user:req.user} )
});


const getRegister =asyncHandler(async (req,res)=>{
    res.status(200).render('register' ,{user:req.user})
});




const register = asyncHandler(async (req, res)=>{

    const {firstName, lastName , email , password, confirmPassword} = req.body;

    if(!firstName || !lastName || !email || !password || !confirmPassword){
        res.status(400).json({message: "all feilds are mandotary"});
    }

    if(password!==confirmPassword){
        res.status(400).json({message: "passwords did'nt match"});
    }

    const user = await User.findOne({email});

    if(user){
        res.status(400).json({message:"Email already registered"});
    }else{

    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
    }) 
    res.status(200).redirect('/login');
    }
    
    


    

    
  
});


const login = asyncHandler(async (req, res)=>{
    res.status(200).json({message:"sucesss" })
});

const logout = asyncHandler(async (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/login");
    });
  }); 



module.exports = {getImage, getLogin, getRegister, login, register, logout};