const buyerModel = require("../models/buyer.model");

exports.getBuyers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const data = await buyerModel.getBuyers(
      req.user.id,
      page,
      limit,
      search
    );

    res.json({
      page,
      limit,
      totalRecords: data.total,
      totalPages: Math.ceil(data.total / limit),
      data: data.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};