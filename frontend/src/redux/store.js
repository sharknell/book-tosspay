import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slices/bookSlice";
import bookmarkReducer from "./slices/bookmarkSlice";
import rentalReducer from "./slices/rentalSlice";
import authReducer from "./slices/authSlice"; // ✅ authSlice 추가

const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ auth 상태 관리
    book: bookReducer, // ✅ 책 관련 상태
    bookmark: bookmarkReducer, // ✅ 북마크 관련 상태
    rental: rentalReducer, // ✅ 대여 관련 상태
  },
});

export default store;
