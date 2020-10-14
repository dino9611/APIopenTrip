const Router=require('express').Router()
const {AuthControllers}=require('./../controllers')
// const {auth}=require('./../helpers/Auth')

Router.post('/register',AuthControllers.register)
Router.post('/login',AuthControllers.Login)
// Router.post('/login',AuthControllers.Login)
// Router.post('/sendverify',AuthControllers.sendverified)
// Router.get('/verified',auth,AuthControllers.verified)
// Router.get('/keeplogin/:id',AuthControllers.keeplogin)

// cannot get||post||put||delete artinya endpointnya belum adaa
module.exports=Router