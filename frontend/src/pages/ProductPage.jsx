import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const isAdmin = ApiService.isAdmin();

  const navigate = useNavigate();

  //Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getProducts = async () => {
      try {
        let productData;

        if (isSearching && searchValue.trim() !== "") {
          productData = await ApiService.searchProduct(searchValue.trim());
        } else {
          productData = await ApiService.getAllProducts();
        }

        if (productData.status === 200) {
          const list = productData.products || [];
          setTotalPages(Math.ceil(list.length / itemsPerPage));

          setProducts(
            list.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      }
    };

    getProducts();
  }, [currentPage, isSearching, searchValue]);

  const handleDownloadPdf = async () => {
    try {
      let productData;

      if (isSearching && searchValue.trim() !== "") {
        productData = await ApiService.searchProduct(searchValue.trim());
      } else {
        productData = await ApiService.getAllProducts();
      }

      if (productData.status !== 200) {
        showMessage(productData.message || "Unable to generate PDF");
        return;
      }

      const list = productData.products || [];
      if (list.length === 0) {
        showMessage("No products to include in PDF");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Product Listing", 14, 18);
      doc.setFontSize(10);
      doc.text(
        `Total products: ${list.length}${
          isSearching && searchValue.trim() !== ""
            ? ` | Filter: "${searchValue.trim()}"`
            : ""
        }`,
        14,
        24
      );

      const tableColumn = ["Name", "SKU", "Price", "Quantity"];
      const tableRows = list.map((p) => [
        p.name ?? "",
        p.sku ?? "",
        String(p.price ?? ""),
        String(p.stockQuantity ?? ""),
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 128, 128] },
      });

      doc.save("products.pdf");
    } catch (error) {
      console.error(error);
      showMessage("Error generating PDF: " + error);
    }
  };

  //Delete a product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      try {
        await ApiService.deleteProduct(productId);
        showMessage("Product sucessfully Deleted");
        window.location.reload(); //relode page
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Deleting in a product: " + error
        );
      }
    }
  };

  //metjhod to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-page">
        <div className="product-header">
          <h1>Products</h1>
          <div className="product-header-actions">
            <div className="product-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setIsSearching(searchValue.trim() !== "");
                }}
              >
                Search
              </button>
              {isSearching && (
                <button
                  onClick={() => {
                    setSearchValue("");
                    setIsSearching(false);
                    setCurrentPage(1);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            {isAdmin && (
              <>
                <button
                  className="add-product-btn"
                  onClick={handleDownloadPdf}
                >
                  Download PDF
                </button>
                <button
                  className="add-product-btn"
                  onClick={() => navigate("/add-product")}
                >
                  Add Product
                </button>
              </>
            )}
          </div>
        </div>

        {products && (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <img
                  className="product-image"
                  src={ApiService.getProductImageUrl(product.imageUrl)}
                  alt={product.name}
                />

                <div className="product-info">
                    <h3 className="name">{product.name}</h3>
                    <p className="sku">Sku: {product.sku}</p>
                    <p className="price">Price: {product.price}</p>
                    <p className="quantity">Quantity: {product.stockQuantity}</p>
                </div>

                <div className="product-actions">
                    {isAdmin && (
                      <>
                        <button className="edit-btn" onClick={()=> navigate(`/edit-product/${product.id}`)}>Edit</button>
                        <button  className="delete-btn" onClick={()=> handleDeleteProduct(product.id)}>Delete</button>
                      </>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PaginationComponent
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      />
    </Layout>
  );
};
export default ProductPage;
