import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useLocation } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [supplierFilterId, setSupplierFilterId] = useState(null);

  const isAdmin = ApiService.isAdmin();
  const isManagerView = !isAdmin;

  const navigate = useNavigate();
  const location = useLocation();

  //Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ApiService.getAllCategory();
        if (res.status === 200 && res.categories) setCategories(res.categories);
      } catch (_) {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUsesInfo();
        setUserProfile(userInfo);
      } catch (_) {
        // Keep UI functional without profile response
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const focusId = location.state?.focusProductId;
    if (!focusId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await ApiService.getProductById(String(focusId));
        if (!cancelled && res.status === 200 && res.product) {
          setSelectedProduct(res.product);
        }
      } catch (_) {
        /* ignore */
      } finally {
        if (!cancelled) {
          navigate(location.pathname, { replace: true, state: {} });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.state?.focusProductId, location.pathname, navigate]);

  useEffect(() => {
    const sid = location.state?.focusSupplierId;
    if (sid == null) return;
    setSupplierFilterId(Number(sid));
    setCurrentPage(1);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state?.focusSupplierId, location.pathname, navigate]);

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
          let list = productData.products || [];
          const categoryId = selectedCategoryId ? Number(selectedCategoryId) : null;
          if (categoryId) {
            list = list.filter(
              (p) => (p.categoryId ?? p.category?.id) === categoryId
            );
          }
          if (supplierFilterId != null) {
            list = list.filter((p) => Number(p.supplierId) === supplierFilterId);
          }
          setTotalPages(Math.ceil(list.length / itemsPerPage) || 1);

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
  }, [currentPage, isSearching, searchValue, selectedCategoryId, supplierFilterId]);

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

      let list = productData.products || [];
      const categoryId = selectedCategoryId ? Number(selectedCategoryId) : null;
      if (categoryId) {
        list = list.filter(
          (p) => (p.categoryId ?? p.category?.id) === categoryId
        );
      }
      if (supplierFilterId != null) {
        list = list.filter((p) => Number(p.supplierId) === supplierFilterId);
      }
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

      const tableColumn = [
        "Name",
        "SKU",
        "Supplier",
        "Price",
        "Quantity",
        "Availability",
      ];
      const tableRows = list.map((p) => [
        p.name ?? "",
        p.sku ?? "",
        p.supplierName ?? "N/A",
        String(p.price ?? ""),
        String(p.stockQuantity ?? ""),
        getAvailabilityStatus(p.stockQuantity),
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

  const getAvailabilityStatus = (quantity) =>
    Number(quantity) > 0 ? "In Stock" : "Out of Stock";

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className={`product-page ${isManagerView ? "product-modern-shell" : ""}`}>
        {isManagerView && (
          <div className="product-modern-topbar">
            <div className="product-modern-nav">
              <button className="active">Products</button>
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button onClick={() => navigate("/stock-in")}>Stock-in</button>
              <button onClick={() => navigate("/profile")}>Profile</button>
            </div>
            <div className="product-modern-profile">
              <span className="role-pill">{userProfile?.role || "MANAGER"}</span>
              <span>{userProfile?.name || "Manager"}</span>
            </div>
          </div>
        )}
        <div className="product-header">
          {supplierFilterId != null && (
            <div className="entity-link-banner product-supplier-filter-banner">
              <span>Showing products linked to this supplier.</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSupplierFilterId(null);
                  setCurrentPage(1);
                }}
              >
                Clear supplier filter
              </button>
            </div>
          )}
          <div className="product-header-top">
            <div className="product-header-title">
              <h1>Products</h1>
              <p className="product-header-subtitle">
                Browse inventory, check availability, and view supplier details.
              </p>
            </div>
            <div className="product-header-meta">
              <span className="count-pill">{`Showing ${products.length}`}</span>
              <span className="count-pill">
                {isSearching ? "Filtered" : "All"}
              </span>
            </div>
          </div>

          <div className="product-header-actions">
            {/* Category filter: available to all roles (ADMIN + MANAGER) */}
            <div className="product-filters">
              <label htmlFor="category-filter" className="product-filter-label">
                Category
              </label>
              <select
                id="category-filter"
                className="product-category-filter"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="product-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                className="btn btn-primary btn-md"
                onClick={() => {
                  setCurrentPage(1);
                  setIsSearching(searchValue.trim() !== "");
                }}
              >
                Search
              </button>
              {isSearching && (
                <button
                  className="btn btn-ghost btn-md"
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
                  className="btn btn-secondary btn-md"
                  onClick={handleDownloadPdf}
                >
                  Download PDF
                </button>
                <button
                  className="btn btn-primary btn-md"
                  onClick={() => navigate("/add-product")}
                >
                  Add Product
                </button>
              </>
            )}
          </div>
        </div>

        {products && products.length > 0 && (
          <div className={`product-list ${isManagerView ? "product-modern-grid" : ""}`}>
            {products.map((product) => (
              <div
                key={product.id}
                className={`product-item ${isManagerView ? "product-modern-card" : ""}`}
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  className={`product-image ${isManagerView ? "product-modern-image" : ""}`}
                  src={ApiService.getProductImageUrl(product.imageUrl)}
                  alt={product.name}
                />

                <div className="product-info">
                  <h3 className="name">{product.name}</h3>
                  <p className="sku">SKU: {product.sku}</p>
                  <p className="supplier">
                    Supplier:{" "}
                    {isAdmin && product.supplierId ? (
                      <button
                        type="button"
                        className="link-button product-supplier-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/supplier", {
                            state: { focusSupplierId: product.supplierId },
                          });
                        }}
                      >
                        {product.supplierName ?? `Supplier #${product.supplierId}`}
                      </button>
                    ) : (
                      <span>{product.supplierName ?? "N/A"}</span>
                    )}
                  </p>
                  <p className="price">Price: ${product.price}</p>
                  <p className="quantity">Quantity: {product.stockQuantity}</p>
                  <p className="availability">
                    Availability:{" "}
                    <span
                      className={
                        Number(product.stockQuantity) > 0
                          ? "availability-badge in-stock"
                          : "availability-badge out-of-stock"
                      }
                    >
                      {getAvailabilityStatus(product.stockQuantity)}
                    </span>
                  </p>
                </div>

                <div
                  className="product-card-links"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      navigate("/stock-in", {
                        state: {
                          productId: product.id,
                          supplierId: product.supplierId || undefined,
                        },
                      })
                    }
                  >
                    Stock-in
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      navigate("/stock-out", { state: { productId: product.id } })
                    }
                  >
                    Stock-out
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      navigate("/transaction", {
                        state: { focusProductId: product.id },
                      })
                    }
                  >
                    Movements
                  </button>
                </div>

                <div className="product-actions">
                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-product/${product.id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {products && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-card">
              <h3>No products found</h3>
              <p className="muted-text">
                Try clearing the search, changing the category, or adding a new product.
              </p>
              {isAdmin && (
                <button
                  className="btn btn-primary btn-md"
                  onClick={() => navigate("/add-product")}
                  style={{ maxWidth: 220, marginTop: 10 }}
                >
                  Add Product
                </button>
              )}
            </div>
          </div>
        )}
        {selectedProduct && (
          <div
            className="product-modal-backdrop"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="product-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="product-modal-close"
                aria-label="Close"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>

              <div className="product-modal-header">
                <img
                  className="product-modal-image"
                  src={ApiService.getProductImageUrl(selectedProduct.imageUrl)}
                  alt={selectedProduct.name}
                />
              </div>

              <div className="product-modal-body">
                <h2>{selectedProduct.name}</h2>
                <p>
                  <span className="label">SKU:</span> {selectedProduct.sku}
                </p>
                <p>
                  <span className="label">Supplier:</span>{" "}
                  {isAdmin && selectedProduct.supplierId ? (
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => {
                        navigate("/supplier", {
                          state: { focusSupplierId: selectedProduct.supplierId },
                        });
                        setSelectedProduct(null);
                      }}
                    >
                      {selectedProduct.supplierName ?? `Supplier #${selectedProduct.supplierId}`}
                    </button>
                  ) : (
                    <span>{selectedProduct.supplierName ?? "N/A"}</span>
                  )}
                </p>
                <p>
                  <span className="label">Price:</span> ${selectedProduct.price}
                </p>
                <p>
                  <span className="label">Quantity:</span>{" "}
                  {selectedProduct.stockQuantity}
                </p>
                <p>
                  <span className="label">Availability:</span>{" "}
                  <span
                    className={
                      Number(selectedProduct.stockQuantity) > 0
                        ? "availability-badge in-stock"
                        : "availability-badge out-of-stock"
                    }
                  >
                    {getAvailabilityStatus(selectedProduct.stockQuantity)}
                  </span>
                </p>
                {selectedProduct.description && (
                  <p>
                    <span className="label">Description:</span>{" "}
                    {selectedProduct.description}
                  </p>
                )}
                {selectedProduct.expiryDate && (
                  <p>
                    <span className="label">Expiry Date:</span>{" "}
                    {new Date(
                      selectedProduct.expiryDate
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="product-modal-connections" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigate("/stock-in", {
                      state: {
                        productId: selectedProduct.id,
                        supplierId: selectedProduct.supplierId || undefined,
                      },
                    });
                    setSelectedProduct(null);
                  }}
                >
                  Stock-in
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigate("/stock-out", { state: { productId: selectedProduct.id } });
                    setSelectedProduct(null);
                  }}
                >
                  Stock-out
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    navigate("/transaction", {
                      state: { focusProductId: selectedProduct.id },
                    });
                    setSelectedProduct(null);
                  }}
                >
                  Movements
                </button>
              </div>

              {isAdmin && (
                <div className="product-modal-footer">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      navigate(`/edit-product/${selectedProduct.id}`);
                      setSelectedProduct(null);
                    }}
                  >
                    Edit Product
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      handleDeleteProduct(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                  >
                    Delete Product
                  </button>
                </div>
              )}
            </div>
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
