import {
        login,
        users, 
        podCasts,
        detailUser
} from "../../controllers/admin/adminController";
const router = require("express").Router();
import {admin} from "../../middleware/tokenMiddleware";

router.route("/login").post(login);
router.route("/users").get(admin, users);
router.route("/podCasts").get(admin, podCasts);
router.route("/users/:id").get(admin, detailUser)


module.exports = router;
