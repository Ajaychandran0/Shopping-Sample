var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user_helpers')
var adminHelpers=require('../helpers/admin-helpers')

//verify login middleware
const verifyLogin = (req,res,next)=>{
  if(req.session.loggedAdminIn)
  next()
  else
  res.redirect("/admin/login")
}

/* GET users listing. */
router.get('/', function(req, res) {
  

  if(req.session.loggedAdminIn){
   
    let admin=req.session.admin
    userHelpers.getAllUser().then((users)=>{
      res.render('admin/view-users',{admin,users});
    })
   
  }else{
    
    res.render('admin/login',{loginErr:req.session.loginErr,admin:true})
    req.session.loginErr=false
  }
});

router.get('/products', function(req, res, next) {

  if(req.session.loggedAdminIn){
    
    productHelpers.getAllProducts().then((products)=>{
      res.render('admin/view-products',{admin:true,products});
    })
  }else{
    
    res.render('admin/login',{loginErr:req.session.loginErr,admin:true})
    req.session.loginErr=false
  }
  

});



router.get('/add-product',verifyLogin,(req,res)=>{
  res.render('admin/add-product',{admin:true})

})

router.get('/add-user',verifyLogin,(req,res)=>{
  res.render('admin/add-user',{admin:true,addUserErr:req.session.addUserErr})
  req.session.addUserErr=false
})

router.post('/add-product',verifyLogin,(req,res)=>{
  productHelpers.addProduct(req.body,(id)=>{
    
      res.redirect('/admin/add-product')
      console.log(req.body.Name)
    })  
})

router.post('/add-user',verifyLogin,(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{

    if(response==true){

      req.session.addUserErr=true
    }
      res.redirect('/admin/add-user')
  })

  
})

router.get('/delete-product/:id',(req,res)=>{
  let proId= req.params.id
  
  productHelpers.deleteProduct(proId).then((response)=>{
    console.log(response)
    res.redirect('/admin/products')
  })

})

router.get('/delete-user/:id',(req,res)=>{
  let userId=req.params.id
  console.log(userId);
  userHelpers.deleteUser(userId).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id',verifyLogin, async(req,res)=>{

  let product= await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product,admin:true})

})

router.get('/edit-user/:id',verifyLogin, async(req,res)=>{
  
  let user= await userHelpers.getUserDetails(req.params.id)
  console.log(user+"hey hello")
  res.render('admin/edit-user',{user,admin:true})
  
})

router.post('/edit-product/:id',(req,res)=>{

  productHelpers.updateProduct(req.params.id,req.body).then((response)=>{
    res.redirect('/admin/products')
  })
})

router.post('/edit-user/:id',verifyLogin,(req,res)=>{

  userHelpers.updateUser(req.params.id,req.body).then(async(response)=>{
    if(response==true){
           
      let user= await userHelpers.getUserDetails(req.params.id)
      
      req.session.updateErr=true
      res.render('admin/edit-user',{user,admin:true,updateErr:req.session.updateErr})
      req.session.updateErr=false
      
    }else{

      res.redirect('/admin') 

    }     
    
   
  })
})

// admin login

router.get('/login',(req,res)=>{
  if(req.session.loggedAdminIn){
    
    res.redirect('/admin')
  }else{
    
    res.render('admin/login',{loginErr:req.session.loginErr,admin:true})
    req.session.loginErr=false
  }
  
})


router.post('/login',(req,res)=>{

  adminHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedAdminIn=true
      req.session.admin=response.admin
      res.redirect('/admin')
    }else{
      req.session.loginErr=true
      res.redirect('/admin/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.loggedAdminIn=false
  req.session.admin=null
  res.redirect('/admin/login')
})



module.exports = router;
