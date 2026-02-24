const fs = require("fs");
const buyerModel = require("../models/buyer.model");
const { parseFile } = require("../utils/fileParser");

/* ---------- amount sanitizer (VERY IMPORTANT) ---------- */
function parseAmount(val) {
  if (val === undefined || val === null || val === "") return 0;

  return Number(
    String(val)
      .replace(/₹/g, "")      // remove rupee symbol
      .replace(/,/g, "")      // remove comma separators
      .replace(/\s/g, "")     // remove spaces
  ) || 0;
}

/* ---------- upload buyers ---------- */
const uploadBuyers = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "File required" });

    const rows = await parseFile(req.file.path);

const buyers = rows.map(r => ({
  name: r.name || r.customer_name || "",
  email: r.email || "",
  mobile: r.mobile || r.phone || r.contact || "",
  address: r.address || "",

  invoice_total: parseAmount(
    r.total_invoice_amount ||
    r.totalInvoiceAmount ||
    r.invoice_total ||
    r.invoiceAmount ||
    r.total
  ),

  amount_paid: parseAmount(
    r.total_amount_paid ||
    r.totalAmountPaid ||
    r.amount_paid ||
    r.paidAmount ||
    r.paid
  )
}));

    await buyerModel.insertMany(req.user.id, buyers);

    // delete uploaded temp file
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Upload successful",
      count: buyers.length
    });
    console.log("PARSED ROW => ", rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = { uploadBuyers };