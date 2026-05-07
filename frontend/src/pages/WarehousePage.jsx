import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import "./WarehousePage.css";

const WarehousePage = () => {

  const [warehouseList, setWarehouseList] = useState([]);
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [managerName, setManagerName] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = ApiService.isAdmin();

  useEffect(() => {

    const loadData = async () => {

      await fetchWarehouses();

      if (isAdmin) {
        await fetchUsers();
      }
    };

    loadData();

    // eslint-disable-next-line

  }, [isAdmin]);

  const showMessage = (msg) => {

    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const showError = (msg) => {

    setError(msg);

    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const fetchWarehouses = async () => {

    try {

      const response =
        await ApiService.getAllWarehouses();

      console.log(
        "Warehouse Response:",
        response
      );

      setWarehouseList(
        response.warehouseList ||
        response ||
        []
      );

    } catch (error) {

      console.log(error);

      showError(
        "Failed to load warehouses"
      );
    }
  };

  const fetchUsers = async () => {

    try {

      const response =
        await ApiService.getAllUsers();

      console.log(
        "Users Response:",
        response
      );

      setUsers(
        response.userList ||
        response.users ||
        []
      );

    } catch (error) {

      console.log(error);

      showError(
        "Failed to load users"
      );
    }
  };

  const managers = users.filter(
    (user) =>
      user.role &&
      user.role.toUpperCase() ===
        "MANAGER"
  );

  const clearFields = () => {

    setName("");
    setCode("");
    setAddress("");
    setCity("");
    setManagerName("");
  };

  const handleCreateWarehouse =
    async (e) => {

      e.preventDefault();

      if (
        !name ||
        !code ||
        !address ||
        !city ||
        !managerName
      ) {

        showError(
          "Please fill all fields"
        );

        return;
      }

      try {

        const warehouseData = {
          warehouseName: name,
          warehouseCode: code,
          address,
          city,
          managerName,
        };

        await ApiService.addWarehouse(
          warehouseData
        );

        showMessage(
          "Warehouse created successfully"
        );

        clearFields();

        fetchWarehouses();

      } catch (error) {

        console.log(error);

        showError(
          error.response?.data?.message ||
            "Failed to create warehouse"
        );
      }
    };

  const handleDeleteWarehouse =
    async (warehouseId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this warehouse?"
        );

      if (!confirmDelete) return;

      try {

        await ApiService.deleteWarehouse(
          warehouseId
        );

        showMessage(
          "Warehouse deleted successfully"
        );

        fetchWarehouses();

      } catch (error) {

        console.log(error);

        showError(
          error.response?.data?.message ||
            "Failed to delete warehouse"
        );
      }
    };

  return (

    <Layout>

      <div className="warehouse-page">

        <h1 className="warehouse-title">
          Warehouse Management
        </h1>

        {message && (
          <div className="warehouse-success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="warehouse-error-message">
            {error}
          </div>
        )}

        {/* ADMIN ONLY FORM */}
        {isAdmin && (

          <div className="warehouse-form-card">

            <h2 className="warehouse-form-title">
              Create Warehouse
            </h2>

            <form
              className="warehouse-form"
              onSubmit={
                handleCreateWarehouse
              }
            >

              <div className="warehouse-grid">

                <input
                  type="text"
                  placeholder="Warehouse Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Warehouse Code"
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value
                    )
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  required
                />

                {/* MANAGER DROPDOWN */}
                <select
                  className="warehouse-select"
                  value={managerName}
                  onChange={(e) =>
                    setManagerName(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select Manager
                  </option>

                  {managers.map(
                    (manager) => (
                      <option
                        key={manager.id}
                        value={
                          manager.name
                        }
                      >
                        {manager.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              <button
                type="submit"
                className="warehouse-create-btn"
              >
                Create Warehouse
              </button>

            </form>

          </div>
        )}

        {/* TABLE */}
        <div className="warehouse-table-card">

          <table className="warehouse-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>Address</th>
                <th>City</th>
                <th>Manager</th>

                {isAdmin && (
                  <th>Actions</th>
                )}

              </tr>

            </thead>

            <tbody>

              {warehouseList.length > 0 ? (

                warehouseList.map(
                  (warehouse) => (

                    <tr
                      key={warehouse.id}
                    >

                      <td>
                        {warehouse.id}
                      </td>

                      <td>
                        {
                          warehouse.warehouseName
                        }
                      </td>

                      <td>
                        {
                          warehouse.warehouseCode
                        }
                      </td>

                      <td>
                        {
                          warehouse.address
                        }
                      </td>

                      <td>
                        {warehouse.city}
                      </td>

                      <td>
                        {
                          warehouse.managerName
                        }
                      </td>

                      {isAdmin && (

                        <td>

                          <button
                            className="warehouse-delete-btn"
                            onClick={() =>
                              handleDeleteWarehouse(
                                warehouse.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>
                      )}

                    </tr>
                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={
                      isAdmin
                        ? 7
                        : 6
                    }
                    className="no-data"
                  >
                    No Warehouses Found
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
};

export default WarehousePage;