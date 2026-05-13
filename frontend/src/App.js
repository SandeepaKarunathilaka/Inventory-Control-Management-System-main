import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ProtectedRoute, AdminRoute } from "./service/Guard";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import CategoryPage from "./pages/CategoryPage";

import SupplierPage from "./pages/SupplierPage";
import AddEditSupplierPage from "./pages/AddEditSupplierPage";

import ProductPage from "./pages/ProductPage";
import AddEditProductPage from "./pages/AddEditProductPage";

import StockInPage from "./pages/StockInPage";
import StockOutPage from "./pages/StockOutPage";

import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";

import TransactionReportPage from "./pages/TransactionReportPage";
import UpdateTransactionPage from "./pages/UpdateTransactionPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import WarehousePage from "./pages/WarehousePage";
import StockLocationsPage from "./pages/StockLocationsPage";

import WarehousePage from "./pages/WarehousePage";

function App() {

  return (

    <Router>

      <Routes>

        {/* AUTH ROUTES */}

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />



        {/* ADMIN ONLY ROUTES */}

        <Route
          path="/category"
          element={<AdminRoute element={<CategoryPage />} />}
        />

        <Route
          path="/users"
          element={<AdminRoute element={<UserManagementPage />} />}
        />
        <Route
          path="/supplier"
          element={<AdminRoute element={<SupplierPage />} />}
        />

        <Route
          path="/add-supplier"
          element={<AdminRoute element={<AddEditSupplierPage />} />}
        />

        <Route
          path="/edit-supplier/:supplierId"
          element={<AdminRoute element={<AddEditSupplierPage />} />}
        />

        <Route
          path="/product"
          element={<AdminRoute element={<ProductPage />} />}
        />

        <Route
          path="/add-product"
          element={<AdminRoute element={<AddEditProductPage />} />}
        />

        <Route
          path="/edit-product/:productId"
          element={<AdminRoute element={<AddEditProductPage />} />}
        />



        {/* ADMIN + MANAGER ROUTES */}

        <Route
          path="/warehouse"
          element={<ProtectedRoute element={<WarehousePage />} />}
        />

        <Route
          path="/stock-in"
          element={<ProtectedRoute element={<StockInPage />} />}
        />

        <Route
          path="/stock-out"
          element={<ProtectedRoute element={<StockOutPage />} />}
        />

        <Route
          path="/transaction"
          element={<ProtectedRoute element={<TransactionsPage />} />}
        />

        <Route
          path="/transaction/:transactionId"
          element={<ProtectedRoute element={<TransactionDetailsPage />} />}
        />
        <Route path="/transaction-report" element={<ProtectedRoute element={<TransactionReportPage/>}/>}/>
        <Route path="/update-transaction/:transactionId" element={<ProtectedRoute element={<UpdateTransactionPage/>}/>}/>

        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage/>}/>}/>
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage/>}/>}/>

        {/* WAREHOUSE & STOCK LOCATION */}
        <Route path="/warehouse" element={<ProtectedRoute element={<WarehousePage/>}/>}/>
        <Route path="/stock-locations" element={<ProtectedRoute element={<StockLocationsPage/>}/>}/>



        {/* DEFAULT ROUTE */}

        <Route
          path="*"
          element={<LoginPage />}
        />

      </Routes>

    </Router>
  );
}

export default App;