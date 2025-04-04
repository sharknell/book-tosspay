import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5001/api/books";

// 📌 도서 상세 정보 가져오기 (비동기 처리)
export const fetchBookDetail = createAsyncThunk(
  "book/fetchBookDetail",
  async (isbn) => {
    const response = await fetch(`${API_URL}/books/${isbn}`);
    if (!response.ok) throw new Error("책 정보를 불러올 수 없습니다.");
    return await response.json();
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState: { book: null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookDetail.fulfilled, (state, action) => {
        state.book = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookDetail.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default bookSlice.reducer;
