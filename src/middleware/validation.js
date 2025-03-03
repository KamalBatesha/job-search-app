import { AppError, asyncHandler } from "../utils/globalErrorHandling/index.js";

export const validation = (schema) => {
  
  return asyncHandler (
    (req, res, next) => {
      const errorResult = [];
      for (const key of Object.keys(schema)) {        
        let { error } = schema[key].validate(req[key], { abortEarly: false });
        if (error) {
          errorResult.push(error);
        }
      }
  
      if (errorResult.length) {
      return next(new AppError(errorResult,400))
      }
  
      next();
    }
  )
};

export const validationQraph = ({ schema, data }) => {
  let { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new AppError(error, 400);
  }
};

