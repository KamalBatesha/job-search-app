import * as AV from "./validation.js";
import { validation } from "../../middleware/validation.js";
import { CompanyModel, UserModel } from "../../DB/models/index.js";
import { Compare } from "../../utils/hash/compare.js";
import { generateToken } from "../../utils/token/generateToken.js";
import { authorization, decodedTokenQl, tokenTypes } from "../../middleware/auth.js";
import { rolesTypes } from "../../utils/generalRules/index.js";


//======================================getAllUsersAndCompanies====================================
export const getAllUsersAndCompanies = async (parent, args) => {
   validation({ schema: AV.checkTokenSchema, data: args });
   let user=await decodedTokenQl({ authorization: args.authorization, tokenType: tokenTypes.acess });
   if (user.role !== rolesTypes.admin) {
     throw new Error("Access denied", { cause: 403 });
   }
  let users = await UserModel.find({});
  let companies = await CompanyModel.find({});

  return { users, companies };
};

//======================================banUser====================================
export const banUser = async (parent, args) => {
  validation({ schema: AV.banSchema, data: args });
  let user=await decodedTokenQl({ authorization: args.authorization, tokenType: tokenTypes.acess });
  if (user.role !== rolesTypes.admin) {
    throw new Error("Access denied", { cause: 403 });
  }
  let userToBan = await UserModel.findById(args.id);
  if (!userToBan) {
    throw new Error("User not found", { cause: 404 });
  }
  if(userToBan.bannedAt){
   userToBan= await UserModel.findOneAndUpdate({ _id: args.id }, { $unset: { bannedAt: 0 } }, { new: true });
  }else{
   userToBan= await UserModel.findOneAndUpdate({ _id: args.id }, { $set: { bannedAt: new Date() } }, { new: true });
  }


 return userToBan;
};

//======================================banCompany====================================
export const banCompany = async (parent, args) => {
  validation({ schema: AV.banSchema, data: args });
  let user=await decodedTokenQl({ authorization: args.authorization, tokenType: tokenTypes.acess });
  if (user.role !== rolesTypes.admin) {
    throw new Error("Access denied", { cause: 403 });
  }
  let companyToBan = await CompanyModel.findById(args.id);
  if (!companyToBan) {
    throw new Error("company not found", { cause: 404 });
  }
  if(companyToBan.bannedAt){
    companyToBan= await CompanyModel.findOneAndUpdate({ _id: args.id }, { $unset: { bannedAt: 0 } }, { new: true });
  }else{
    companyToBan= await CompanyModel.findOneAndUpdate({ _id: args.id }, { $set: { bannedAt: new Date() } }, { new: true });
  }


 return companyToBan;
};

//======================================approveCompany====================================
export const approveCompany = async (parent, args) => {
  validation({ schema: AV.banSchema, data: args });
  let user=await decodedTokenQl({ authorization: args.authorization, tokenType: tokenTypes.acess });
  if (user.role !== rolesTypes.admin) {
    throw new Error("Access denied", { cause: 403 });
  }
  let company = await CompanyModel.findById(args.id);
  if (!company) {
    throw new Error("company not found", { cause: 404 });
  }
  company.approvedByAdmin = true;
  await company.save();


 return company;
};

