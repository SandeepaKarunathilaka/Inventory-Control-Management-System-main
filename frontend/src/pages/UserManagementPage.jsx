import React, { useEffect, useState } from "react";
import ApiService from "../service/ApiService";
import Layout from "../component/Layout";
import "../styles/UserManagementPage.css";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.log(error);
      setMessage("Failed to load users");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        name,
        email,
        password,
        phoneNumber,
      };

      await ApiService.registerUser(userData);

      setMessage("User created successfully");

      setName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");

      fetchUsers();
    } catch (error) {
      console.log(error);
      setMessage("Failed to create user");
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await ApiService.deleteUser(userId);
      setMessage("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
      setMessage("Failed to delete user");
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleUpdateRole = async (user) => {
    try {
      await ApiService.updateUser(user.id, {
        ...user,
        role: user.role,
      });

      setMessage("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
      setMessage("Failed to update role");
    }
  };

  return (
    <Layout>
      <div className="user-management-container">
        <h1 className="user-management-title">User Management</h1>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* CREATE USER */}
        <div className="glass-card">
          <h2 className="section-title">Create User</h2>

          <form onSubmit={handleCreateUser} autoComplete="off">
            <div className="user-form-grid">
              <input
                type="text"
                name="fullName"
                autoComplete="off"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="user-input"
              />

              <input
                type="email"
                name="emailAddress"
                autoComplete="new-email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="user-input"
              />

              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="user-input"
              />

              <input
                type="text"
                name="phoneNumber"
                autoComplete="off"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="user-input"
              />
            </div>

            <button className="primary-btn" type="submit">
              Create User
            </button>
          </form>
        </div>

        {/* USERS TABLE */}
        <div className="glass-card">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>

                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="role-select"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                    </select>
                  </td>

                  <td>{user.createdAt}</td>

                  <td>
                    <button
                      onClick={() => handleUpdateRole(user)}
                      className="update-btn"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default UserManagementPage;