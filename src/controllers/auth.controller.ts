import { Request, Response } from "express";
import prisma from "../db/prisma";
import { hashpassword } from "../utils/auth.util/auth.util";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { verifypassword } from "../utils/auth.util/auth.util";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../utils/auth.util/auth.util";

const registeruser = asyncHandler(async (req: Request, res: Response) => {
  const { loginId, rollNumber, email, password, name, role } = req.body;

  // Check if user already exists
  const UserExist = await prisma.user.findUnique({
    where: { loginId },
  });
  if (UserExist) throw new ApiError(401, "User already exist try to login");

  // Find roleId using role name
  const userRole = await prisma.role.findUnique({
    where: { roleName: role },
  });
  if (!userRole) throw new ApiError(400, "Invalid role provided");

  // Hash password
  const hashedpass = await hashpassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      loginId,
      rollNumber,
      email,
      passwordHash: hashedpass,
      name,
      roleId: userRole.roleId,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User Created Successfully"));
});


 const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // 1. Destructure and validate input using camelCase
  const { loginId, password } = req.body;
  console.log(loginId, password)
  if (!loginId || !password) {
    throw new ApiError(400, "Login ID and Password are required");
  }

  // 2. Find the user in the database
  const user = await prisma.user.findUnique({
    where: { loginId: loginId },
    include: { role: true },
  });

  // 3. Verify the password. Use a generic error for both user not found and invalid password.
  // This prevents user enumeration attacks.
  const isPasswordValid = user ? await verifypassword(password, user.passwordHash) : false;

  if (!user || !isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 4. Prepare the payload for the tokens
  const tokenPayload = {
    userId: user.userId,
    loginId: user.loginId,
    role: user.role.roleName,
  };

  // 5. Generate tokens
  const refreshToken = generateRefreshToken(tokenPayload);
  const accessToken = generateAccessToken(tokenPayload);

  // 6. Define secure cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  // 7. Exclude sensitive data from the final user object
  const { passwordHash, ...userResponse } = user;

  // 8. Send response with cookies and user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, userResponse, "User login successful")); // Corrected typo
});

export { registeruser, loginUser};
