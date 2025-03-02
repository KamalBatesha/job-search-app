import { UserModel } from "../DB/models/index.js";
import { asyncHandler } from "../utils/globalErrorHandling/index.js";
import { verifyToken } from "../utils/token/verifyToken.js";

const roles = {
  admin: "admin",
  user: "bearer",
};
export const tokenTypes = {
  acess: "acess",
  refresh: "refresh",
};

export const decodedToken = async ({ authorization, tokenType, next }) => {
  if (!authorization) {
    return next(new Error("No authorization header provided", { cause: 400 }));
  }

  const [prefix, token] = authorization.split(" ");
  if (!prefix || !token) {
    return next(new Error("No token provided", { cause: 400 }));
  }

  let REFRESH_SIGNATURE = undefined;
  let ACESS_SIGNATURE = undefined;
  if (prefix === roles.admin) {
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_TOKEN_ADMIN;
    ACESS_SIGNATURE = process.env.ACESS_SIGNATURE_TOKEN_ADMIN;
  } else if (prefix === roles.user) {
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_TOKEN_USER;
    ACESS_SIGNATURE = process.env.ACESS_SIGNATURE_TOKEN_USER;
  } else {
    return next(new Error("Invalid token prefix", { cause: 401 }));
  }

  const decoded = await verifyToken({
    token,
    SIGNATURE:
      tokenType == tokenTypes.acess ? ACESS_SIGNATURE : REFRESH_SIGNATURE,
  });

  if (!decoded?.id) {
    return next(new Error("Invalid token", { cause: 401 }));
  }

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (
    user?.changeCredentialTime  &&
    user.changeCredentialTime.getTime() / 1000 >= decoded.iat
  ) {
    return next(new Error("Token expired", { cause: 401 }));
  }

  if (user?.deletedAt) {
    return next(new Error("User deleted", { cause: 404 }));
  }
  return user;
};

export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.acess,
    next,
  });

  req.user = user;
  next();
});

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("Access denied", { cause: 403 }));
    }
    next();
  });
};
