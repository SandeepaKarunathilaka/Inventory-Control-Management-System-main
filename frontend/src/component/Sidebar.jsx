import React from "react";
import { Link } from "react-router-dom";
import ApiService from "../service/ApiService";
import logo from "../logo.png";

const logout = () => {
  ApiService.logout();
};

const Sidebar = () => {
  const isAuth = ApiService.isAuthenticated();

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <img className="sidebar-logo" src={logo} alt="StockSmart logo" />
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">StockSmart</div>
          <div className="sidebar-brand-sub">Inventory System</div>
        </div>
      </div>
      <ul className="nav-links">
        {isAuth && (
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/transaction">Transactions</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/category">Category</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/product">Product</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/supplier">Supplier</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/stock-in">Stock-in</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/stock-out">Stock-out</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/transaction-report">Transaction report</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/warehouse">Warehouse</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/stock-locations">Stock Locations</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link onClick={logout} to="/login">
              Logout
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
