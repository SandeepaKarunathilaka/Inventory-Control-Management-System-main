import React, { useEffect, useState } from "react";
import ApiService from "../service/ApiService";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

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

  return (
    <div className="p-4">
      <h2>User Management</h2>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
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
              <td>{user.role}</td>
              <td>{user.createdAt}</td>

              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagementPage;