const Router=require('express').Router()
const {TransactionsControllers}=require('./../controllers')
const {auth}=require('./../helpers/Auth')

Router.post('/Addtocart',auth,TransactionsControllers.Addtocart) //perlu token
Router.get('/getcart',TransactionsControllers.getCart) 
Router.post('/bayarcc',TransactionsControllers.onbayarCC) 

module.exports=Router