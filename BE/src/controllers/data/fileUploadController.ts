import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
import { spawn } from "child_process";

const assemblyai = require("assemblyai-v2-node-sdk");
const client = new assemblyai.AssemblyClient(process.env.API_SPEECH2TEXT);

// collection

const Podcast = require("../../models/data/podcastModel");

const PodcastUser = require("../../models/data/podcastUserModel");

const createPodcast = asyncHandler(async (req: any, res: Response) => {
  const userId = req.body.userId;
  const userExits = await PodcastUser.findOne({
    user: userId,
  });

  try {
    let text: string = "";
    const audioFile = req.files.file;
    const backgroundFile = req.files.background;
    if (!audioFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let urlCloudinary = audioFile[0].path;
    const transcript = await client.createTranscript({
      audio_url: urlCloudinary,
    });
    await client.pollForTranscript(transcript.id).then((result: any) => {
      text = result.text;
    });

    const podcastUser = new Podcast({
      user: userId,
      audio: urlCloudinary,
      background: backgroundFile
        ? backgroundFile[0].path
        : PodcastUser.background,
      caption: req.body.caption,
      content: text,
    });

    await podcastUser.save();

    if (userExits) {
      await PodcastUser.updateOne(
        { user: userId },
        {
          $push: {
            podcasts: podcastUser._id,
          },
        }
      );
    } else {
      await PodcastUser.create({
        user: userId,
        podcasts: podcastUser._id,
      });
    }

    // Return a success message
    res.json({
      message: "File uploaded successfully!",
      result: text,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading file", error: err });
    console.log(err);
  }
});


export { createPodcast };
