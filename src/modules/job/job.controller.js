import { Router } from "express";

import * as JS from "./job.service.js"
import * as JV from "./job.validation.js"
import { validation } from "../../middleware/validation.js";
import { multerHost } from "../../middleware/multer.js";
import { generalRuls } from "../../utils/generalRules/index.js";
import { authentication } from "../../middleware/auth.js";

const jobRouter = Router({mergeParams:true});



jobRouter.post("/addJob",validation(JV.addJobSchema),authentication,JS.addJob)
jobRouter.patch("/updateJob/:id",validation(JV.updateJobSchema),authentication,JS.updateJob)
jobRouter.delete("/deleteJob/:id",validation(JV.deleteJobSchema),authentication,JS.deleteJob)
jobRouter.get(["/", "/:jobId"],validation(JV.getJobsSchema),authentication,JS.getJobs)
jobRouter.get("/getFilteredJobs",validation(JV.getFilteredJobsSchema),authentication,JS.getFilteredJobs)
jobRouter.get("/applyForJob/:jobId",multerHost(generalRuls.pdf).single("cv"),
    validation(JV.applyForJobSchema),authentication,JS.applyForJob)



export default jobRouter;
