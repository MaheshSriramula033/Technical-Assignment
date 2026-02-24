const db = require("../config/db");

exports.insertMany = async (userId, buyers) => {
  for (const b of buyers) {

    const amount_due = (b.invoice_total || 0) - (b.amount_paid || 0);

    await db.query(
      `INSERT INTO buyers
      (user_id, name, email, mobile, address, invoice_total, amount_paid)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        b.name,
        b.email,
        b.mobile,
        b.address,
        b.invoice_total,
        b.amount_paid
     
      ]
    );
  }
};

exports.getBuyers = async (userId, page, limit, search) => {
  const offset = (page - 1) * limit;

  let where = "WHERE user_id = ?";
  const params = [userId];

  if (search) {
    where += ` AND (name LIKE ? OR email LIKE ? OR mobile LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const [rows] = await db.query(
    `SELECT id, name, email, mobile, address, invoice_total, amount_paid, amount_due
     FROM buyers
     ${where}
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) as total FROM buyers ${where}`,
    params
  );

  return { rows, total };
};