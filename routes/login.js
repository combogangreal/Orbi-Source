const express = require("express");
const router = express.Router();
const { User } = require("../models/users");
const { generateAccessToken, validateAccessToken } = require("../utils/auth");

// Login request
// Take username & password
// Return JWT and redirect
router.post("/", async (req, res) => {
    try {
        // Set user variables
        const { body } = req;
        const { user, password } = body;

        // Validate body
        if (!user || !password) {
            const expectedBody = {
                user: "username",
                password: "password",
            };

            return res.status(400).json({
                message: "Body error.",
                expected: expectedBody,
                given: body,
            });
        }

        await User.findOne({
            user: user,
            password: password,
        })
            .then((doc) => {
                console.log({ doc });
                // Validate login
                if (!doc) {
                    return res
                        .status(400)
                        .json({ error: "Login details invalid." });
                } else {
                    // Get the current users access token from the database
                    const { accessToken } = doc;

                    // Check if the access token is valid
                    const { status } = validateAccessToken(accessToken);

                    // If the access token is valid, return the access token
                    // Else, generate a new access token
                    if (status === 200) {
                        return res.status(200).json({ accessToken });
                    } else {
                        // Generate a new access token
                        const newAccessToken = generateAccessToken({
                            user: user,
                        });

                        // Update the access token in the database
                        User.updateOne(
                            { user: user },
                            { accessToken: newAccessToken }
                        )
                            .then((doc) => {
                                console.log(doc);
                                return res
                                    .status(200)
                                    .json({ accessToken: newAccessToken });
                            })
                            .catch((err) => {
                                console.log(err);
                                return res.status(500).json({
                                    error: "Internal server error.",
                                });
                            });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(500)
                    .json({ error: "Internal server error." });
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
