import { OAuth2Client } from "google-auth-library";
import { CompanyModel, UserModel } from "../../DB/models/index.js";
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

//----------------------------addCompany----------------------------------------------------
export const addCompany = asyncHandler(async (req, res, next) => {
  const existingCompany = await CompanyModel.findOne({
    $or: [{ companyEmail: req.body.companyEmail }, { companyName: req.body.companyName }],
});
if (existingCompany){
  return next(new AppError("Company already exists", 400))
}
if(req.files?.logo?.length){
  req.body.logo = await uploadImage(req.files.logo[0].path, "companyLogo");
}
if(req.files?.legalAttachment?.length){
  req.body.legalAttachment = await uploadImage(req.files.legalAttachment[0].path, "companyLegalAttachment");
}
if(req.files?.coverPic?.length){
  req.body.coverPic = await uploadImage(req.files.coverPic[0].path, "companyCoverPic");
}
const company = await CompanyModel.create(req.body);
res.status(201).json({ message: "Company created successfully", company });
});
//----------------------------updateCompany----------------------------------------------------
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
   const { companyName, companyEmail, ...updateFields } = req.body;
   const company = await CompanyModel.findById(id);
   if (!company) {
     return next(new AppError("Company not found", 404));
   }
   if(company.createdBy.toString() !== req.user._id.toString()){
     return next(new AppError("You are not authorized to update this company", 403))
   }
   if (companyName || companyEmail) {
    const existingCompany = await CompanyModel.findOne({
        $or: [{ companyName }, { companyEmail }],
        _id: { $ne: id } // Exclude the current company from the check
    });
    if (existingCompany) {
      return next(new AppError("Company name or email already exists", 400));
      }
  }

   // Update company details (except legalAttachment)
   const updatedCompany = await CompanyModel.findByIdAndUpdate(id, {companyEmail,companyName,...updateFields}, { new: true });
   return res.status(200).json({ message: "Company updated successfully",company:updatedCompany });

   

});

//----------------------------deleteCompany----------------------------------------------------
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const company = await CompanyModel.findById(req.params.id);
  if (!company) return next(new AppError("Company not found", 404));
  
  if (company.createdBy.toString() !== req.user._id.toString() &&req.user.role!==rolesTypes.admin) {
      return res.status(403).json({ message: "You are not authorized to delete this company" });
  }
  company.deletedAt = new Date();
  await company.save();
  res.status(200).json({ message: "Company deleted successfully",company });
});
//----------------------------getRelatedJobs----------------------------------------------------
export const getRelatedJobs = asyncHandler(async (req, res, next) => {
  const company = await CompanyModel.findById(req.params.id).populate([{path:"jobs"}]);
  if (!company) return next(new AppError("Company not found", 404));

  res.status(200).json({ message: "Company deleted successfully",company });
});
//----------------------------searchByName----------------------------------------------------
export const searchByName = asyncHandler(async (req, res, next) => {
  const {name}=req.query;
  let companies=undefined;
  if(name==""){
    companies = await CompanyModel.find({deletedAt:{$exists:false}});
  }else{

    companies = await CompanyModel.find({ 
      companyName: { $regex: name, $options: "i" } ,deletedAt:{$exists:false}
    });
  }
  if(companies.length==0){
    return next(new AppError("No companies found", 404));
  }
  return res.status(200).json({ message: "done",companies });
});

 //----------------------------uploadLogo----------------------------------------------------
 export const uploadLogo = asyncHandler(async (req, res, next) => {
  const company = await CompanyModel.findById(req.params.id);
  if (!company) return next(new AppError("Company not found", 404));
  if(req.user._id.toString() !== company.createdBy.toString()){
    return next(new AppError("You are not authorized to update this company", 403))
  }
  if(company.logo?.public_id){
    await deletedImage(company.logo.public_id);
  }
  if (req.file) {
    company.logo = await uploadImage(req.file.path, "companyLogo");
  }else{
    return next(new AppError("logo is required" ,400 ));
  }
  await company.save();
  return res.status(200).json({ message: "done" });
});
 //----------------------------uploadCoverPic----------------------------------------------------
 export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  const company = await CompanyModel.findById(req.params.id);
  if (!company) return next(new AppError("Company not found", 404));
  if(req.user._id.toString() !== company.createdBy.toString()){
    return next(new AppError("You are not authorized to update this company", 403))
  }
  if(company.coverPic?.public_id){
    await deletedImage(company.coverPic.public_id);
  }
  if (req.file) {
    company.coverPic = await uploadImage(req.file.path, "companyCoverPic");
  }else{
    return next(new AppError("coverPic is required" ,400 ));
  }
  await company.save();
  return res.status(200).json({ message: "done" });
});

//----------------------------deleteLogo----------------------------------------------------
export const deleteLogo = asyncHandler(async (req, res, next) => {
  const company = await CompanyModel.findById(req.params.id);
  if (!company) return next(new AppError("Company not found", 404));
  if(req.user._id.toString() !== company.createdBy.toString()){
    return next(new AppError("You are not authorized to update this company", 403))
  }
  if(company.logo?.public_id){
    await deletedImage(company.logo.public_id);
  }
 await CompanyModel.updateOne({_id:req.params.id},{$unset:{logo:0}})
 return res.status(200).json({ message: "done" });
});

//----------------------------deleteCoverPic----------------------------------------------------
export const deleteCoverPic = asyncHandler(async (req, res, next) => {
  const company = await CompanyModel.findById(req.params.id);
  if (!company) return next(new AppError("Company not found", 404));
  if(req.user._id.toString() !== company.createdBy.toString()){
    return next(new AppError("You are not authorized to update this company", 403))
  }
  if(company.coverPic?.public_id){
    await deletedImage(company.coverPic.public_id);
  }
 await CompanyModel.updateOne({_id:req.params.id},{$unset:{coverPic:0}})
 return res.status(200).json({ message: "done" });
});
