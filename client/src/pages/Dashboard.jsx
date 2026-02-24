import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadFile, getBuyers } from "../api/buyers";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { logout } = useAuth();

  const [buyers, setBuyers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  /* ---------- fetch buyers ---------- */
  const fetchBuyers = async (p = page, s = search) => {
    try {
      const res = await getBuyers(p, 5, s);
      setBuyers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setBuyers([]);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, [page, search]);

  /* ---------- upload file ---------- */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadFile(formData);
      setMessage(res.data.message);
      setPage(1);
      fetchBuyers(1, "");
    } catch {
      setMessage("Upload failed");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Buyer Management</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Upload Card */}
        <section className="upload-card">
          <form onSubmit={handleUpload} className="upload-form">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-upload"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="file-label">
                Choose File
              </label>
              <span className="file-name">{file ? file.name : "No file chosen"}</span>
            </div>
            <button type="submit" className="upload-btn">Upload</button>
          </form>
          {message && <p className="upload-message">{message}</p>}
        </section>

        {/* Search Bar */}
        <div className="search-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, email or mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Buyers Table */}
        <div className="table-wrapper">
          <table className="buyers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Invoice (₹)</th>
                <th>Paid (₹)</th>
                <th>Due (₹)</th>
              </tr>
            </thead>
            <tbody>
              {buyers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-message">
                    No buyers found
                  </td>
                </tr>
              ) : (
                buyers.map((buyer) => (
                  <tr key={buyer.id}>
                    <td>{buyer.name}</td>
                    <td>{buyer.email}</td>
                    <td>{buyer.mobile}</td>
                    <td>₹{buyer.invoice_total}</td>
                    <td>₹{buyer.amount_paid}</td>
                    <td>₹{buyer.amount_due}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}