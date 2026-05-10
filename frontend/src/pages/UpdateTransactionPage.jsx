import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTransactionPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await ApiService.getTransactionById(transactionId);
        if (response.status === 200) {
          const t = response.transaction;
          setTransaction(t);
          setQuantity(t.totalProducts);
          setDescription(t.description || "");
          setNote(t.note || "");
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Error fetching transaction details", true);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || parseInt(quantity) <= 0) {
      showMessage("Quantity must be a positive number", true);
      return;
    }

    setLoading(true);
    const body = {
      productId: transaction.product.id,
      quantity: parseInt(quantity),
      description,
      note,
    };
    if (transaction.supplier) {
        body.supplierId = transaction.supplier.id;
    }

    try {
      const response = await ApiService.updateTransaction(transactionId, body);
      showMessage(response.message, false);
      setTimeout(() => {
          navigate(`/transaction/${transactionId}`);
      }, 2000);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating transaction: " + error,
        true
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, isError = true) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  if (!transaction) return <Layout><div className="loading">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="stock-in-container">
        {message && (
          <div className={`message-banner ${message.includes("Error") || message.includes("Insufficient") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="form-card animate-fade-in">
          <div className="form-header">
            <h1>Update Transaction</h1>
            <p>Modify transaction details. Stock quantities will be adjusted automatically.</p>
          </div>

          <div className="transaction-summary-box" style={{ padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
             <p style={{ margin: '5px 0' }}><strong>Type:</strong> {transaction.transactionType}</p>
             <p style={{ margin: '5px 0' }}><strong>Product:</strong> {transaction.product.name} (Current Stock: {transaction.product.stockQuantity})</p>
             <p style={{ margin: '5px 0' }}><strong>Original Quantity:</strong> {transaction.totalProducts}</p>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="quantity">Quantity <span className="required">*</span></label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="premium-input"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="premium-input"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="note">Notes</label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="premium-input"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="secondary-btn" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateTransactionPage;
