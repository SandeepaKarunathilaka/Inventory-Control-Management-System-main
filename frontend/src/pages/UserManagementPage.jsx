import React, { useEffect, useState } from "react";
import ApiService from "../service/ApiService";

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
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>User Management</h1>

      {message && (
        <p
          style={{
            backgroundColor: "#d4edda",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          {message}
        </p>
      )}

      {/* CREATE USER FORM */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Create User</h2>

        <form onSubmit={handleCreateUser}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button style={createButtonStyle} type="submit">
            Create User
          </button>
        </form>
      </div>

      {/* USER TABLE */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Phone</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Created At</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tableCellStyle}>{user.id}</td>
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>{user.phoneNumber}</td>

                <td style={tableCellStyle}>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                    style={{
                      padding: "8px",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </td>

                <td style={tableCellStyle}>{user.createdAt}</td>

                <td style={tableCellStyle}>
                  <button
                    onClick={() => handleUpdateRole(user)}
                    style={updateButtonStyle}
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    style={deleteButtonStyle}
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
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const createButtonStyle = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const updateButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
};

const deleteButtonStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const tableHeaderStyle = {
  padding: "12px",
  textAlign: "left",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

export default UserManagementPage;