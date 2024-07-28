import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '45154644-4c40c0e60dc4b86cfae510c5e';
const URL = 'https://pixabay.com/api/';
const HITSPERPAGE = 40;

const fetchImages = async (query, page = 1) => {
  try {
    const response = await axios.get(`${URL}`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: `${HITSPERPAGE}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
};

export { fetchImages, HITSPERPAGE };
