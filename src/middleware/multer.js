import multer from "multer"
import fs from "fs"

export const multerLocal=(customValidation=[],customPath="generals",errorMessage="invalid file type")=>{
    const fullPath=`uploads/${customPath}`
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, fullPath)
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          cb(null, file.fieldname + '-' + uniqueSuffix+'_'+file.originalname)
        }
      })
      function fileFilter (req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            return cb(null, true)
        }else{
            return cb(new Error(errorMessage), false)
        }
      
      }
      
      const upload = multer({ storage,fileFilter })
      return upload
}

export const multerHost=(customValidation=[],errorMessage="invalid file type")=>{
    
    const storage = multer.diskStorage({})
      function fileFilter (req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            return cb(null, true)
        }else{
            return cb(new Error(errorMessage), false)
        }
      
      }
      
      const upload = multer({ storage,fileFilter })
      return upload
}