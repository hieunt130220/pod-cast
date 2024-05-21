import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");

const Podcast = require("../../models/data/podcastModel");
const PodcastUser = require("../../models/data/podcastUserModel");
const User = require("../../models/auth/userModel");
const StatusPost = require("../../models/data/statusPost");
const assemblyai = require("assemblyai-v2-node-sdk");
const client = new assemblyai.AssemblyClient(process.env.API_SPEECH2TEXT);
interface dataPodcast {
  user: string;
  audio: string;
  uploadDate: Date;
  caption: string;
}

interface IUserReq extends Request {
  user?: any;
  files?: any;
}

const createPodcast = asyncHandler(async (req: IUserReq, res: Response) => {
  const userId = req.user.id;
  const userExits = await PodcastUser.findOne({
    user: userId,
  });

  try {
    let text: string = "";
    const audioFile = req.files.file;
    const backgroundFile = req.files.background;
    if (!audioFile) {
      return res.status(400).json({
        status_code: 400,
        message: "No file uploaded"
      });
    }

    let urlCloudinary = audioFile[0].path;
    const transcript = await client.createTranscript({
      audio_url: urlCloudinary,
    });
    await client.pollForTranscript(transcript.id).then((result: any) => {
      text = result.text;
    });

    const podCast = new Podcast({
      user: userId,
      audio: urlCloudinary,
      background: backgroundFile
        ? backgroundFile[0].path
        : PodcastUser.background,
      caption: req.body.caption,
      content: text,
    });

    await podCast.save();

    if (userExits) {
      await PodcastUser.updateOne(
        { user: userId },
        {
          $push: {
            podcasts: podCast._id,
          },
        }
      );
    } else {
      await PodcastUser.create({
        user: userId,
        podcasts: podCast._id,
      });
    }

    // Return a success message
    res.json({
      data: {
        _id: podCast.id,
        user: {
          _id: req.user.id,
          username: req.user.username,
          avatar: req.user.avatar
        },
        audio: podCast.audio,
        background: podCast.background,
        caption: podCast.caption,
        is_like: podCast.likes.includes(userId),
        comment_count: podCast.comments.length,
        like_count: podCast.likes.length
      },
      message: "File uploaded successfully!",
      status_code: 200,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading file", error: err });
    console.log(err);
  }
});

const getAllPodcastByUserId = asyncHandler(async (req: IUserReq, res: Response) => {
  try {
    const limit: number = Number(req.query.perPage) || 20
    const page: number = Number(req.query.page) || 1
    const query = { user: req.params.id }
    const podcasts = await Podcast.find(query)
      .sort({ uploadDate: -1 })
      .populate("user", 'username avatar')
      .select('audio caption background likes comments uploadDate')
      .skip((limit * page) - limit)
      .limit(limit)
    const promises = podcasts.map(async (item: any) => {
      return {
        _id: item.id,
        user: item.user,
        audio: item.audio,
        background: item.background,
        caption: item.caption,
        like_count: item.likes.length,
        comment_count: item.comments.length,
        is_like: item.likes.includes(req.user.id),
        uploadDate: item.uploadDate
      }
    })
    const count = await Podcast.countDocuments(query)
    res.status(200)
      .json({
        data: [].concat(...(await Promise.all(promises))),
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
    const limit: number = Number(req.query.perPage) || 20
    const page: number = Number(req.query.page) || 1
    let listData: dataPodcast[] = [];
    const promises = dataUser[0].following.map(async (item: any) => {
      const regex = 'new ObjectId(" ")';
      const id = item.toString().replace(regex, "").trim();
      const data = await Podcast.find({
        user: id,
      })
        .populate("user", 'username avatar')
        .select('audio background likes comments uploadDate')
      return data;
    })

    const data: any = [].concat(...(await Promise.all(promises))).map(async (item: any) => {
      return {
        _id: item.id,
        user: item.user,
        audio: item.audio,
        background: item.background,
        like_count: item.likes.length,
        comment_count: item.comments.length,
        is_like: item.likes.includes(req.user.id),
        uploadDate: item.uploadDate,
        caption: item.caption,
      }
    })

    listData = [].concat(...(await Promise.all(data))).sort((a: any, b: any) => b.uploadDate - a.uploadDate);
    res.status(200).json({
      data: listData.slice(limit * (page - 1), limit * page),
      has_next_page: listData.length > limit * page
    });
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}
);

const getDetailPodcast = asyncHandler(async (req: IUserReq, res: Response) => {
  try {
    const dataPodcast = await Podcast.findById(req.params.id).populate("user", 'username avatar');

    res.status(200).json({
      data: {
        _id: dataPodcast._id,
        audio: dataPodcast.audio,
        background: dataPodcast.background,
        caption: dataPodcast.caption,
        user: dataPodcast.user,
        uploadDate: dataPodcast.uploadDate,
        content: dataPodcast.content,
        is_like: dataPodcast.likes.includes(req.user.id),
        like_count: dataPodcast.likes.length,
        comment_count: dataPodcast.comments.length
      }
    });
  } catch (error) {
    res.status(404).json({
      status_code: 404,
      message: "Not found"
    })
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

const searchContentPodcast = asyncHandler(async (req: Request, res: Response) => {
    let searchKeyword = req.query.caption;
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
        caption: regex,
      }).populate("user");

      if (!podcastData) {
        return res.status(404).json({ message: "The podcast does not exist." });
      }

      res.status(200).json({
        data: podcastData
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deletePodcastById = asyncHandler(async (req: IUserReq, res: Response) => {
  const idPodcast = req.params.id;
  const idUser = req.user.id;

  const podCastUser = await PodcastUser.findOne({
    user: idUser
  })

  try {
    const dataPodcast = await Podcast.findByIdAndDelete({
      _id: idPodcast,
    });

    if (dataPodcast) {
      if (!podCastUser.podcasts.includes(idPodcast)) {
        return res.status(400)
          .json({
            status_code: 400,
            message: "You can delete this pod cast"
          })
      }

      await dataPodcast.remove();

      await PodcastUser.updateOne(
        { user: idUser },
        {
          $pull: {
            podcasts: idPodcast,
          },
        }
      );

      res.json({ status_code: 200, message: "Delete podcast successfully" });
    } else {
      res.status(404).json({
        status_code: 404,
        message: "Not Found"
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const likePost = asyncHandler(async (req: IUserReq, res: Response) => {
  const userId = req.user.id;
  const idPost = req.params.id;

  try {
    const podcast = await Podcast.findOne({ _id: idPost });
    const UserLikePodcast = await StatusPost.findOne({
      userLikePost: userId,
      post: idPost,
    });

    if (!podcast) {
      return res.status(404).json({ status_code: 404, message: "Not found" });
    }

    if (!UserLikePodcast) {
      await StatusPost.create({
        userLikePost: userId,
        post: idPost,
        isLike: true,
      });
    }
    // add id of people like post to db
    await Podcast.updateOne(
      { _id: idPost },
      {
        $addToSet: {
          likes: userId,
        },
      }
    );
    await StatusPost.updateOne(
      {
        userLikePost: userId,
        post: idPost,
      },
      {
        $set: {
          isLike: true,
        },
      }
    );

    res.status(200).json({ status_code: 200, message: "Like success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status_code: 500, message: error });
  }
});

const unLikePost = asyncHandler(async (req: IUserReq, res: Response) => {
  const userId = req.user.id;
  const idPost = req.params.id;

  try {
    const podcast = await Podcast.findOne({ _id: idPost });

    if (!podcast) {
      return res.status(404).json({ status_code: 404, message: "Not found" });
    }

    // remove id of people like post to db

    await Podcast.updateOne(
      { _id: idPost },
      {
        $pull: {
          likes: userId,
        },
      }
    );
    await StatusPost.updateOne(
      {
        userLikePost: userId,
        post: idPost,
      },
      {
        $set: {
          isLike: false,
        },
      }
    );

    res.status(200).json({ status_code: 200, message: "Unlike success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status_code: 500, message: error });
  }
});


const commentPost = asyncHandler(async (req: IUserReq, res: Response) => {
  const now = new Date();
  const uploadDate = now.toISOString();
  const podcast = await Podcast.findById(req.params.id);
  try {
    if (!podcast) {
      return res.status(404).json({ status_code: 400, message: "Not found" });
    }

    const comment = {
      user: req.user.id,
      text: req.body.comment,
      date: new Date(),
    };

    podcast.comments.push(comment);
    await podcast.save();

    res.status(200).json({
      data: comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const getCommentPost = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const podcast = await Podcast.findOne(
      { _id: postId },
      {
        comments: 1,
      }
    ).populate("comments.user", "username avatar");

    res.status(200).json({
      data: podcast.comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


export {
  createPodcast,
  getAllPodcastByUserId,
  getPodcastFollowingUser,
  getDetailPodcast,
  searchContentPodcast,
  deletePodcastById,
  getRecommendPodcasts,
  likePost,
  unLikePost,
  commentPost,
  getCommentPost,
};
