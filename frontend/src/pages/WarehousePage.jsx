import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import "./WarehousePage.css";

const WarehousePage = () => {

  const [warehouses, setWarehouses] = useState([]);

  const [warehouseData, setWarehouseData] = useState({
    warehouseName: "",
    warehouseCode: "",
    address: "",
    city: "",
    managerName: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {

    try {

      const data = await ApiService.getAllWarehouses();

      setWarehouses(data);

    } catch (error) {

      console.log(error);
    }
  };

  const showMessage = (msg) => {

    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleChange = (e) => {

    setWarehouseData({
      ...warehouseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddWarehouse = async (e) => {

    e.preventDefault();

    try {

      await ApiService.addWarehouse(warehouseData);

      showMessage("Warehouse created successfully");

      setWarehouseData({
        warehouseName: "",
        warehouseCode: "",
        address: "",
        city: "",
        managerName: "",
      });

      fetchWarehouses();

    } catch (error) {

      console.log(error);
    }
  };

  const handleDeleteWarehouse = async (id) => {

    try {

      await ApiService.deleteWarehouse(id);

      showMessage("Warehouse deleted successfully");

      fetchWarehouses();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <Layout>

      <div className="warehouse-page">

        <h1 className="warehouse-title">
          Warehouse Management
        </h1>

        {message && (
          <div className="warehouse-message">
            {message}
          </div>
        )}

        <div className="warehouse-card">

          <h2>Create Warehouse</h2>

          <form
            className="warehouse-form"
            onSubmit={handleAddWarehouse}
          >

            <input
              type="text"
              name="warehouseName"
              placeholder="Warehouse Name"
              value={warehouseData.warehouseName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="warehouseCode"
              placeholder="Warehouse Code"
              value={warehouseData.warehouseCode}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={warehouseData.address}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={warehouseData.city}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="managerName"
              placeholder="Manager Name"
              value={warehouseData.managerName}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Create Warehouse
            </button>

          </form>
        </div>

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
              <th>Actions</th>
            </tr>

            </thead>

            <tbody>

            {warehouses.map((warehouse) => (

              <tr key={warehouse.id}>

                <td>{warehouse.id}</td>

                <td>{warehouse.warehouseName}</td>

                <td>{warehouse.warehouseCode}</td>

                <td>{warehouse.address}</td>

                <td>{warehouse.city}</td>

                <td>{warehouse.managerName}</td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteWarehouse(warehouse.id)
                    }
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
};

export default WarehousePage;