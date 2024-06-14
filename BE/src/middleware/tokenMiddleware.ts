import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/auth/userModel");

interface IUserReq extends Request {
  user?: any;
}

//VERIFY TOKEN
const verify = asyncHandler(
  async (req: IUserReq, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);
        next();
      } catch (error) {
        res.status(401).json({
          status_code: 401,
          message: "Unauthorized",
        });
      }
    }
    if (!token) {
      res.status(401).json({
        status_code: 401,
        message: "Unauthorized",
      });
    }
  }
);

const admin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (user.role === "ROLE_ADMIN") {
          next();
          return;
        }
        res.status(403).json({
          status_code: 403,
          message: "Permission denied",
        });
      } catch (error) {
        res.status(401).json({
          status_code: 401,
          message: "Unauthorized",
        });
      }
    }
    if (!token) {
      res.status(401).json({
        status_code: 401,
        message: "Unauthorized",
      });
    }
  }
);

export { verify, admin };
