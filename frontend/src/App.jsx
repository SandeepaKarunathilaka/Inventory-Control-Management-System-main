import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import CategoryManagement from "./pages/CategoryManagement";
import CategoryProducts from "./pages/CategoryProducts";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/categories" element={<CategoryManagement />} />
        <Route path="/categories/:id/products" element={<CategoryProducts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
