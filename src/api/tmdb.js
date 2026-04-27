import axios from 'axios';

const API_KEY = 'cce1e025729f0d21f375af85f85777c4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const fetchTrending = async () => {
  const { data } = await tmdb.get('/trending/all/day');
  return data.results;
};

export const fetchMovies = async () => {
  const { data } = await tmdb.get('/discover/movie');
  return data.results;
};

export const fetchTVSeries = async () => {
  const { data } = await tmdb.get('/discover/tv');
  return data.results;
};

export const searchContent = async (query) => {
  const { data } = await tmdb.get('/search/multi', {
    params: { query },
  });
  return data.results;
};

export const fetchVideos = async (id, type) => {
  const { data } = await tmdb.get(`/${type}/${id}/videos`);
  // Return the first YouTube trailer or teaser
  return data.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
};

export const fetchDetails = async (id, type) => {
  const { data } = await tmdb.get(`/${type}/${id}`, {
    params: { append_to_response: 'credits' }
  });
  return data;
};

export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default tmdb;
