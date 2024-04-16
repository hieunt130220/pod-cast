import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const User = require("../../models/auth/userModel");
const generateToken = require("../../utils/generateToken");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

interface IUserReq extends Request {
  user?: any;
}

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      data: {
        token: generateToken(user.id)
      },
      status_code: 200,
      message: "Login success"
    });
  } else {
    res.status(401).json({
      status_code: 401,
      message: "Wrong account or password"
    });
  }
});

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const emailExits = await User.findOne({ email });

  const usernameExits = await User.findOne({ username });

  if ((emailExits) || (usernameExits)) {
    res.status(400).json({
      status_code: 400,
      message: "Account already exists"
    })
  }

  const user = await User.create({
    username,
    email,
    password
  });
  if (user) {
    res.status(200).json({
      data: {
        token: generateToken(user.id)
      },
      status_code: 200,
      message: "Create account success"
    });
  } else {
    res.status(401).json({
      status_code: 401,
      message: "Invalid data"
    })
  }
});

const changePasswordUser = asyncHandler(async (req: IUserReq, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  const user = req.user;

  try {
    if (!user) {
      res.status(404).json({
        status_code: 404,
        message: "Can't find account!"
      });
    }
    if (await user.matchPassword(oldPassword)) {
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      if (newPasswordHash) {
        await User.updateOne(
          {
            _id: user.id,
          },
          {
            $set: {
              password: newPasswordHash,
            },
          }
        );

        res.status(200).json({
          status_code: 200,
          message: "Change password successful!",
        });
      }
    } else {
      res.status(404).json({
        status_code: 404,
        message: "Old password incorrect"
      })

    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

export { registerUser, loginUser, changePasswordUser };
