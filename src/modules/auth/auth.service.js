import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../../DB/models/index.js";
import { uploadImage } from "../../utils/cloudinary/index.js";
import { providerTypes, rolesTypes } from "../../utils/generalRules/index.js";
import { AppError, asyncHandler } from "../../utils/globalErrorHandling/index.js";
import { Compare } from "../../utils/hash/compare.js";
import { eventEmitter } from "../../utils/sendEmailEvent/index.js";
import { generateToken } from "../../utils/token/generateToken.js";
import { decodedToken, tokenTypes } from "../../middleware/auth.js";


//----------------------------signUp----------------------------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
  const {email} = req.body;

  const emailExist = await UserModel.findOne({ email });
  if (emailExist) {
    return next(new AppError("email already exist", 409 ));
  }

  //upload image cloudinary
  if (req.files?.profilePic?.length) {
    req.body.profilePic = await uploadImage(req.files.profilePic[0].path, "profilePic");
  }
  if (req.files?.coverPic?.length) {
    req.body.coverPic = await uploadImage(req.files.coverPic[0].path, "coverPic");
  }
  // send otp
  eventEmitter.emit("sendEmailConfirmation", { email });
  // create user
  const user = await UserModel.create(req.body);
  return res.status(200).json({ message: "done", user });
});

//----------------------------confirmEmail----------------------------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({ email, isConfirmed: false });
  if (!user) {
    return next(new AppError("email not exist or confirmed" ,404 ));
  }

  // compare otp
  const otpRecord = user.OTP.find(entry => entry.type === "confirmEmail" && entry.expiresIn > new Date());
  if (!otpRecord ||  !await Compare({ key: otp, hashed: otpRecord.code }) ) {
    return next(new AppError("invalid otp or expired" ,401 ));
  }
  // update user
  const updatedUser = await UserModel.updateOne(
    { email },
    { isConfirmed: true, $pull: { OTP: otpRecord } }
  );

  return res.status(200).json({ message: "done", user: updatedUser });
});

//----------------------------signIn----------------------------------------------------
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
        const user = await UserModel.findOne({ email, provider: "system" ,isConfirmed: true ,deletedAt:{$exists:false}});
        if (!user || !await Compare({key:password, hashed:user.password})) {
            return next(new AppError("invalid email or password", 400));
        }
        const accessToken = await generateToken({
          payload: { email, id: user._id },
          SIGNATURE:
            user.role == rolesTypes.user
              ? process.env.ACESS_SIGNATURE_TOKEN_USER
              : process.env.ACESS_SIGNATURE_TOKEN_ADMIN,
          option: { expiresIn: "1h" },
        });
      
        // generate refresh_token
        const refreshToken = await generateToken({
          payload: { email, id: user._id },
          SIGNATURE:
            user.role == rolesTypes.user
              ? process.env.REFRESH_SIGNATURE_TOKEN_USER
              : process.env.REFRESH_SIGNATURE_TOKEN_ADMIN,
          option: { expiresIn: "1w" },
        });

        return res.status(200).json({ message: "done", accessToken, refreshToken });
});


//----------------------------loginWithGmail----------------------------------------------------
export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
        audience: process.env.WEB_CLIENT_ID
    });
    const payload = ticket.getPayload();
    return payload;
    
  }
  let {picture,name,email_verified,email}=await verify();
  if(!email_verified){
    return next(new AppError("email not verified" ,404 ));
    }
    let user = await UserModel.findOne({ email});
    if (!user) {
      name=name.split(" ");
      user=await UserModel.create({email,firstName:name[0],lastName:name[1]||"",profilePic:picture,confirmed:email_verified,provider:providerTypes.google});
    }
    if(user?.provider!==providerTypes.google){
      return next(new AppError("please login with system" ,404 ));
    }
    // generate acess_toke
  const accessToken = await generateToken({
    payload: { email, id: user._id },
    SIGNATURE:
      user.role == rolesTypes.user
        ? process.env.ACESS_SIGNATURE_TOKEN_USER
        : process.env.ACESS_SIGNATURE_TOKEN_ADMIN,
    option: { expiresIn: "1d" },
  });

  // generate refresh_token
  const refreshToken = await generateToken({
    payload: { email, id: user._id },
    SIGNATURE:
      user.role == rolesTypes.user
        ? process.env.REFRESH_SIGNATURE_TOKEN_USER
        : process.env.REFRESH_SIGNATURE_TOKEN_ADMIN,
    option: { expiresIn: "1w" },
  });

  return res
    .status(200)
    .json({ message: "done", accessToken, refreshToken  });
});

//----------------------------forgetPassword----------------------------------------------------
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email ,deletedAt:{$exists:false}});
  if (!user) {
    return next(new AppError("email not exist or deleted" ,404 ));
  }
  eventEmitter.emit("forgetPassword", { email });

  return res.status(200).json({ message: "done" });
});

//----------------------------resetPassword----------------------------------------------------
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { otp,email,newPassword } = req.body;

  const user = await UserModel.findOne({ email,deletedAt:{$exists:false}});
  if (!user) {
    return next(new AppError("email not exist or deleted" ,404 ));
  }
   // compare otp
   const otpRecord = user.OTP.find(entry => entry.type === "forgetPassword" && entry.expiresIn > new Date());
   if (!otpRecord ||  !await Compare({ key: otp, hashed: otpRecord.code }) ) {
     return next(new AppError("invalid otp or expired" ,401 ));
   }
   user.password=newPassword;
   user.OTP=[];
   user.isConfirmed=true;
   user.changeCredentialTime=new Date();
   await user.save();

  return res.status(200).json({ message: "done" });
});

//----------------------------refreshToken----------------------------------------------------
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user=await decodedToken({authorization,tokenType:tokenTypes.refresh,next})
  if(!user){
    return next(new AppError("invalid token" ,401 ));
  }
  
  // generate accessToken
  const accessToken = await generateToken({
    payload: { email: user.email, id: user._id },
    SIGNATURE:
      user.role == rolesTypes.user
        ? process.env.ACESS_SIGNATURE_TOKEN_USER
        : process.env.ACESS_SIGNATURE_TOKEN_ADMIN,
    option: { expiresIn: "1h" },
  });

  return res
    .status(200)
    .json({ message: "done",  accessToken  });
});
