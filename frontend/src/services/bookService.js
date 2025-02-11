// 카카오 API에서 도서 정보를 가져오는 함수
export const getBooks = (query) => {
  return fetch(`http://localhost:5001/api/books?query=${query}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      throw error;
    });
};
