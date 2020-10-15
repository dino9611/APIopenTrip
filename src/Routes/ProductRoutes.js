const Router=require('express').Router()
const {ProductContrrollers}=require('./../controllers')
// const {auth}=require('./../helpers/Auth')

Router.post('/Addproduct',ProductContrrollers.AddProduct)
Router.get('/getproduct',ProductContrrollers.getProduct)



// cannot get||post||put||delete artinya endpointnya belum adaa
module.exports=Router