import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/authContext"; // ✅ AuthProvider 가져오기
import { Provider } from "react-redux"; // ✅ Redux Provider 추가
import store from "./redux/store"; // ✅ store 가져오기
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {" "}
    {/* ✅ Redux Provider 추가 */}
    <AuthProvider>
      {" "}
      {/* ✅ AuthProvider는 내부에 위치 */}
      <App />
    </AuthProvider>
  </Provider>
);
