import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const User = require("../../models/auth/userModel");
const Podcast = require("../../models/data/podcastModel");
const generateToken = require("../../utils/generateToken");
const PodcastUser = require("../../models/data/podcastUserModel");

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (
    user &&
    (await user.matchPassword(password)) &&
    user.role == "ROLE_ADMIN"
  ) {
    res.status(200).json({
      data: {
        token: generateToken(user.id),
      },
      status_code: 200,
      message: "Login success",
    });
  } else {
    res.status(401).json({
      status_code: 401,
      message: "Wrong account or password",
    });
  }
});

const users = asyncHandler(async (req: Request, res: Response) => {
  const limit: number = Number(req.query.limit) || 20;
  const page: number = Number(req.query.page) || 1;
  let regex: RegExp;
  regex = new RegExp("ROLE_MEMBER", "i");
  try {
    const users = await User.find({ role: regex }).select("username avatar");
    // .skip((limit * page) - limit)
    // .limit(limit)
    res.json({
      data: users,
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const podCasts = asyncHandler(async (req: Request, res: Response) => {
  const limit: number = Number(req.query.limit) || 20;
  const page: number = Number(req.query.page) || 1;
  try {
    const podCasts = await Podcast.find({})
      .populate("user", "username avatar")
      .select("audio caption background likes comments uploadDate");
    // .skip((limit * page) - limit)
    // .limit(limit)
    res.json({
      data: podCasts,
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const detailUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("username avatar");
    const podcasts = await Podcast.find({ user: id })
      .sort({ uploadDate: -1 })
      .select("audio caption background likes comments uploadDate");
    res.json({
      data: { user, podcasts },
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const deleteAvatar = asyncHandler(async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    const user = await User.findById(id);
    user.avatar =
      "https://i.pinimg.com/564x/ac/29/ae/ac29aedf348f1409f49d53013f72c276.jpg";
    await user.save();
    res.json({
      message: "ChangeChanged avatar successfully",
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();
    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const detailPodCast = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const podcasts = await Podcast.findById(id)
      .populate("user", "username avatar")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .select("audio caption background likes comments uploadDate");
    res.json({
      data: podcasts,
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const deletePodcast = asyncHandler(async (req: Request, res: Response) => {
  const idPodcast = req.params.id;
  const idUser = req.body.idUser;
  try {
    const podcast = await Podcast.findById(idPodcast);
    const podCastUser = await PodcastUser.findOne({
      user: idUser,
    });
    if (!podcast) {
      return res.status(404).json({ error: "Podcast not found" });
    }
    if (!podCastUser.podcasts.includes(idPodcast)) {
      return res.status(400).json({
        status_code: 400,
        message: "You can delete this podcast",
      });
    }
    await podcast.remove();

    await PodcastUser.updateOne(
      { user: idUser },
      {
        $pull: {
          podcasts: idPodcast,
        },
      }
    );

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const idPodcast = req.params.id;
  const idComment = req.body.idComment;

  try {
    const podcast = await Podcast.findById(idPodcast);
    if (!podcast) {
      return res.status(404).json({ error: "Podcast not found" });
    }
    podcast.comments = podcast.comments.filter(
      (comment: any) => comment._id !== idComment
    );

    await podcast.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

const deleteUsernameUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    const user = await User.findById(id);
    user.username = `user - ${id}`;
    await user.save();
    res.json({
      message: "Delete username successfully",
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

export {
  login,
  users,
  podCasts,
  detailUser,
  deleteAvatar,
  deleteUser,
  detailPodCast,
  deletePodcast,
  deleteComment,
  deleteUsernameUser,
};
