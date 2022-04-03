const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// database connected here
require('../database/connect');

const User = require('../models/registerSchema');

router.get('/home', (req, res) => {
    res.send('hello world router js ');
  });


  //  ------------------------------- signup route ------------------------------------ // 

router.post('/register', async (req, res) => {

  const {username,email,DOB,usertype,password,cpassword } =req.body;

    if(!username || !email || !DOB || !usertype || !password || !cpassword){

      return res.status(422).json({error: "please fill the field properly"});
    }
  
  try {

    const userExist = await User.findOne({email:email});

    if (userExist) {
              return res.status(422).json({error: "User already exist"});
      } else if(password != cpassword){

        return res.status(422).json({error: "Passwords doesnot match correctly"});

      }else{

        const user = new User({username,email,DOB,usertype,password,cpassword});

        await user.save()
    
        res.status(201).json({message:"user registered successfully"});

      }

    

  } catch(err){

    console.log(err);

  }

});

// -------------------------login route ---------------------------------------------   ///

router.post('/signin' , async (req,res) =>{

  try {

      const {email , password} = req.body;

      if (!email || ! password){
        
        return res.status(422).json({error: "please fill the field properly"});
      }

      const userLoginMail = await User.findOne({email:email});

      if (userLoginMail){

        const isMatch = await bcrypt.compare(password, userLoginMail.password);
        tokenMain = await userLoginMail.generateAuthToken();

        // console.log(tokenMain);

        res.cookie('jwtoken', token ,{
          expires:new Date(Date.now() + 25892000000),
          httpOnly:true
        });

        if(!isMatch){

          res.status(400).json({error:"Invalid password"});

          }else{
            res.json({message:"user signin successfully"});
          }

    }else{
      res.json({message:"Invalid email or  user doesn't exist"});
    }

        
      

  } catch(err) {
      console.log(err);
  }

});

module.exports= router;