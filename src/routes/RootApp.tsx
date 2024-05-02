import { Redirect, Route } from "react-router-dom";
import UserManagement from "../pages/UserManagement";
import DashBoard from "../pages/DashBoard";
import ProductManagement from "../pages/ProductManagement";
import LoginPage from "../pages/Auth/Login";
import { useAppSelector } from "../hooks/useRedux";
import { IRootState } from "../redux";
import OrderManagement from "../pages/OrderManagement";
import BidManagement from "../pages/BidManagement";
import CategoryMangement from "../pages/CategoryManagement";

export default function RootApp() {
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const isExited = localStorage.getItem("admin");

  return (
    <div>
      <Route
        path="/"
        render={() => {
          return user === null && !isExited ? (
            <Redirect to="/login" />
          ) : (
            <Redirect to="/home" />
          );
        }}
      ></Route>
      <Route path="/home">
        <DashBoard />
      </Route>
      <Route path="/user-management">
        <UserManagement />
      </Route>
      <Route path="/products-management">
        <ProductManagement />
      </Route>
      <Route path="/orders-management">
        <OrderManagement />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
    </div>
  );
}
