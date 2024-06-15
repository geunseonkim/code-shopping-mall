const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteSchema = Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    favorite: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// FavoriteSchema.methods.toJSON = function () {
//   const obj = this._doc;
//   delete obj.__v;
//   return obj;
// };

const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
