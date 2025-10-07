import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import jwt from "jsonwebtoken";
import { UserPayload } from "../interfaces/interfaces";
import { ApiError } from "../utils/ApiError";

const VerifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) throw new ApiError(400, "No AccessToken");

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as UserPayload;

      req.user = decodedToken;
      
      next();
    } catch (e) {
      throw new ApiError(401, "Unauthorized: Invalid or expired token.");
    }
  }
);

const requiredrole = (...RequiredRole: String[]) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user || !user.role) {
        throw new ApiError(
          401,
          "Authentication error: User role not found in token."
        );
      }

      //Check weather the role is allowed to route
      if (!RequiredRole.includes(user.role)) {
        // 403 Forbidden: The user is authenticated, but not authorized to see this content.
        throw new ApiError(
          403,
          "Forbidden: You do not have the necessary permissions."
        );
      }
      next();
    }
  );
};

export { VerifyToken, requiredrole };
