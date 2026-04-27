import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const StockInPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const productData = await ApiService.getAllProducts();
        const supplierData = await ApiService.getAllSuppliers();
        setProducts(productData.products || []);
        setSuppliers(supplierData.suppliers || []);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching data: " + error
        );
      }
    };

    fetchProductsAndSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !supplierId || !quantity) {
      showMessage("Please fill in all required fields");
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
      supplierId,
      description,
      note,
    };

    try {
      const response = await ApiService.stockInProduct(body);
      showMessage(response.message, false);
      resetForm();
      setIsConfirming(false);
      // Optional: redirect to transactions after a short delay
      // setTimeout(() => navigate("/transaction"), 2000);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error recording stock-in: " + error
      );
    } finally {
        setLoading(false);
    }
  };

  const resetForm = () => {
    setProductId("");
    setSupplierId("");
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
  const selectedSupplier = suppliers.find(s => s.id === parseInt(supplierId));

  return (
    <Layout>
      <div className="stock-in-container">
        {message && (
          <div className={`message-banner ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="form-card animate-fade-in">
          <div className="form-header">
            <h1>Record Stock-In</h1>
            <p>Update inventory by recording newly received stock from suppliers.</p>
          </div>

          {!isConfirming ? (
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-grid">
                <div className="form-group">
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
                        {product.name} (SKU: {product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="supplier">Supplier <span className="required">*</span></label>
                  <select
                    id="supplier"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    required
                    className="premium-input"
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Enter quantity received"
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
                    placeholder="e.g. Monthly restock"
                    className="premium-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="note">Notes</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Additional details about this delivery..."
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
              <h2>Confirm Stock-In Details</h2>
              <div className="confirmation-details">
                <div className="detail-row">
                  <span>Product:</span>
                  <strong>{selectedProduct?.name}</strong>
                </div>
                <div className="detail-row">
                  <span>Supplier:</span>
                  <strong>{selectedSupplier?.name}</strong>
                </div>
                <div className="detail-row">
                  <span>Quantity:</span>
                  <strong className="text-highlight">+{quantity}</strong>
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
              
              <div className="confirmation-warning">
                <i className="info-icon">!</i>
                <p>This action will increase the current stock of <strong>{selectedProduct?.name}</strong> by <strong>{quantity}</strong> units.</p>
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
                  className="primary-btn" 
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

export default StockInPage;
