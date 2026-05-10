import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import SupplierPage from "./pages/SupplierPage";
import AddEditSupplierPage from "./pages/AddEditSupplierPage";
import ProductPage from "./pages/ProductPage";
import AddEditProductPage from "./pages/AddEditProductPage";
import StockInPage from "./pages/StockInPage";
import StockOutPage from "./pages/StockOutPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import UpdateTransactionPage from "./pages/UpdateTransactionPage";
import TransactionReportPage from "./pages/TransactionReportPage";


import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>

        {/* ADMIN ROUTES */}
        <Route path="/category" element={<AdminRoute element={<CategoryPage/>}/>}/>
        <Route path="/supplier" element={<AdminRoute element={<SupplierPage/>}/>}/>
        <Route path="/add-supplier" element={<AdminRoute element={<AddEditSupplierPage/>}/>}/>
        <Route path="/edit-supplier/:supplierId" element={<AdminRoute element={<AddEditSupplierPage/>}/>}/>

        {/* PRODUCTS: list accessible to all authenticated users, management ADMIN-only */}
        <Route path="/product" element={<ProtectedRoute element={<ProductPage/>}/>}/>
        <Route path="/add-product" element={<AdminRoute element={<AddEditProductPage/>}/>}/>
        <Route path="/edit-product/:productId" element={<AdminRoute element={<AddEditProductPage/>}/>}/>

          {/* ADMIN AND MANAGERS ROUTES */}
        <Route path="/stock-in" element={<ProtectedRoute element={<StockInPage/>}/>}/>
        <Route path="/stock-out" element={<ProtectedRoute element={<StockOutPage/>}/>}/>
        <Route path="/transaction" element={<ProtectedRoute element={<TransactionsPage/>}/>}/>
        <Route path="/transaction/:transactionId" element={<ProtectedRoute element={<TransactionDetailsPage/>}/>}/>
        <Route path="/update-transaction/:transactionId" element={<ProtectedRoute element={<UpdateTransactionPage/>}/>}/>
        <Route path="/report" element={<ProtectedRoute element={<TransactionReportPage/>}/>}/>


        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage/>}/>}/>
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage/>}/>}/>



        <Route path="*" element={<LoginPage/>}/>


        

      </Routes>
    </Router>
  )
}

export default App;
