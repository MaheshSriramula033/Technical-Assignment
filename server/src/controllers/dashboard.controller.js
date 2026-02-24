const db = require("../config/db");

exports.getSummary = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) AS total_buyers,
        SUM(invoice_total) AS total_invoice,
        SUM(amount_paid) AS total_paid,
        SUM(amount_due) AS total_due
      FROM buyers
      WHERE user_id = ?
    `, [req.user.id]);

    const data = rows[0];

    const percentage =
      data.total_invoice > 0
        ? ((data.total_paid / data.total_invoice) * 100).toFixed(2)
        : 0;

    res.json({
      total_buyers: Number(data.total_buyers),
      total_invoice: Number(data.total_invoice || 0),
      total_paid: Number(data.total_paid || 0),
      total_due: Number(data.total_due || 0),
      collection_percentage: Number(percentage)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};