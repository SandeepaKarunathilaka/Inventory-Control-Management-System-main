import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const StockOutPage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();
        setProducts(productData.products || []);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching products: " + error
        );
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !quantity) {
      showMessage("Please fill in all required fields");
      return;
    }

    const selectedProduct = products.find(p => p.id === parseInt(productId));
    if (parseInt(quantity) > selectedProduct.stockQuantity) {
        showMessage(`Insufficient stock! Available: ${selectedProduct.stockQuantity}`);
        return;
    }

    if (parseInt(quantity) <= 0) {
        showMessage("Quantity must be a positive number");
        return;
    }

    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    const body = {
      productId,
      quantity: parseInt(quantity),
      description,
      note,
    };

    try {
      const response = await ApiService.stockOutProduct(body);
      showMessage(response.message, false);
      resetForm();
      setIsConfirming(false);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error recording stock-out: " + error
      );
    } finally {
        setLoading(false);
    }
  };

  const resetForm = () => {
    setProductId("");
    setDescription("");
    setNote("");
    setQuantity("");
  };

  const showMessage = (msg, isError = true) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const selectedProduct = products.find(p => p.id === parseInt(productId));

  return (
    <Layout>
      <div className="stock-in-container">
        {message && (
          <div className={`message-banner ${message.includes("Error") || message.includes("Insufficient") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="form-card animate-fade-in">
          <div className="form-header stock-out-header">
            <h1>Record Stock-Out</h1>
            <p>Remove stock from inventory for sales or issues.</p>
          </div>

          {!isConfirming ? (
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="product">Product <span className="required">*</span></label>
                  <select
                    id="product"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                    className="premium-input"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Available: {product.stockQuantity})
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                      <div className="stock-info-badge">
                          Current Stock: <strong>{selectedProduct.stockQuantity}</strong>
                      </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity <span className="required">*</span></label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    placeholder="Enter quantity to remove"
                    className="premium-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Daily sale"
                    className="premium-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="note">Notes</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Additional details about this stock-out..."
                    className="premium-input"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit" className="primary-btn">Review Transaction</button>
              </div>
            </form>
          ) : (
            <div className="confirmation-view animate-slide-up">
              <h2>Confirm Stock-Out Details</h2>
              <div className="confirmation-details">
                <div className="detail-row">
                  <span>Product:</span>
                  <strong>{selectedProduct?.name}</strong>
                </div>
                <div className="detail-row">
                  <span>Quantity to Remove:</span>
                  <strong className="text-highlight-red">-{quantity}</strong>
                </div>
                <div className="detail-row">
                  <span>Remaining Stock After:</span>
                  <strong>{selectedProduct?.stockQuantity - parseInt(quantity)}</strong>
                </div>
                <div className="detail-row">
                  <span>Description:</span>
                  <strong>{description || "N/A"}</strong>
                </div>
                {note && (
                  <div className="detail-row">
                    <span>Note:</span>
                    <strong>{note}</strong>
                  </div>
                )}
              </div>
              
              <div className="confirmation-warning warning-red">
                <i className="info-icon icon-red">!</i>
                <p>This action will permanently reduce the stock of <strong>{selectedProduct?.name}</strong> by <strong>{quantity}</strong> units.</p>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="secondary-btn" 
                  onClick={() => setIsConfirming(false)}
                  disabled={loading}
                >
                  Go Back
                </button>
                <button 
                  type="button" 
                  className="primary-btn btn-red" 
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm & Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StockOutPage;
