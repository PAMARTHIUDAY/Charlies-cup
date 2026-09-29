import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Coupons from './pages/Coupons';
import Layout from './components/Layout';

const Private = ({ children }) => {
  const token = localStorage.getItem('cc_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Private><Layout /></Private>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="coupons" element={<Coupons />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
