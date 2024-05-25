import { Router } from "express";
import { getuser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userrouter = Router();

userrouter.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxcount: 2 },
  ]),
  registerUser
);
userrouter.get('/',getuser)
export default userrouter;
