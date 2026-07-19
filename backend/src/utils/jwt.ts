import jwt from "jsonwebtoken";

export interface AccessTokenPayload {
  userId: string;
  tenantId: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, jwtSecret) as AccessTokenPayload;
};
