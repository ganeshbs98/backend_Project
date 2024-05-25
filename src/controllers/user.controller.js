import { asyncHandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloundinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiResponse.js";
import cookieParser from "cookie-parser";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = user.generateAccessToken;
    const refreshtoken = user.generateRefreshToken;
    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (e) {
    throw new Apierror(500, "somethign went wrong while generating user");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //getting the user data
  const { username, email, password, fullName } = req.body;
  //verifying all the fields are not empty
  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new Apierror(400, "All the fields required");
  }

  //verifying if the user is existing user or not
  const existedUser = await User.findOne({ email });
  if (existedUser) throw new Apierror(400, "user already exist");

  // getting the local path b for the images from middleware
  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverLocalpath = req.files?.coverImage[0]?.path;

  //uplaoding the image to the cloudinary
  if (!avatarLocalpath) throw new Apierror(400, "avatar file is required");
  const avatarResponse = await uploadOnCloundinary(avatarLocalpath);
  const coverResponse = await uploadOnCloundinary(coverLocalpath);
  console.log(avatarResponse.url, coverResponse.url);
  //creating the new user
  const user = await User.create({
    email: email,
    fullName: fullName,
    avatar: avatarResponse.url,
    coverImage: coverResponse?.url || "",
    password: password,
    username: username,
  });
  //getting the user details excluding the password and refresh token
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser)
    throw new Apierror(500, "Something went while creating user ");
  //sending the data once the user is created successfully

  console.log("user created-------",createdUser)
  return res
    .status(200)
    .json(new Apiresponse(200, createdUser, "Regsitered  successfully"));
});

// const loginuser = asyncHandler(async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email)
//     throw new Apierror(400, "required username and email");

//   const user = await User.find({
//     $or: [{ username: username, email: email }],
//   });

//   if (!user)
//     throw new Apierror(400, "User doesn't exist Please register your account");

//   const isPasswordvalid = await user.ispasswordCorrect(password);
//   if (!isPasswordvalid) throw new Apierror(400, "inavlid user credentails");

//   const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(
//     user._id
//   );

//   const loggedInUser = await User.findById(user._id).select(
//     "-password,-refreshtoken"
//   );
//   const options = {
//     httpOnly: true,
//     secure: true,
//   };
//   return res
//     .status(200)
//     .cookie("access_token", accesstoken, options)
//     .cookie("refresh_token", refreshtoken, options)
//     .json(
//       new Apiresponse(
//         200,
//         {
//           user: loggedInUser,
//           accesstoken: accesstoken,
//           refreshtoken: refreshtoken,
//         },
//         "user logged in succesfully"
//       )
//     );
// });


const getuser=asyncHandler(async (req,res)=>{
  const user=await User.find().select("-password -refreshtoken");
  return res.status(200).json(new Apiresponse(200,user,"user details"));
})
export { registerUser ,getuser};
