const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClaimLinkSchema = new Schema(
  {
    contract: {
      type: String,
      required: true
    },
    linkPubKey: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    user: {
      email: {
        type: String
      },
      email_verified: {
        type: String
      },
      name: {
        type: String
      },
      given_name: {
        type: String
      },
      family_name: {
        type: String
      },
      locale: {
        type: String
      },
      picture: {
        type: String
      },
      googleId: {
        type: String
      }
    },
    link: {
      type: String,
      required: true
    }
  },
  { timeStamps: true }
);

// for faster lookups on blockchain events update
ClaimLinkSchema.index(
  { contract: 1, userId: 1 },
  { unique: true, name: "AirdropContract_UserId_Index" }
);
ClaimLinkSchema.index(
  { contract: 1, linkPubKey: 1 },
  { unique: true, name: "AirdropContract_LinkPubKey_Index" }
);

// delete sensitive info by default
// ClaimLinkSchema.methods.toJSON = function() {
//     var obj = this.toObject();
//     delete obj.transitKeystore;
//     delete obj.verified;
//     delete obj._id;
//     delete obj.senderAddress;
//     delete obj.transitAddress;
//     delete obj.phoneHash;
//     return obj;
// }

var ClaimLink = mongoose.model("ClaimLink", ClaimLinkSchema);

module.exports = ClaimLink;
module.exports.Schema = ClaimLinkSchema;
