const express = require("express");
const router = express.Router();
const { User } = require("../models/users");

// Fetch information about a user
router.post("/", async (req, res) => {
    console.log("recieved api request to /api/userinfo")
    try {
        const user = req.body.user;
        if (!user)
            return res.status(400).json({ error: "No user provided." });

        await User.findOne({
            user: user,
        })
            .then((doc) => {
                if (!doc)
                    return res.status(404).json({ error: "User not found." });

                const { user, pfp, bio, follows, posts } = doc;

                return res.status(200).json({
                    message: `Fetched ${user} successfully!`,
                    user: user,
                    pfp: pfp,
                    bio: bio,
                    follows: follows,
                    posts: posts,
                });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(500)
                    .json({ error: "Internal server error." });
            });
    } catch (err) {
        console.log(e);
        return res.status(500).json({ error: "Internal server error." });
    }
});





router.post("/follow", async (req, res) => {
    try {
        const userJwt = req.body.userJwt;
        const userToFollow = req.body.userToFollow
        const follow = req.body.follow;
        if (!userToFollow) return res.status(400).json({ error: "No user provided." });

        const userResult = await User.findOne({
            userJwt
        });

        if (!userResult) return res.status(400).json({ error: "Invalid authentication." });

        const userToFollowResult = await User.findOne({
            user: userToFollow
        })

        const userFollows = userToFollowResult.follows || 0;
        let updatedFollows = 0;

        if (follow == true) updatedFollows = userFollows + 1;
        if (follow == false) updatedFollows = userFollows - 1;

        await User.updateOne(
            { user: userToFollow },
            { $set: { follows: updatedFollows } }
        )
            .then((doc) => {
                return res.status(200).json({
                    success: "User followed.",
                    follows: updatedFollows,
                });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(500)
                    .json({ error: "Internal server error." });
            });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
