import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditSupplierPage = () => {
  const { supplierId } = useParams("");
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [goodsSupplied, setGoodsSupplied] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);

      const fetchSupplier = async () => {
        try {
          const supplierData = await ApiService.getSupplierById(supplierId);
          if (supplierData.status === 200) {
            setName(supplierData.supplier.name);
            setContactInfo(supplierData.supplier.contactInfo);
            setAddress(supplierData.supplier.address);
            setEmail(supplierData.supplier.email || "");
            setPhone(supplierData.supplier.phone || "");
            setCompany(supplierData.supplier.company || "");
            setNotes(supplierData.supplier.notes || "");
            setGoodsSupplied(supplierData.supplier.goodsSupplied || "");
            setQuantity(supplierData.supplier.quantity || "");
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error Getting a Supplier by Id: " + error
          );
        }
      };
      fetchSupplier();
    }
  }, [supplierId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierData = { name, contactInfo, address, email, phone, company, notes, goodsSupplied, quantity: quantity ? parseInt(quantity) : null };

    try {
      if (isEditing) {
        await ApiService.updateSupplier(supplierId, supplierData);
        showMessage("Supplier Edited succesfully");
        navigate("/supplier")
      } else {
        await ApiService.addSupplier(supplierData);
        showMessage("Supplier Added succesfully");
        navigate("/supplier")
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error saving Supplier: " + error
      );
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="supplier-form-page">
        <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Supplier Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              placeholder="e.g. ABC Supplies Ltd."
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="e.g. supplier@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="e.g. +94 77 123 4567"
            />
          </div>

          <div className="form-group">
            <label>Contact Info *</label>
            <input
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
              type="text"
              placeholder="e.g. Main warehouse contact"
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              type="text"
              placeholder="e.g. 123 Main St, Colombo"
            />
          </div>

          <div className="form-group">
            <label>Goods Supplied</label>
            <input
              value={goodsSupplied}
              onChange={(e) => setGoodsSupplied(e.target.value)}
              type="text"
              placeholder="e.g. Electronics, Cables, Raw Materials"
            />
          </div>

          <div className="form-group">
            <label>Quantity (Stock Capacity)</label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              min="0"
              placeholder="e.g. 500"
            />
          </div>

          <div className="form-group">
            <label>Notes / Remarks</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions, payment terms, delivery schedule, etc."
              rows="4"
              style={{ width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '5px', resize: 'vertical' }}
            />
          </div>

          <button type="submit">
            {isEditing ? "Update Supplier" : "Add Supplier"}
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default AddEditSupplierPage;
