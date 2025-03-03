import { Router } from "express";

import * as US from "./user.service.js"
import * as UV from "./user.validation.js"
import { validation } from "../../middleware/validation.js";
import { multerHost } from "../../middleware/multer.js";
import { generalRuls } from "../../utils/generalRules/index.js";
import { authentication } from "../../middleware/auth.js";

const userRouter = Router();



userRouter.patch("/update",validation(UV.updateSchema),authentication,US.update)
userRouter.get("/getMyProfile",validation(UV.getMyProfileSchema),authentication,US.getMyProfile)
userRouter.get("/getProfile/:id",validation(UV.getProfileSchema),authentication,US.getProfile)
userRouter.patch("/updatePassword",validation(UV.updatePasswordSchema),authentication,US.updatePassword)
userRouter.patch("/uploadProfilePic",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).single("profilePic"),validation(UV.uploadPicSchema("profilePic")),authentication,US.uploadProfilePic)
userRouter.patch("/uploadCoverPic",multerHost(generalRuls.image,`you can only upload images of type ${generalRuls.image.join(" or ")}`).single("coverPic"),validation(UV.uploadPicSchema("coverPic")),authentication,US.uploadCoverPic)
userRouter.delete("/deleteProfilePic",validation(UV.deletPicSchema),authentication,US.deleteProfilePic)
userRouter.delete("/deleteCoverPic",validation(UV.deletPicSchema),authentication,US.deleteCoverPic)
userRouter.delete("/deleteUser/:id",validation(UV.deletUserSchema),authentication,US.deleteUser)


export default userRouter;
