import axios from 'axios';

// TMDB API Configuration Constants
const API_KEY = 'cce1e025729f0d21f375af85f85777c4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Custom Axios Instance for TMDB
 * Automatically appends the required API key to every request
 */
const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

/**
 * Fetch daily trending movies and TV series
 * @returns {Promise<Array>} Array of trending media objects
 */
export const fetchTrending = async () => {
  const { data } = await tmdb.get('/trending/all/day');
  return data.results;
};

/**
 * Fetch a list of movies for the Movies page
 * @returns {Promise<Array>} Array of movie objects
 */
export const fetchMovies = async () => {
  const { data } = await tmdb.get('/discover/movie');
  return data.results;
};

/**
 * Fetch a list of TV series for the TV Series page
 * @returns {Promise<Array>} Array of TV series objects
 */
export const fetchTVSeries = async () => {
  const { data } = await tmdb.get('/discover/tv');
  return data.results;
};

/**
 * Search across both movies and TV series by query string
 * @param {string} query - The search term
 * @returns {Promise<Array>} Array of matching media objects
 */
export const searchContent = async (query) => {
  const { data } = await tmdb.get('/search/multi', {
    params: { query },
  });
  return data.results;
};

/**
 * Fetch video clips (trailers/teasers) for a specific media item
 * @param {string|number} id - TMDB media ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Object>} The first YouTube trailer/teaser object, or undefined
 */
export const fetchVideos = async (id, type) => {
  const { data } = await tmdb.get(`/${type}/${id}/videos`);
  // Filter and return the first YouTube trailer or teaser
  return data.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
};

/**
 * Fetch comprehensive details for a specific media item, including cast credits
 * @param {string|number} id - TMDB media ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Object>} Detailed media object
 */
export const fetchDetails = async (id, type) => {
  const { data } = await tmdb.get(`/${type}/${id}`, {
    params: { append_to_response: 'credits' }
  });
  return data;
};

/**
 * Construct the full URL for a TMDB image path
 * @param {string} path - The relative image path from TMDB
 * @param {string} [size='original'] - The desired image resolution size
 * @returns {string|null} Full image URL, or null if no path provided
 */
export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default tmdb;
