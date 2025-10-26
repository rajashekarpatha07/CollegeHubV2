import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const AccessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const RefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

const hashpassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const verifypassword = async (
  plainpassword: string,
  hashedpassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainpassword, hashedpassword);
};

const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, AccessTokenSecret, { expiresIn: "15m" });
};

const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, RefreshTokenSecret, { expiresIn: "7d" });
};

export {
  hashpassword,
  verifypassword,
  generateAccessToken,
  generateRefreshToken,
};