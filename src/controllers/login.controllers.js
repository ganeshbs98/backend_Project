import { User } from "../models/user.models.js";
import { Apierror } from "../utils/ApiError.js";
import cookieParser from "cookie-parser";
import { asyncHandler } from "../utils/asynchandler.js";
import multer from "multer";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (e) {
    console.error("Error in generateAccessAndRefreshToken:", e.message);
    throw new Error(
      "Something went wrong while generating refresh or access tokens"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email && !username)
    throw new Apierror(400, "username or email is required");

  const user = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  //   console.log("user----",user._id)
  if (!user) throw new Apierror(404, "user not found/doesn't exist");

  const ispasswordValid = await user.ispasswordCorrect(password);
  if (!ispasswordValid) throw new Apierror(404, "Invalid Password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json({
      user: loggedInUser,
      accesstoken: accessToken,
      refreshtoken: accessToken,
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  
  return res
    .status(200)
    .clearCookie("access_token", cookieOptions)
    .clearCookie("refresh_token", cookieOptions)
    .json({ message: "user logged out" });
});

export { loginUser, logoutUser };
