const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
})

module.exports = mongoose.model('Token', TokenSchema);