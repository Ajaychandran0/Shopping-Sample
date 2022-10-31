var db= require('../config/connection')
var collection=require('../config/collections')
const { PRODUCT_COLLETION } = require('../config/collections')
var objectId= require('mongodb').ObjectId

module.exports={
    addProduct: (product,callback)=>{
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data.insertedId.toString())
            callback(data.insertedId.toString)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products= await db.get().collection(collection.PRODUCT_COLLETION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId)=>{

        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLETION).deleteOne({_id:objectId(proId)}).then(()=>{
                resolve('success')
            })
        })

    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLETION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLETION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Discription:proDetails.Discription,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })

    }

}