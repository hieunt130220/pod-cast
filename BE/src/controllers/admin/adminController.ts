import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const User = require("../../models/auth/userModel");
const Podcast = require("../../models/data/podcastModel");
const generateToken = require("../../utils/generateToken");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password)) && user.role == "ROLE_ADMIN") {
                res.status(200).json({
                        data: {
                                token: generateToken(user.id)
                        },
                        status_code: 200,
                        message: "Login success"
                });
        } else {
                res.status(401).json({
                        status_code: 401,
                        message: "Wrong account or password"
                });
        }
});

const users = asyncHandler(async (req: Request, res: Response) => {
        const limit: number = Number(req.query.limit) || 20
        const page: number = Number(req.query.page) || 1
        let regex: RegExp;
        regex = new RegExp("ROLE_MEMBER", "i");
        try {
                const users = await User.find({ role: regex })
                        .select('username avatar')
                        // .skip((limit * page) - limit)
                        // .limit(limit)
                res.json({
                        data: users
                });
        } catch (error) {
                res.status(404).json({ error: error });
        }
});

const podCasts = asyncHandler(async (req: Request, res: Response) => {
        const limit: number = Number(req.query.limit) || 20
        const page: number = Number(req.query.page) || 1
        try {
                const podCasts = await Podcast.find({})
                        .populate("user", 'username avatar')
                        .select('audio caption background likes comments uploadDate')
                        // .skip((limit * page) - limit)
                        // .limit(limit)
                res.json({
                        data: podCasts
                });
        } catch (error) {
                res.status(404).json({ error: error });
        }
});

const detailUser = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        try {
                const user = await User.findById(id)
                        .select('username avatar')
                const podcasts = await Podcast.find({ user: id })
                        .sort({ uploadDate: -1 })
                        .select('audio caption background likes comments uploadDate')
                res.json({
                        data: {user, podcasts}
                });
        } catch (error) {
                res.status(404).json({ error: error });
        }
});

export { login, users, podCasts, detailUser };
