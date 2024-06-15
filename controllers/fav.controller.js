const Favorite = require("../model/Favorite");

const favController = {};
favController.getFavorite = async (req, res) => {
  try {
    const { userId } = req;
    let favorite = await Favorite.findOne({ userId }).populate({
      path: "favorite",
      model: "Product",
    });
    if (!favorite) {
      favorite = new Favorite({ userId, favorite: [] });
      await favorite.save();
    }
    return res.status(200).json({
      status: "success",
      favorite,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

favController.addFavorite = async (req, res) => {
  try {
    const { userId } = req;
    const favoriteId = req.params.id;
    const favorite = await Favorite.findOneAndUpdate(
      { userId }, // 조건
      { $push: { favorite: favoriteId } },
      { new: true, upsert: true }
    );
    return res.status(200).json({ status: "success", favorite });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};

favController.deleteFavorite = async (req, res) => {
  try {
    const { userId } = req;
    const favoriteId = req.params.id;
    const favorite = await Favorite.findOneAndUpdate(
      { userId }, // 조건
      { $pull: { favorite: favoriteId } },
      { new: true }
    );
    return res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message });
  }
};
module.exports = favController;
