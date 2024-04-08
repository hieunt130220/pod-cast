import {
  getAllPodcastByUserId,
  getPodcastFollowingUser,
  getDetailPodcast,
  searchContentPodcast,
  deletePodcastById,
  getRecommendPodcasts,
} from "../../controllers/data/podcastController";
const router = require("express").Router();

// get All podcast by user id
router.route("/user/:id")
  .get(getAllPodcastByUserId);

router.route("/new_feed")
  .get(getPodcastFollowingUser);

router.route("/:id")
  .get(getDetailPodcast)
  .delete(deletePodcastById);

router.route("/search")
  .get(searchContentPodcast);

router.route("/recommends")
  .get(getRecommendPodcasts);

module.exports = router;
