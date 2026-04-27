import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { fetchMovies, fetchVideos } from '../api/tmdb';
import { useSelector, useDispatch } from 'react-redux';
import { setBookmarks } from '../store';
import API from '../api/axios';
import TrailerModal from '../components/TrailerModal';
import DetailsModal from '../components/DetailsModal';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const { items: bookmarks } = useSelector((state) => state.bookmarks);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, dispatch]);

  const handleToggleBookmark = async (item) => {
    if (!token) return alert('Please login to bookmark items');
    try {
      await API.post('/bookmarks/toggle', {
        tmdbId: item.id,
        title: item.title,
        type: 'movie',
        posterPath: item.poster_path,
        year: (item.release_date || '').split('-')[0],
        rating: 'PG'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { data } = await API.get('/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setBookmarks(data));

      if (data.some(b => b.tmdbId === item.id)) {
        toast.success(`${item.title} bookmarked!`);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const filteredMovies = movies.filter(m => 
    (m.title || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const [activeVideo, setActiveVideo] = useState(null);
  const [detailsState, setDetailsState] = useState(null);

  const handlePlay = async (item) => {
    try {
      const video = await fetchVideos(item.id, 'movie');
      if (video) setActiveVideo(video.key);
      else alert('Trailer not available');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetails = (id, type) => {
    setDetailsState({ id, type });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-8">
      <SearchBar 
        placeholder="Search for movies" 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />
      <section>
        <h2 className="text-xl md:text-3xl mb-8 font-light">
          {debouncedSearchQuery ? `Found ${filteredMovies.length} results for '${debouncedSearchQuery}'` : 'Movies'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10">
          {filteredMovies.map((item) => (
            <MovieCard 
              key={item.id} 
              item={{...item, media_type: 'movie'}} 
              isBookmarked={bookmarks.some(b => b.tmdbId === item.id)}
              onToggleBookmark={handleToggleBookmark}
              onPlay={handlePlay}
              onDetails={handleDetails}
            />
          ))}
        </div>
      </section>
      <TrailerModal videoKey={activeVideo} onClose={() => setActiveVideo(null)} />
      {detailsState && (
        <DetailsModal 
          id={detailsState.id} 
          type={detailsState.type} 
          onClose={() => setDetailsState(null)} 
        />
      )}
    </div>
  );
};

export default Movies;
