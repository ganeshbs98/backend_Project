import express from'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import multer from 'multer'
const app=express()

const upload=multer()



app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())
app.use(upload.array())

import router from './routes/user.route.js'
import loginrouter from './routes/login.routes.js'
app.get('/',()=>{
    res.send("hello world")
})

const userRouter=router
const LoginRouter=loginrouter
//routes decalration


// console.log("unsdndsloginrouter methods",LoginRouter)
app.use('/api/v1/users',userRouter)

app.use('/api/v1/login',LoginRouter)


export {app}