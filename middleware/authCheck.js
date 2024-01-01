const { validateAccessToken } = require("../utils/auth");

// Check Access Token - take access token as input
function authCheck(req, res, next) {
    try {
        // Get the token from the request
        let bearer = req.headers.authorization;
        if (!bearer) {
            return res.status(401).json({
                message:
                    "This is a protected resource, you need an access token to access this.",
            });
        }

        // Extract token from "Bearer"
        const tokenArray = bearer.split(" ");
        const token = tokenArray[1];

        // Validate token
        const { status } = validateAccessToken(token);
        switch (status) {
            case 200:
                return next();
            case 401:
                return res.status(401).json({
                    status: 401,
                    message:
                        "Either your token has expired, or the token you have input is invalid.",
                });
            default:
                return res.status(500).json({
                    status: 500,
                    message: "An error has occured when validating the token.",
                    easterEgg: "When in doubt, blame Roc",
                });
        }
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: "An error has occured when validating the token.",
        });
    }
}

module.exports = { authCheck };
