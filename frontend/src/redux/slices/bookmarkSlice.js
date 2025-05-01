import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5001/api/books/bookmarks";

// 📌 북마크 상태 가져오기
export const fetchBookmarkStatus = createAsyncThunk(
  "bookmark/fetchStatus",
  async ({ userId, id }) => {
    const response = await fetch(`${API_URL}/${userId}/${id}`);
    const data = await response.json();
    return data.isBookmarked;
  }
);

// 📌 북마크 추가/삭제
export const toggleBookmark = createAsyncThunk(
  "bookmark/toggle",
  async ({ userId, id, isBookmarked }) => {
    await fetch(API_URL, {
      method: isBookmarked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, id }),
    });
    return !isBookmarked;
  }
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: { isBookmarked: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarkStatus.fulfilled, (state, action) => {
        state.isBookmarked = action.payload;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        state.isBookmarked = action.payload;
      });
  },
});

export default bookmarkSlice.reducer;
