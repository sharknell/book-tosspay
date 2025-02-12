// 카카오 API에서 도서 정보를 가져오는 함수
export const getBooks = (
  query = "",
  category = "all",
  sortBy = "popularity"
) => {
  // query가 없을 때도 데이터를 반환할 수 있도록 기본 값 설정
  let url = `http://localhost:5001/api/books?category=${category}&sort=${sortBy}`;
  console.log(url);
  // query가 비어있지 않으면 추가
  if (query) {
    url += `&query=${query}`;
  }

  return fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      throw error;
    });
};
