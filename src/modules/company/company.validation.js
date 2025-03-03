import joi from "joi";
import {generalRuls} from "../../utils/generalRules/index.js";


export const addCompanySchema = {
  body: joi
    .object({
      companyName: joi.string().required(),
      description: joi.string().required(),
      industry: joi.string().required(),
      address: joi.string().required(),
      numberOfEmployees: joi.string().valid("1-10", "11-20", "21-50", "51-100", "100+").required(),
      companyEmail: generalRuls.email.required(),
      createdBy: generalRuls.id.required(),
      HRs: joi.array().items(generalRuls.id),
    })
    .required(),
  files: joi
    .object({
    logo: joi.array().items(generalRuls.imageFile("logo")),
    legalAttachment: joi.array().items(generalRuls.imageFile("legalAttachment")),
    coverPic: joi.array().items(generalRuls.imageFile("coverPic")),
  })};
  export const updateCompanySchema = {
    body: joi
      .object({
        companyName: joi.string(),
        description: joi.string(),
        industry: joi.string(),
        address: joi.string(),
        numberOfEmployees: joi.string().valid("1-10", "11-20", "21-50", "51-100", "100+"),
        companyEmail: generalRuls.email,
        HRs: joi.array().items(generalRuls.id),
      }),
    headers:generalRuls.headers.required(),
    params: joi.object({
      id: generalRuls.id.required(),
    }),
  };
  export const deleteCompanySchema = {
    headers:generalRuls.headers.required(),
    params: joi.object({
      id: generalRuls.id.required(),
    }),
  };
  export const searchByNameSchema = {
    headers:generalRuls.headers.required(),
    query: joi.object({
      name: joi.string().required(),
    }),
  };
  export const uploadpicSchema =(fieldname)=>{
    return{
    headers:generalRuls.headers.required(),
    params: joi.object({
      id: generalRuls.id.required(),
    }),
     files: joi
      .object({
      logo: joi.array().items(generalRuls.imageFile(fieldname)),
    }),
  }};
  export const deletepicSchema = {
    headers:generalRuls.headers.required(),
    params: joi.object({
      id: generalRuls.id.required(),
    }),
  };




 