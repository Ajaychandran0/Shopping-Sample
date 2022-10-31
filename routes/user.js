var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var userHelpers= require('../helpers/user_helpers')


/* GET home page. */
router.get('/', function(req, res, next) {

  let user= req.session.user
 
  
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{products,user});
  })
  
});


router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    
    res.redirect('/')
  }else{
    
    res.render('user/login',{loginErr:req.session.loginErr})
    req.session.loginErr=false
  }
  
})

router.get('/signup',(req,res)=>{
  if(req.session.loggedIn){
    
    res.redirect('/')
  }else{
    
    res.render('user/signup',{signupErr:req.session.signupErr})
    req.session.signupErr=false
  }
})

router.post('/signup',(req,res)=>{

  userHelpers.doSignup(req.body).then((response)=>{
    if(response==true){

      req.session.signupErr=true
      res.redirect('/signup')

    }else{
      res.redirect('/login')
      
    }
    
  })
})

router.post('/login',(req,res)=>{

  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr=true
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.loggedIn=false
  req.session.user=null
  res.redirect('/login')
})




module.exports = router;
