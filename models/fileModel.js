const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    fileName: String,
    fileUrl: String,
    publicId: String,
    fileSize: Number,
    fileType: String,

    uploadedBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
    },

    sharedWith: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
    ]
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);
module.exports = File;