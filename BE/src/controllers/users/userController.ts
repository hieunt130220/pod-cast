import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const User = require("../../models/auth/userModel");
const Relationship = require("../../models/data/relationshipModel");
import { ParsedUrlQuery } from "querystring";
const jwt = require("jsonwebtoken");

interface IUserReq extends Request {
  user?: any;
}

const getMe = asyncHandler(async (req: IUserReq, res: Response) => {
  const user = req.user;

  if (user) {
    res.json({
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        followers: user.followers.length,
        followings: user.following.length,
      }
    });
  } else {
    res.status(404).json({
      status_code: 404,
      message: "User not found"
    })
  }
});

const updateProfile = asyncHandler(async (req: IUserReq, res: Response) => {
  const user = req.user;
  const newUsername = req.body.username;
  const newAvatar = req?.file?.path;
  const usernameExits = await User.findOne({ username: newUsername });
  try {
    if (usernameExits) {
      return res.status(400).json(" Username already exist");
    }

    if (user) {
      user.username = newUsername || user.username;
      user.avatar = newAvatar || user.avatar;
      const updateUser = await user.save();

      res.json({
        username: updateUser.username,
        avatar: updateUser.avatar,
        _id: updateUser._id,
      });
    }
  } catch (error) {
    res.status(404).json({ message: "Error uploading file", error: error });
  }
});

const searchUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const searchKeyword = req.query.username;

    try {
      let regex: RegExp;

      if (typeof searchKeyword === "string") {
        regex = new RegExp(searchKeyword, "i");
      } else {
        const keywordString = JSON.stringify(searchKeyword); // convert to string using JSON.stringify()
        regex = new RegExp(keywordString, "i");
      }

      const user = await User.find({
        username: regex,
      }).select("-password");

      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  }
);

const getOtherUserProfile = asyncHandler(async (req: IUserReq, res: Response) => {
    const currentId = req.user.id;
    const otherUserId = req.params.id;

    const userExits = await Relationship.findOne({
      currentUser: currentId,
      user: otherUserId,
    });

    try {
      if (!userExits) {
        await Relationship.create({
          currentUser: currentId,
          user: otherUserId,
        });
        await Relationship.create({
          currentUser: otherUserId,
          user: currentId,
        });
      }
      const infoUser = await Relationship.findOne({
         currentUser: currentId,
        user: otherUserId, })
        .populate('user')
        .exec();
      res.json({
        data: {
          _id: infoUser.user.id,
          username: infoUser.user.username,
          avatar: infoUser.user.avatar,
          followers: infoUser.user.followers.length,
          followings: infoUser.user.following.length,
          is_following: infoUser.following,
          is_followed: infoUser.followed_by
        }
      });
    } catch (error) {
      res.status(404).json({ message: "Cant find user", status_code: 404 });
    }
  }
);

const follow = asyncHandler(async (req: IUserReq, res: Response) => {
  const currentId = req.user.id;
  const otherId = req.params.id;

  if (currentId == otherId) {
    return res.status(400).json({
      status_code: 400,
      message: "Cannot follow yourself"
    })
  }

  try {
    // following
    await User.updateOne(
      { _id: currentId },
      {
        $addToSet: {
          following: otherId,
        },
      }
    );
    await Relationship.updateOne(
      {
        currentUser: currentId,
        user: otherId,
      },
      {
        $set: {
          following: true,
        },
      }
    );

    // followed
    await User.updateOne(
      { _id: otherId },
      {
        $addToSet: {
          followers: currentId,
        },
      }
    );

    await Relationship.updateOne(
      {
        currentUser: otherId,
        user: currentId,
      },
      {
        $set: {
          followed_by: true,
        },
      }
    );

    res.json({
      status_code: 200,
      message: "Follow successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const unFollow = asyncHandler(async (req: IUserReq, res: Response) => {
  const currentId = req.user.id;
  const otherId = req.params.id;

  if (currentId == otherId) {
    return res.status(400).json({
      status_code: 400,
      message: "Cannot follow yourself"
    })
  }

  try {
    // following
    await User.updateOne(
      { _id: currentId },
      {
        $pull: {
          following: otherId,
        },
      }
    );
    await Relationship.updateOne(
      {
        currentUser: currentId,
        user: otherId,
      },
      {
        $set: {
          following: false,
        },
      }
    );
    // followers
    await User.updateOne(
      { _id: otherId },
      {
        $pull: {
          followers: currentId,
        },
      }
    );
    await Relationship.updateOne(
      {
        currentUser: otherId,
        user: currentId,
      },
      {
        $set: {
          followed_by: false,
        },
      }
    );

    res.json({
      status_code: 200,
      message: "Unfollow successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export {
  updateProfile,
  searchUserByUsername,
  getOtherUserProfile,
  getMe,
  follow,
  unFollow
};
