import { Router } from "express";

import * as CS from "./company.service.js"
import * as CV from "./company.validation.js"
import { validation } from "../../middleware/validation.js";
import { multerHost } from "../../middleware/multer.js";
import { generalRuls } from "../../utils/generalRules/index.js";
import { authentication } from "../../middleware/auth.js";
import jobRouter from "../job/job.controller.js";

const companyRouter = Router();



// companyRouter.patch("/uploadProfilePic",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).single("profilePic"),validation(CV.uploadPicSchema("profilePic")),authentication,CS.uploadProfilePic)
companyRouter.post("/addCompany",
 multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).fields([
    { name: "logo", maxCount: 1 },
    { name: "legalAttachment", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
 ])
,validation(CV.addCompanySchema),CS.addCompany)

companyRouter.patch("/updateCompany/:id"
   ,validation(CV.updateCompanySchema),authentication,CS.updateCompany)

companyRouter.delete("/deleteCompany/:id"
   ,validation(CV.deleteCompanySchema),authentication,CS.deleteCompany)

companyRouter.get("/getRelatedJobs"
    ,validation(CV.deleteCompanySchema),authentication,CS.getRelatedJobs)

companyRouter.get("/searchByName"
        ,validation(CV.searchByNameSchema),authentication,CS.searchByName)

companyRouter.patch("/uploadLogo/:id",
    multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).single("logo")
    ,validation(CV.uploadpicSchema("logo")),authentication,CS.uploadLogo)

companyRouter.patch("/uploadCoverPic/:id",
     multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).single("coverPic")
    ,validation(CV.uploadpicSchema("coverPic")),authentication,CS.uploadCoverPic)

companyRouter.delete("/deleteLogo/:id",
        validation(CV.deletepicSchema),authentication,CS.deleteLogo)

companyRouter.delete("/deleteCoverPic/:id",
        validation(CV.deletepicSchema),authentication,CS.deleteCoverPic)

companyRouter.use("/:companyId",jobRouter)

export default companyRouter;
