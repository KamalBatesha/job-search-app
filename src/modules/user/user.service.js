import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../../DB/models/index.js";
import { deletedImage, uploadImage } from "../../utils/cloudinary/index.js";
import { providerTypes, rolesTypes } from "../../utils/generalRules/index.js";
import {
  AppError,
  asyncHandler,
} from "../../utils/globalErrorHandling/index.js";
import { Compare } from "../../utils/hash/compare.js";
import { eventEmitter } from "../../utils/sendEmailEvent/index.js";
import { generateToken } from "../../utils/token/generateToken.js";
import { decodedToken, tokenTypes } from "../../middleware/auth.js";

//----------------------------update----------------------------------------------------
export const update = asyncHandler(async (req, res, next) => {
  let updatedUser = await UserModel.updateOne(
    { email: req.user.email },
    { ...req.body }
  );
  return res.status(200).json({ message: "done", user: updatedUser });
});

//----------------------------getMyProfile----------------------------------------------------
export const getMyProfile = asyncHandler(async (req, res, next) => {
 return res.status(200).json({ message: "done", user:req.user });
});

//----------------------------getProfile----------------------------------------------------
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  if(user.deletedAt){
    return next(new AppError("user deleted", 404));
  }
  return res.status(200).json({ message: "done", user:{
    userName:user.userName,
    DOB:user.DOB,
    mobileNumber:user.mobileNumber,
    profilePic:user.profilePic.secure_url,
    coverPic:user.coverPic.secure_url,

  } });
 });

 //----------------------------updatePassword----------------------------------------------------
export const updatePassword = asyncHandler(async (req, res, next) => {
  const {oldPassword, newPassword } = req.body;
  if(!await Compare({ key: oldPassword, hashed: req.user.password })){
    return next(new AppError("old Password is wrong" ,400 ));
  }

  // update user
  req.user.password = newPassword;
  req.user.changeCredentialTime=new Date();
  await req.user.save();

  return res.status(200).json({ message: "done" });
});

 //----------------------------uploadProfilePic----------------------------------------------------
 export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  if(req.user.profilePic.public_id){
    await deletedImage(req.user.profilePic.public_id);
  }
  if (req.file) {
    req.user.profilePic = await uploadImage(req.file.path, "profilePic");
  }else{
    return next(new AppError("profilePic is required" ,400 ));
  }
  await req.user.save();
  return res.status(200).json({ message: "done" });
});
 //----------------------------uploadCoverPic----------------------------------------------------
 export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  if(req.user.coverPic.public_id){
    await deletedImage(req.user.coverPic.public_id);
  }
  if (req.file) {
    req.user.coverPic = await uploadImage(req.file.path, "coverPic");
  }else{
    return next(new AppError("coverPic is required" ,400 ));
  }
  await req.user.save();
  return res.status(200).json({ message: "done" });
});

//----------------------------deleteProfilePic----------------------------------------------------
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  if(req.user.profilePic?.public_id){
    await deletedImage(req.user.profilePic.public_id);
  }
 await UserModel.updateOne({_id:req.user._id},{$unset:{profilePic:0}})
 return res.status(200).json({ message: "done" });
});

//----------------------------deleteCoverPic----------------------------------------------------
export const deleteCoverPic = asyncHandler(async (req, res, next) => {
 if(req.user.coverPic?.public_id){
   await deletedImage(req.user.coverPic.public_id);
 }
 await UserModel.updateOne({_id:req.user._id},{$unset:{coverPic:0}})
 return res.status(200).json({ message: "done" });
});

//----------------------------deleteUser----------------------------------------------------
export const deleteUser = asyncHandler(async (req, res, next) => {
  if(req.user._id!=req.params.id && req.user.role!=rolesTypes.admin){
    return next(new AppError("you don't have permission to delete this user" ,401 ));
  }
  await UserModel.updateOne({_id:req.params.id},{$set:{deletedAt:new Date()}})
  return res.status(200).json({ message: "done" });
 });
 