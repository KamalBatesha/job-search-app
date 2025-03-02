import { EventEmitter } from "events";
import { sendEmail } from "../../service/sendEmail.js";
import { customAlphabet } from "nanoid";
import { UserModel } from "../../DB/models/index.js";
import { emailHtml } from "../../service/templet-email.js";
import { Hash } from "../hash/index.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmailConfirmation", async ({ email }) => {
  await sendOtp({email,type:"confirmEmail",subject:"confirm email",message:"Email Confirmation"});
});
eventEmitter.on("forgetPassword", async ({ email }) => {
  await sendOtp({email,type:"forgetPassword",subject:"forget password",message:"Forget Password"});

});
// eventEmitter.on("sendNewEmailConfirmation", async (data) => {
//   const { email,id } = data;
//   const otp=customAlphabet("0123456789",4)();
//   // hash otp
//   const hashedOtp = await Hash({key:otp,SALT_ROUNDS : process.env.SALT_ROUNDS});
//   await UserModel.updateOne({tempEmail:email,_id:id},{optNewEmail:hashedOtp})
//   await sendEmail(email,"confirm email",emailHtml({otp,message:"Email Confirmation"}));
// });



async function sendOtp({email,type,subject,message}){
  const otpCode=customAlphabet("0123456789",4)();
  // hash otp
  const hashedOTP = await Hash({key:otpCode, SALT_ROUNDS:process.env.SALT_ROUNDS});
  const otpExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes from now
  await UserModel.updateOne(
    { email },
    { $addToSet: { OTP: { code: hashedOTP, type, expiresIn: otpExpiresIn } } }
  );
  await sendEmail(email,subject,emailHtml({otp:otpCode,message}));

}