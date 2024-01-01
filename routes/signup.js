const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../models/users");
const { generateAccessToken } = require("../utils/auth");

// Register a new user
// Take username & password
// ? Return JWT and redirect
router.post("/", async (req, res) => {
    try {
        // Set user variables
        const { body } = req;
        const { user, password } = body;
        const posts = [];
        const bio = "Hey there! I'm new to ORBI! Say Hi.";

        // Validate request
        if (!user || !password) {
            const expectedBody = {
                username: user,
                password: password,
            };

            return res.status(400).json({
                message: "Body error.",
                expected: expectedBody,
                given: body,
            });
        }

        // Check if user exists
        User.findOne({ user })
            .exec()
            .then((doc) => {
                if (doc) {
                    return res
                        .status(400)
                        .json({ error: "Username is already taken." });
                }
                // Create a JWT
                const payload = { user: user, password: password };
                const accessToken = generateAccessToken(payload);
                if (!accessToken)
                    return res.status(500).json({
                        error: "An internal server error has occured.",
                        details: "Could not create a token,",
                    });

                // Create a new user record
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    user: user,
                    password: password,
                    posts: posts,
                    bio: bio,
                    token: accessToken,
                });

                newUser.save().then((doc) => {
                    // Respond
                    return res.status(200).json({
                        success: `Made account with username: ${user}`,
                        token: accessToken,
                    });
                });
            })
            .catch((e) => {
                console.log(e);
                res.status(500).json({ error: "Internal server error." });
            });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
