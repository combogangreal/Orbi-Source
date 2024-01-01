const mongoose = require("mongoose");

const UserPost = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: String, required: true },
    password: { type: String, required: true },
    posts: [UserPost],
    bio: { type: String, required: true },
    pfp: { type: String, required: false },
    follows: { type: Number, default: 0 },
    scope: { type: Number, default: 1 }, // 1 scope is member perm
    token: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);
const UserPostModel = mongoose.model("UserPost", UserPost);

module.exports = { UserPost: UserPostModel, User };
