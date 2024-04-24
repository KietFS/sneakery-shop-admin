import RootApp from "./routes/RootApp";
import store from "./redux";
import { Provider } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { setAuth, setUser } from "./redux/slices/auth";

import "../src/utils/prototype";

export default function App() {
  React.useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("admin") as string);
    if (userInfo) {
      store.dispatch(setUser(userInfo));
      store.dispatch(setAuth(true));
    }
  }, []);
  return (
    <Provider store={store}>
      <ToastContainer />
      <div>
        <RootApp />
      </div>
    </Provider>
  );
}
