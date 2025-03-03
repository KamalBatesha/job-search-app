import joi from "joi";
import {
  genderTypes,
  generalRuls,
  providerTypes,
  rolesTypes,
} from "../../utils/generalRules/index.js";

const currentDate = new Date();
const eighteenYearsAgo = new Date(
  currentDate.getFullYear() - 18,
  currentDate.getMonth(),
  currentDate.getDate()
);
export const updateSchema = {
  body: joi
    .object({
      firstName: joi.string(),
      lastName: joi.string(),
      gender: joi.string().valid(...Object.values(genderTypes)),
      DOB: joi.date().max(eighteenYearsAgo), // Must be greater than 18 years ago
      mobileNumber: generalRuls.phone,
    })
    .required(),
  headers: generalRuls.headers.required(),
};
export const getMyProfileSchema = {
  headers: generalRuls.headers.required(),
};
export const getProfileSchema = {
  headers: generalRuls.headers.required(),
  params: joi.object({
    id: generalRuls.id.required(),
  }),
};
export const updatePasswordSchema = {
  body: joi
    .object({
      oldPassword: generalRuls.password.required(),
      newPassword: generalRuls.password.required(),
    })
    .required(),
};
export const uploadPicSchema =(fieldname)=>{
 return {
    file: generalRuls.imageFile(fieldname).required(),
    headers: generalRuls.headers.required(),
  };
} 

export const deletPicSchema = {
  headers: generalRuls.headers.required(),
};
export const deletUserSchema = {
  headers: generalRuls.headers.required(),
  params: joi.object({
    id: generalRuls.id.required(),
  }),
};