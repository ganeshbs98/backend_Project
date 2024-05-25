import jwt from "jsonwebtoken";
import { Apierror } from "../utils/ApiError.js";
import dotenv from "dotenv";
import { User } from "../models/user.models.js";

dotenv.config({ path: "./.env" });

export const verifyJwt = async (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    req.headers("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Apierror(401, "Unauthorized request");
  try {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password,-refresh"
    );

    if (!user) throw new Apierror(400, "user not found");
    req.user = user;
    next();
  } catch (e) {
    throw new Apierror(400, e.message);
  }
};
