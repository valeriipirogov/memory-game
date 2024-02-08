const CATS_API_URL = "https://api.thecatapi.com/v1/images/search";

export const fetchCatsImages = (count: number, page: number = 0) => {
  return fetch(`${CATS_API_URL}?limit=${count <= 0 ? 1 : count}&page=${page}`)
    .then((ressponse) => {
      if (ressponse.status >= 200 && ressponse.status < 300) {
        return ressponse.json();
      } else {
        return ressponse.json().then((errData) => {
          throw new Error(errData);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      throw new Error("Something went wrong!");
    });
};
