export const getBooks = (
  query = "인기 도서",
  category = "all",
  sortBy = "popularity"
) => {
  let url = `http://localhost:5001/api/books/search?query=${encodeURIComponent(
    query
  )}`;

  if (category !== "all") {
    url += `&category=${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    url += `&sort=${encodeURIComponent(sortBy)}`;
  }

  console.log("📡 Fetching books from:", url);

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }
      return response.json();
    })
    .then((data) => {
      console.log("📌 서버에서 반환된 데이터:", data); // 데이터를 콘솔에 확인
      return data.results || []; // 실제 API에서 반환하는 결과 배열로 설정
    })
    .catch((error) => {
      console.error("📌 도서 데이터 가져오기 오류:", error);
      return []; // 오류 발생 시 빈 배열 반환
    });
};
