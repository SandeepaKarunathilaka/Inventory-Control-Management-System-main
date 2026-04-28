import React from "react";
import { Link } from "react-router-dom";
import ApiService from "../service/ApiService";

const logout = () => {
  ApiService.logout();
};

const Sidebar = () => {
  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  return (
    <div className="sidebar">
      <h1 className="ims">IMS</h1>
      <ul className="nav-links">
        {isAuth && (
          <li>
            <Link to="/dashboard">Dashboaard</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/transaction">Transactions</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/report">Reports</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/category">Category</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/product">Product</Link>
          </li>
        )}

        {isAdmin && (
          <li>
            <Link to="/supplier">Supplier</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/stock-in">Stock-In</Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link to="/stock-out">Stock-Out</Link>
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
