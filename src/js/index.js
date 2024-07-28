import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fetchImages, HITSPERPAGE } from './pixabay-api';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;

const lightbox = new SimpleLightbox('.gallery a');


const onFormSubmit = e => {
  e.preventDefault();
  loadMoreBtn.classList.add("hidden");
  query = e.currentTarget.elements.searchQuery.value;
  console.log(query);
  onSearch(query);
};

const onSearch = async query => {
  
  const images = await fetchImages(query);
  populateGallery(images.hits);
  if (images.hits.length > 0) {
    loadMoreBtn.classList.remove("hidden");
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  } else {
    Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
  }

  if (images.totalHits < HITSPERPAGE) {
    loadMoreBtn.classList.add("hidden");
    Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
  }
};

const onLoadMore = async () => {
  page++;
  const currentHitsLoaded = HITSPERPAGE * page;
  const images = await fetchImages(query, page);
  populateGallery(images.hits);
  
  if (images.totalHits < currentHitsLoaded) {
    loadMoreBtn.classList.add("hidden");
    Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
  }
};

const populateGallery = images => {
  const markup = images.map(
    image => `
    <div class="photo-card">
        <a href="${image.webformatURL}" target="_blank">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="300"/>
        </a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                <span>${image.likes}</span>
            </p>
            <p class="info-item">
                <b>Views</b>
                <span>${image.views}</span>
            </p>
            <p class="info-item">
                <b>Comments</b>
                <span>${image.comments}</span>
            </p>
            <p class="info-item">
                <b>Downloads</b>
                <span>${image.downloads}</span>
            </p>
        </div>
    </div>`
  )
  .join("");
  gallery.innerHTML = markup;
  lightbox.refresh();
};

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

