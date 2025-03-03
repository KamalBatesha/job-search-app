import joi from "joi";
import { generalRuls } from "../../utils/generalRules/index.js";


// //======================================registerSchema====================================
// export const registerSchema= joi.object({
//     name:joi.string().required(),
//     email:generalRuls.email.required(),
//     password:generalRuls.password.required(),
//     phone:joi.string().required()
// })

// //======================================loginSchema====================================
// export const loginSchema= joi.object({
//     email:generalRuls.email.required(),
//     password:generalRuls.password.required(),
// })

//======================================checkTokenSchema====================================
export const checkTokenSchema= joi.object({
    authorization:joi.string().required(),
})
//======================================banUserSchema====================================
export const banSchema= joi.object({
    authorization:joi.string().required(),
    id:generalRuls.id.required(),
})
