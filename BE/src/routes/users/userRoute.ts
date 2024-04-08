import {
  follow,
  unFollow,
  updateProfile,
  searchUserByUsername,
  getOtherUserProfile,
  getMe
} from "../../controllers/users/userController";
const router = require("express").Router();
const multer = require("multer");
const { storageImg } = require("../../config/cloudinary");
const uploadAvatar = multer({ storage: storageImg });

//user

router
  .route("/me")
  .get(getMe)
  .put(uploadAvatar.single("avatar"), updateProfile);

router.route("/recent_searches").get(searchUserByUsername);

router.route("/:id").get(getOtherUserProfile);

router.route("/:id/follow").post(follow);

router.route("/:id/unFollow").post(unFollow);

module.exports = router;
