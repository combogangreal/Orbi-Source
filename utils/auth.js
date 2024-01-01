// Set JWT params
const jwt = require("jsonwebtoken");
// const refreshTokenSecret = "e59b48b0e12906815fc142fee6d67ea5772799acaae027279c9271adee0797e363e9a46a9c2d2670922d02b96db8940ead5f183bd123fc1514c9b38f53ed18cb855f01b810aedaa81e";
const accessTokenSecret =
    "e59b48b0e12906815fc142fee6d67ea5772799acaae027279c9271adee0797e363e9a46a9c2d2670922d02b96db8940ead5f183bd123fc1514c9b38f53ed18cb855f01b810aedaa81e";

// const refreshTokenSecret = process.env['refreshTokenSecret'];
// const accessTokenSecret = process.env['accessTokenSecret'];

// const refreshTokenExp = '7d';
const accessTokenExp = "24h";

/*
  Refresh Token Start
*/
// Create a new refresh token
// function generateRefreshToken(payload) {
//   try {
//     // Check variables
//     if (!refreshTokenSecret) {
//       console.log("The refreshTokenSecret does not exist.");
//       return false;
//     };
//     if (!refreshTokenExp) {
//       console.log("The refreshTokenExp does not exist.");
//       return false;
//     };

//     // Create a JWT
//     const refreshToken = jwt.sign(payload, refreshTokenSecret, {
//       expiresIn: refreshTokenExp,
//     });

//     // Return the JWT
//     return refreshToken;
//   } catch (e) {
//     console.log(`An error has occured when generating a refreshToken.\n${e}`)
//     return false;
//   }
// }

// Validate refresh token
// function validateRefreshToken(token) {
//   try {
//     const decoded = jwt.verify(token, refreshTokenSecret);
//     const currentTime = Math.floor(Date.now() / 1000);

//     if (decoded.exp > currentTime) {
//       // Valid
//       return {
//         status: 200,
//         message: "Token is still valid."
//       };
//     } else {
//       // Expired
//       return {
//         status: 401,
//         message: "Token has expired."
//       }
//     }
//   } catch (e) {
//     // Invalid
//     //console.log("An error has occured when validating a JWT.\n" + e);

//     return {
//       status: 401,
//       message: "This token is invalid."
//     };
//   }
// }
/*
  Refresh Token End
*/

/*
  Access Token Start
*/
// Create a new access token
function generateAccessToken(payload) {
    try {
        // Check variables
        if (!accessTokenSecret) {
            console.log("The accessTokenSecret does not exist.");
            return false;
        }
        if (!accessTokenExp) {
            console.log("The accessTokenExp does not exist.");
            return false;
        }

        // Create a JWT
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: accessTokenExp,
        });

        // Return the JWT
        return accessToken;
    } catch (e) {
        console.log(
            `An error has occured when generating a accessToken.\n${e}`
        );
        return false;
    }
}

// Validate Access Token
function validateAccessToken(token) {
    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp > currentTime) {
            // Valid
            return {
                status: 200,
                message: "Token is still valid.",
            };
        } else {
            // Expired
            return {
                status: 401,
                message: "Token has expired.",
            };
        }
    } catch (e) {
        // Invalid
        //console.log("An error has occured when validating a JWT.\n" + e);

        return {
            status: 401,
            message: "This token is invalid.",
        };
    }
}
/*
  Access Token End
*/

// Check Access Token - take access token as input
function checkAccessToken(req, res) {
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

        // * This can be refactored to be more concise
        if (status === 401) {
            return res.status(401).json({
                status: 401,
                message:
                    "Either your token has expired, or the token you have input is invalid.",
            });
        } else if (status === 200) {
            return {
                status: 200,
                message: "This is a valid token.",
            };
        } else {
            return res.status(500).json({
                status: 500,
                message: "An error has occured when validating the token.",
                easterEgg: "When in doubt, blame Roc",
            });
        }
    } catch (e) {
        //console.log("An error has occured when checking auth.\n" + e);

        return res.status(500).json({
            status: 500,
            message: "An error has occured when validating the token.",
        });
    }
}

function verifyAccessToken(req, res, next) {
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

        // * This can be refactored to be more concise
        if (status === 401) {
            return res.status(401).json({
                status: 401,
                message:
                    "Either your token has expired, or the token you have input is invalid.",
            });
        } else if (status === 200) {
            return next();
        } else {
            return res.status(500).json({
                status: 500,
                message: "An error has occured when validating the token.",
                easterEgg: "When in doubt, blame Roc",
            });
        }
    } catch (e) {
        //console.log("An error has occured when checking auth.\n" + e);

        return res.status(500).json({
            status: 500,
            message: "An error has occured when validating the token.",
        });
    }
}

module.exports = {
    // generateRefreshToken,
    // validateRefreshToken,
    generateAccessToken,
    validateAccessToken,
    checkAccessToken,
    verifyAccessToken,
};
