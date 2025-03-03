import joi from "joi";
import {
  genderTypes,
  generalRuls,
  providerTypes,
  rolesTypes,
} from "../../utils/generalRules/index.js";

export const addJobSchema = {
  body: joi
    .object({
      jobTitle: joi.string().required(),
      jobDescription: joi.string().required(),
      technicalSkills: joi.array().items(joi.string()).required(),
      softSkills: joi.array().items(joi.string()).required(),
      jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
      workingTime: joi.string().valid("part-time", "full-time").required(),
      seniorityLevel: joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
      companyId: generalRuls.id.required(),
    })
    .required(),
  };
  export const updateJobSchema = {
    body: joi
      .object({
        jobTitle: joi.string(),
        jobDescription: joi.string(),
        technicalSkills: joi.array().items(joi.string()),
        softSkills: joi.array().items(joi.string()),
        jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
        workingTime: joi.string().valid("part-time", "full-time"),
        seniorityLevel: joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
      })
      .required(),
      params: joi.object({
        id: generalRuls.id.required(),
      }).required(),
      headers:generalRuls.headers.required()
    };

    export const deleteJobSchema = {
      params: joi.object({
        id: generalRuls.id.required(),
      }).required(),
    headers:generalRuls.headers.required()
    };

    export const getJobsSchema = {
      params: joi.object({
        jobId: generalRuls.id,
        companyId: generalRuls.id,
      }).required(),
      query: joi.object({
        page: joi.number().integer().min(1).default(1),
        limit: joi.number().integer().min(1).max(100).default(10),
        sort: joi.string().default("-createdAt"),
        search: joi.string(),
      })
      ,
    headers:generalRuls.headers.required()
    };
  
    export const getFilteredJobsSchema = {
      query: joi.object({
        page: joi.number().integer().min(1).default(1),
        limit: joi.number().integer().min(1).max(100).default(10),
        sort: joi.string().default("-createdAt"),
        jobTitle: joi.string(),
        jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
        workingTime: joi.string().valid("part-time", "full-time"),
        seniorityLevel: joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
        technicalSkills: joi.string(),
      })
      ,
    headers:generalRuls.headers.required()
    };
    export const applyForJobSchema = {
     params: joi.object({
        jobId: generalRuls.id.required(),
      }).required(),
    headers:generalRuls.headers.required(),
    file:generalRuls.imageFile("cv").required()
    };