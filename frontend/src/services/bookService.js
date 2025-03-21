export const getBooks = (
  query = "인기 도서",
  category = "all",
  sortBy = "popularity"
) => {
  // 검색 URL 구성
  let url = `http://localhost:5001/api/books/search?query=${encodeURIComponent(
    query
  )}`;

  // 카테고리가 "all"이 아니면 카테고리 파라미터 추가
  if (category !== "all") {
    url += `&category=${encodeURIComponent(category)}`;
  }

  // 정렬 기준이 있으면 sort 파라미터 추가
  if (sortBy) {
    url += `&sort=${encodeURIComponent(sortBy)}`;
  }

  console.log("📡 Fetching books from:", url);

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }
      return response.json(); // 응답 데이터를 JSON으로 파싱
    })
    .then((data) => {
      // 받아온 데이터에서 books 배열을 반환
      return data.books || []; // books 데이터가 없으면 빈 배열 반환
    })
    .catch((error) => {
      console.error("📌 도서 데이터 가져오기 오류:", error);
      return []; // 오류 발생 시 빈 배열 반환
    });
};
