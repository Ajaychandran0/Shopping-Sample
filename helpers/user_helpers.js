var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { response } = require('../app')

module.exports = {

    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {
            // let result
            console.log(userData.Email)

            let result =await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            let userExist=false
            if (result) {

                console.log('user exists')
                userExist= true
                resolve(userExist)

            } else {
                userData.Password = await bcrypt.hash(userData.Password, 10)
                console.log('user added successfully')

                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {

                    resolve(data)
                })
            }
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {

                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {

                        console.log('login successfull')
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed')
                        resolve({ status: false })
                    }
                })

            } else {
                console.log('login failed')
                resolve({ status: false })
            }
        })
    },

    getAllUser: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser: (userId) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: ObjectId(userId) }).then(() => {
                resolve('success')
            })
        })

    },
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },

    updateUser: (userId, userDetails) => {
        return new Promise(async(resolve, reject) => {
            console.log(userDetails.Email)
            let result=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userDetails.Email})
            let userExist=false
            console.log(result)
            if(result && result.Email!=userDetails.email){
                
                console.log('User with this email already exist')
                userExist=true
                resolve(userExist)
                

            }else{
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
                    $set: {
                        fName: userDetails.fName,
                        lName: userDetails.lName,
                        Email: userDetails.Email,
    
                    }
                }).then((response) => {
                    resolve()
                })

            }
          
        })

    }

}