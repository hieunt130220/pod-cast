import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");

const Podcast = require("../../models/data/podcastModel");
const PodcastUser = require("../../models/data/podcastUserModel");
const User = require("../../models/auth/userModel");
const StatusPost = require("../../models/data/statusPost");

interface dataPodcast {
  user: string;
  audio: string;
  uploadDate: Date;
  caption: string;
}

interface IUserReq extends Request {
  user?: any;
}

const getAllPodcastByUserId = asyncHandler(async (req: IUserReq, res: Response) => {
  try {
    const limit: number = Number(req.query.perPage) || 20
    const page: number = Number(req.query.page) || 1
    console.log(limit, page)
    const query = { user: req.params.id }
    const podcasts = await Podcast.find(query)
      .populate("user")
      .skip((limit * page) - limit)
      .limit(limit)
    const count = await Podcast.countDocuments(query)
    res.status(200)
      .json({
        data: podcasts,
        has_next_page: count > limit * page
      })
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}
);

const getPodcastFollowingUser = asyncHandler(async (req: IUserReq, res: Response) => {
  try {
    const dataUser = await User.find({ _id: req.user.id }, { _id: 0, following: 1 });

    let listData: dataPodcast[] = [];
    const promises = dataUser[0].following.map(async (item: any) => {
      const regex = 'new ObjectId(" ")';
      const id = item.toString().replace(regex, "").trim();
      const data = await Podcast.find({
        user: id,
      }).populate("user");
      return data;
    });
    listData = [].concat(...(await Promise.all(promises)));
    res.status(200).json(listData);
  } catch (error) {
    res.status(500).json(error);
  }
}
);

const getDetailPodcast = asyncHandler(async (req: Request, res: Response) => {
  try {
    const dataPodcast = await Podcast.findById(req.params.id).populate("user");

    res.status(200).json({
      data: {
        _id: dataPodcast._id,
        audio: dataPodcast.audio,
        background: dataPodcast.background,
        caption: dataPodcast.caption,
        user: dataPodcast.user,
        uploadDate: dataPodcast.uploadDate,
        content: dataPodcast.content,
        likes: dataPodcast.likes,
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

const getRecommendPodcasts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const podcastData = await Podcast.aggregate([
        {
          $project: {
            user: 1,
            audio: 1,
            uploadDate: 1,
            background: 1,
            caption: 1,
            content: 1,
            likes: { $size: "$likes" },
            comments: 1,
          },
        },
        { $sort: { likes: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            "user.username": 1,
            "user.avatar": 1,
            audio: 1,
            uploadDate: 1,
            background: 1,
            caption: 1,
            content: 1,
            likes: 1,
            comments: 1,
          },
        },
      ]);

      res.status(200).json({
        podcastData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const searchContentPodcast = asyncHandler(
  async (req: Request, res: Response) => {
    let searchKeyword = req.query.content;

    try {
      let regex: RegExp;

      if (typeof searchKeyword === "string") {
        searchKeyword = decodeURIComponent(searchKeyword);
        regex = new RegExp(searchKeyword, "i");
      } else {
        const keywordString = JSON.stringify(searchKeyword);
        regex = new RegExp(decodeURIComponent(keywordString), "i");
      }

      const podcastData = await Podcast.find({
        content: regex,
      }).populate("user");

      if (!podcastData) {
        return res.status(404).json({ message: "The podcast does not exist." });
      }

      res.status(200).json({
        podcastData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deletePodcastById = asyncHandler(async (req: Request, res: Response) => {
  const idPodcast = req.query.idPodcast;
  const idUser = req.query.idUser;

  try {
    const dataPodcast = await Podcast.findByIdAndDelete({
      _id: idPodcast,
    });

    if (dataPodcast) {
      await dataPodcast.remove();

      await PodcastUser.updateOne(
        { user: idUser },
        {
          $pull: {
            podcasts: idPodcast,
          },
        }
      );

      res.json({ message: "Delete podcast successfully" });
    } else {
      res.status(500).json("Can't find Podcast to delete");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
const likePost = asyncHandler(async (req: Request, res: Response) => {
  const likeId = req.body.likeId;
  const idPost = req.body.idPost;

  try {
    const podcast = await Podcast.findOne({ _id: idPost });
    const UserLikePodcast = await StatusPost.findOne({
      userLikePost: likeId,
      post: idPost,
    });

    if (!podcast) {
      return res.status(404).json({ message: "Không tìm thấy Podcast" });
    }

    if (!likeId) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người thích bài viết" });
    }

    if (!UserLikePodcast) {
      await StatusPost.create({
        userLikePost: likeId,
        post: idPost,
        isLike: true,
      });
    }
    // add id of people like post to db
    await Podcast.updateOne(
      { _id: idPost },
      {
        $addToSet: {
          likes: likeId,
        },
      }
    );
    await StatusPost.updateOne(
      {
        userLikePost: likeId,
        post: idPost,
      },
      {
        $set: {
          isLike: true,
        },
      }
    );

    res.status(200).json({ message: "Thích bài viết thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const unLikePost = asyncHandler(async (req: Request, res: Response) => {
  const likeId = req.body.likeId;
  const idPost = req.body.idPost;

  try {
    const podcast = await Podcast.findOne({ _id: idPost });

    if (!podcast) {
      return res.status(404).json({ message: "Không tìm thấy Podcast" });
    }

    if (!likeId) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người thích bài viết" });
    }
    // remove id of people like post to db

    await Podcast.updateOne(
      { _id: idPost },
      {
        $pull: {
          likes: likeId,
        },
      }
    );
    await StatusPost.updateOne(
      {
        userLikePost: likeId,
        post: idPost,
      },
      {
        $set: {
          isLike: false,
        },
      }
    );

    res.status(200).json({ message: "Bỏ Thích bài viết thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const getStatusLikePost = asyncHandler(async (req: Request, res: Response) => {
  const likeId = req.query.likeId;
  const postOwner = req.query.postOwner;

  const statusPost = await StatusPost.findOne({
    userLikePost: likeId,
    post: postOwner,
  });
  try {
    if (!statusPost) {
      return res.json(false);
    }

    res.json({
      isLike: statusPost.isLike,
      postOwner: statusPost.post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const commentPost = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const uploadDate = now.toISOString();
  const podcast = await Podcast.findById(req.body.postId);
  try {
    if (!podcast) {
      return res.status(404).json({ message: "Bài podcast không tồn tại" });
    }

    const comment = {
      user: req.body.userId,
      text: req.body.text,
      date: new Date(),
    };

    podcast.comments.push(comment);
    await podcast.save();

    res.status(200).json({
      message: "comment succesful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const getCommentPost = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.query.postId;
  try {
    const podcast = await Podcast.findOne(
      { _id: postId },
      {
        comments: 1,
      }
    ).populate("comments.user");

    res.status(200).json({
      userComments: podcast.comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const getTotalLikeCount = asyncHandler(async (req: Request, res: Response) => {
  const idPost = req.query.idPost;

  try {
    const podcastData = await Podcast.findOne({
      _id: idPost,
    });

    if (podcastData) {
      res.status(200).json({
        likes: podcastData.likes,
      });
    } else {
      res.status(404).json("Cant find Podcast");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
export {
  getAllPodcastByUserId,
  getPodcastFollowingUser,
  getDetailPodcast,
  searchContentPodcast,
  deletePodcastById,
  getRecommendPodcasts,
  likePost,
  unLikePost,
  getStatusLikePost,
  commentPost,
  getCommentPost,
  getTotalLikeCount,
};
