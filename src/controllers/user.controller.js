import {asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
   //algorithm
   //1- get users details from front-end
   const {fullName, email, username, password} =req.body
   console.log("email", email);
   //2-validation -not empty
   if (
      [fullName, email, username, password].some(()=>field?.trim()==="")
   ) {
      throw new ApiError(400, "All fields are required")
   }
   //3-check if user already exists : username, email

   const existedUser= User.findOne({
      $or: [{ username },{ email }]
   })
  
   if(existedUser){
      throw new ApiError(409, "user with email or username  already exists");  
   }
   //4-check for images, check for avatar
   
   
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
   throw new ApiError(400, " Avatar file is required");
  }
  //5-upload thm to cloudinary, avatar
  const avatar=await uploadOnCloudinary(avatarLocalPath);
  const coverImage= await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
   throw new ApiError(400, " Avatar file is required");
  }

  //6 create user object- create entry in db

 const user = await User.create({
   fullName,
   avatar:avatar.url,
   coverImage:coverImage?.url || "",
   email,
   password,
   username:username.toLowerCase()
  })
   //7 remove password and refresh token field  from response

  const createdUser = await User.findById(user._id).select(
   "-password -refreshToken"
  )
   //8 check for user creation

  if(!createdUser){
   throw new ApiError(500, "Something went wrong while registering the user")
  }
  
   //9 return res
   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")
   )

    
})
export{registerUser}




