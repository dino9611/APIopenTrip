const Router=require('express').Router()
const {TransactionsControllers}=require('./../controllers')
const {auth}=require('./../helpers/Auth')
const {checkuser}=require('./../helpers/checkingUser')

Router.post('/Addtocart',auth,TransactionsControllers.Addtocart) //perlu token
Router.get('/getcart',TransactionsControllers.getCart) 
Router.post('/bayarcc',auth,TransactionsControllers.onbayarCC) 
Router.post('/bayarbukti',auth,checkuser,TransactionsControllers.uploadPembayaran) 
// manage payment start
Router.get('/getwaitingApprove',TransactionsControllers.getAdminwaittingApprove)
Router.put('/approve/:id',TransactionsControllers.AdminApprove)
Router.put('/reject/:id',TransactionsControllers.Adminreject)
// manage payment end

module.exports=Router