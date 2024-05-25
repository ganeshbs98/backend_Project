import express from'express'
import { loginUser, logoutUser } from '../controllers/login.controllers.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'

const loginrouter=express.Router()


loginrouter.post('/',loginUser)

loginrouter.post('/logout',verifyJwt,logoutUser)


export default loginrouter

