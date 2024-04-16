import {
  loginUser,
  registerUser,
  changePasswordUser,
} from "../../controllers/auth/authController";
const router = require("express").Router();
import verify from "../../middleware/tokenMiddleware";

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/change_password").post(verify, changePasswordUser);

module.exports = router;
