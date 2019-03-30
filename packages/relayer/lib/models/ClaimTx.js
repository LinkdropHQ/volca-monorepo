const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClaimTxSchema = new Schema(
  {
    contract: {
      type: String,
      required: true
    },
    linkPubKey: {
      type: String,
      required: true,
      index: true
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
    txHash: {
      type: String,
      required: true
    },
    referralAddress: {
      type: String,
      index: true
    },
    receiverAddress: {
      // receiver address
      type: String,
      required: true
    },
    referralCode: {
      type: String
    }
  },
  { timeStamps: true }
);

// for faster lookups on blockchain events update
/// ClaimTxSchema.index({contract: 1, userId: 1}, {unique: true, name: "AirdropContract_Email_Index"});

// delete sensitive info by default
// ClaimTxSchema.methods.toJSON = function() {
//     var obj = this.toObject();
//     delete obj.transitKeystore;
//     delete obj.verified;
//     delete obj._id;
//     delete obj.senderAddress;
//     delete obj.transitAddress;
//     delete obj.phoneHash;
//     return obj;
// }

var ClaimTx = mongoose.model("ClaimTx", ClaimTxSchema);

module.exports = ClaimTx;
module.exports.Schema = ClaimTxSchema;
