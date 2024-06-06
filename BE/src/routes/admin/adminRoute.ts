import {
        login,
        users, 
        podCasts,
        detailUser
} from "../../controllers/admin/adminController";
const router = require("express").Router();
import verify from "../../middleware/tokenMiddleware";

router.route("/login").post(login);
router.route("/users").get(users);
router.route("/podCasts").get(podCasts);
router.route("/users/:id").get(detailUser)


module.exports = router;
