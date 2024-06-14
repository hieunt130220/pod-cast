import {
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
} from "../../controllers/admin/adminController";
const router = require("express").Router();
import { admin } from "../../middleware/tokenMiddleware";

router.route("/login").post(login);
router.route("/users").get(admin, users);
router.route("/podCasts").get(admin, podCasts);
router.route("/users/:id").get(admin, detailUser);
router.route("/users/deleteAvatar").put(admin, deleteAvatar);
router.route("/users/deleteUsername").put(admin, deleteUsernameUser);
router.route("/users/deleteUser").delete(admin, deleteUser);
router
  .route("/podCasts/:id")
  .get(admin, detailPodCast)
  .delete(admin, deletePodcast)
  .delete(admin, deleteComment);

router.route("/podCasts/:id/comment").delete(admin, deleteComment);

module.exports = router;
