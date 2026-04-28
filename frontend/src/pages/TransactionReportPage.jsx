import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const TransactionReportPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [productName, setProductName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Summary state
  const [summary, setSummary] = useState({
    stockIn: 0,
    stockOut: 0,
    returned: 0,
    totalValue: 0
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await ApiService.getTransactionReport(startDate, endDate);
      if (response.status === 200) {
        const data = response.transactions || [];
        setTransactions(data);
        applyLocalFilters(data, type, productName, supplierName);
        showMessage("Report data fetched successfully", false);
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error generating report", true);
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilters = (data, filterType, filterProduct, filterSupplier) => {
    let filtered = data;

    if (filterType) {
      filtered = filtered.filter(t => t.transactionType === filterType);
    }
    if (filterProduct) {
      filtered = filtered.filter(t => t.product?.name?.toLowerCase().includes(filterProduct.toLowerCase()));
    }
    if (filterSupplier) {
      filtered = filtered.filter(t => t.supplier?.name?.toLowerCase().includes(filterSupplier.toLowerCase()));
    }

    setFilteredTransactions(filtered);
    calculateSummary(filtered);
  };

  useEffect(() => {
      applyLocalFilters(transactions, type, productName, supplierName);
  }, [type, productName, supplierName, transactions]);

  const calculateSummary = (data) => {
    let stockIn = 0;
    let stockOut = 0;
    let returned = 0;
    let totalValue = 0;

    data.forEach(t => {
      if (t.transactionType === 'STOCK_IN') stockIn += t.totalProducts;
      if (t.transactionType === 'STOCK_OUT' || t.transactionType === 'SALE') stockOut += t.totalProducts;
      if (t.transactionType === 'RETURN_TO_SUPPLIER') returned += t.totalProducts;
      
      totalValue += t.totalPrice || 0;
    });

    setSummary({ stockIn, stockOut, returned, totalValue });
  };

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(""), 4000);
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
        showMessage("No data to export", true);
        return;
    }

    const headers = ["ID", "Type", "Status", "Product", "Supplier", "Quantity", "Total Price", "Date"];
    const rows = filteredTransactions.map(t => [
        t.id,
        t.transactionType,
        t.status,
        t.product?.name || 'N/A',
        t.supplier?.name || 'N/A',
        t.totalProducts,
        t.totalPrice,
        new Date(t.createdAt).toLocaleDateString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (filteredTransactions.length === 0) {
        showMessage("No data to export", true);
        return;
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Inventory Transaction Report", 14, 22);
    
    // Add Summary
    doc.setFontSize(11);
    doc.text(`Total Stock-In: ${summary.stockIn}`, 14, 32);
    doc.text(`Total Stock-Out: ${summary.stockOut}`, 14, 38);
    doc.text(`Total Returned: ${summary.returned}`, 14, 44);
    doc.text(`Total Value: Rs. ${summary.totalValue.toFixed(2)}`, 14, 50);

    // Prepare table data
    const tableColumn = ["ID", "Type", "Status", "Product", "Qty", "Price", "Date"];
    const tableRows = [];

    filteredTransactions.forEach(t => {
      const transactionData = [
        t.id,
        t.transactionType,
        t.status,
        t.product?.name || 'N/A',
        t.totalProducts,
        `Rs. ${t.totalPrice?.toFixed(2)}`,
        new Date(t.createdAt).toLocaleDateString()
      ];
      tableRows.push(transactionData);
    });

    // Generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 56,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save("transaction_report.pdf");
  };

  return (
    <Layout>
      <div className="report-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px', color: '#2d3748' }}>Generate Report</h1>
        
        {message && (
          <div className={`message-banner ${message.isError ? "error" : "success"}`}>
            {message.text}
          </div>
        )}

        {/* Filter Section */}
        <div className="form-card" style={{ marginBottom: '20px' }}>
          <form onSubmit={handleGenerate} className="premium-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="premium-input" />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="premium-input" />
              </div>
              <div className="form-group">
                <label>Transaction Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="premium-input">
                  <option value="">All</option>
                  <option value="STOCK_IN">Stock-In</option>
                  <option value="STOCK_OUT">Stock-Out</option>
                  <option value="RETURN_TO_SUPPLIER">Return</option>
                </select>
              </div>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Filter by product" value={productName} onChange={(e) => setProductName(e.target.value)} className="premium-input" />
              </div>
              <div className="form-group full-width">
                <label>Supplier Name</label>
                <input type="text" placeholder="Filter by supplier" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} className="premium-input" />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: '20px' }}>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Fetching..." : "Fetch Report Data"}
              </button>
            </div>
          </form>
        </div>

        {/* Summary Section */}
        {filteredTransactions.length > 0 && (
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div className="section-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Total Stock-In</h3>
                <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#38a169' }}>{summary.stockIn}</p>
            </div>
            <div className="section-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Total Stock-Out</h3>
                <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#e53e3e' }}>{summary.stockOut}</p>
            </div>
            <div className="section-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Total Returned</h3>
                <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#dd6b20' }}>{summary.returned}</p>
            </div>
            <div className="section-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3 style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Total Value</h3>
                <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#3182ce' }}>Rs. {summary.totalValue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {filteredTransactions.length > 0 ? (
          <div className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Preview ({filteredTransactions.length} records)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="secondary-btn" onClick={exportToCSV}>Export CSV</button>
                    <button className="primary-btn" onClick={exportToPDF}>Export PDF</button>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="transactions-table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>TYPE</th>
                    <th>PRODUCT</th>
                    <th>QTY</th>
                    <th>PRICE</th>
                    <th>DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.slice(0, 50).map(t => (
                    <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.transactionType}</td>
                        <td>{t.product?.name || 'N/A'}</td>
                        <td>{t.totalProducts}</td>
                        <td>Rs. {t.totalPrice?.toFixed(2)}</td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {filteredTransactions.length > 50 && (
                    <p style={{ textAlign: 'center', marginTop: '10px', color: '#718096' }}>Showing first 50 records. Export to view all.</p>
                )}
            </div>
          </div>
        ) : (
            !loading && transactions.length > 0 && <p style={{ textAlign: 'center' }}>No records match the selected filters.</p>
        )}
      </div>
    </Layout>
  );
};

export default TransactionReportPage;
