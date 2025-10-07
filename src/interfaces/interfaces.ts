export interface UserPayload {
  userId: number;
  loginid: string;
  role: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
