import {
  createPodcast
} from "../../controllers/data/fileUploadController";
const router = require("express").Router();
const multer = require("multer");
const { storagePodcast } = require("../../config/cloudinary");
const uploadAudio = multer({ storage: storagePodcast });

router.route("/uploadSingleFile").post(
  uploadAudio.fields([
    { name: "file", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  createPodcast
);

module.exports = router;
