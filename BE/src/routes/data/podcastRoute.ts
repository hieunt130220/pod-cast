import {
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
  createPodcast
} from "../../controllers/data/podcastController";
const router = require("express").Router();
const multer = require("multer");
const { storagePodcast } = require("../../config/cloudinary");
const uploadAudio = multer({ storage: storagePodcast });

router.route("").post(uploadAudio.fields([
    { name: "file", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]), createPodcast);


// get All podcast by user id
router.route("/user/:id")
  .get(getAllPodcastByUserId);

router.route("/new_feed")
  .get(getPodcastFollowingUser);

router.route("/:id")
  .get(getDetailPodcast)
  .delete(deletePodcastById);

router.route("/:id/like")
  .post(likePost)

router.route("/:id/unlike")
  .post(unLikePost)

router.route("/:id/comment")
  .get(getCommentPost)
  .post(commentPost)

router.route("/search")
  .get(searchContentPodcast);

router.route("/recommends")
  .get(getRecommendPodcasts);

module.exports = router;
