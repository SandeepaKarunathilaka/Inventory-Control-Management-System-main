import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";

const COLORS = ['#008080', '#2d3748', '#38b2ac', '#4a5568', '#81e6d9', '#718096', '#b2f5ea', '#a0aec0'];

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const responseData = await ApiService.getAllSuppliers();
        if (responseData.status === 200) {
          setSuppliers(responseData.suppliers);
        } else {
          showMessage(responseData.message);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Suppliers: " + error
        );
        console.log(error);
      }
    };
    getSuppliers();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      if (window.confirm("Are you sure you want to delete this supplier?")) {
        await ApiService.deleteSupplier(supplierId);
        window.location.reload();
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting Supplier: " + error
      );
    }
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF('landscape');
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 128, 128);
    doc.text("Supplier Directory Report", 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Suppliers: ${suppliers.length}`, 14, 36);

    const tableColumn = ["ID", "Name", "Company", "Email", "Phone", "Contact Info", "Address", "Goods Supplied"];
    const tableRows = [];

    suppliers.forEach(supplier => {
      tableRows.push([
        supplier.id,
        supplier.name,
        supplier.company || "N/A",
        supplier.email || "N/A",
        supplier.phone || "N/A",
        supplier.contactInfo,
        supplier.address || "N/A",
        supplier.goodsSupplied || "N/A",
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: 'grid',
      headStyles: { fillColor: [0, 128, 128] },
      styles: { fontSize: 8 },
    });

    doc.save("Supplier_Report.pdf");
  };

  // Analytics: Suppliers by Location
  const getLocationData = () => {
    const locationCounts = {};
    suppliers.forEach(supplier => {
      const location = supplier.address ? supplier.address.trim() : "Unknown";
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    return Object.keys(locationCounts).map(location => ({
      location,
      count: locationCounts[location]
    }));
  };

  // Analytics: Suppliers by Goods Type
  const getGoodsData = () => {
    const goodsCounts = {};
    suppliers.forEach(supplier => {
      const goods = supplier.goodsSupplied ? supplier.goodsSupplied.trim() : "Not Specified";
      goodsCounts[goods] = (goodsCounts[goods] || 0) + 1;
    });
    return Object.keys(goodsCounts).map(goods => ({
      name: goods,
      value: goodsCounts[goods]
    }));
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="supplier-page" style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#008080', margin: 0 }}>Supplier Management</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={generatePDFReport}
              style={{ backgroundColor: '#2d3748', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
            >
              📄 Download PDF Report
            </button>
            <button
              onClick={() => navigate("/add-supplier")}
              style={{ backgroundColor: '#008080', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
            >
              + Add Supplier
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #008080' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Total Suppliers</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#008080' }}>{suppliers.length}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #2d3748' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Unique Locations</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748' }}>{getLocationData().length}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #38b2ac' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Goods Categories</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38b2ac' }}>{getGoodsData().length}</div>
          </div>
        </div>

        {/* Analytics Charts */}
        {suppliers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Bar Chart - By Location */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#2d3748', marginBottom: '15px', textAlign: 'center', fontSize: '1rem' }}>Suppliers by Location</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getLocationData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#008080" name="Suppliers" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - By Goods */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#2d3748', marginBottom: '15px', textAlign: 'center', fontSize: '1rem' }}>Suppliers by Goods Supplied</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={getGoodsData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {getGoodsData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Supplier Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#008080', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem' }}>Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem' }}>Company</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem' }}>Email</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem' }}>Phone</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem' }}>Location</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.85rem' }}>Goods Supplied</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    No suppliers found. Click "Add Supplier" to get started.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier, index) => (
                  <tr key={supplier.id} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white', borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#2d3748' }}>{supplier.name}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{supplier.company || "—"}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{supplier.email || "—"}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{supplier.phone || "—"}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{supplier.address || "—"}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{supplier.goodsSupplied || "—"}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/edit-supplier/${supplier.id}`)}
                        style={{ backgroundColor: '#008080', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontSize: '13px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SupplierPage;
