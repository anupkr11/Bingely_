import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { fetchTVSeries, fetchVideos } from '../api/tmdb';
import { useSelector, useDispatch } from 'react-redux';
import { setBookmarks } from '../store';
import axios from 'axios';
import TrailerModal from '../components/TrailerModal';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

const TVSeries = () => {
  const [tvSeries, setTvSeries] = useState([]);
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
        const data = await fetchTVSeries();
        setTvSeries(data);
        if (token && bookmarks.length === 0) {
          const { data: bData } = await axios.get('http://localhost:5000/api/bookmarks', {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(setBookmarks(bData));
        }
      } catch (error) {
        console.error('Error loading TV series:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, dispatch]);

  const handleToggleBookmark = async (item) => {
    if (!token) return alert('Please login to bookmark items');
    try {
      await axios.post('http://localhost:5000/api/bookmarks/toggle', {
        tmdbId: item.id,
        title: item.name,
        type: 'tv',
        posterPath: item.poster_path,
        year: (item.first_air_date || '').split('-')[0],
        rating: 'PG'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { data } = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setBookmarks(data));

      if (data.some(b => b.tmdbId === item.id)) {
        toast.success(`${item.name} bookmarked!`);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const filteredTV = tvSeries.filter(t => 
    (t.name || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const [activeVideo, setActiveVideo] = useState(null);

  const handlePlay = async (item) => {
    try {
      const video = await fetchVideos(item.id, 'tv');
      if (video) setActiveVideo(video.key);
      else alert('Trailer not available');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-8">
      <SearchBar 
        placeholder="Search for TV series" 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />
      <section>
        <h2 className="text-xl md:text-3xl mb-8 font-light">
          {debouncedSearchQuery ? `Found ${filteredTV.length} results for '${debouncedSearchQuery}'` : 'TV Series'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10">
          {filteredTV.map((item) => (
            <MovieCard 
              key={item.id} 
              item={{...item, media_type: 'tv'}} 
              isBookmarked={bookmarks.some(b => b.tmdbId === item.id)}
              onToggleBookmark={handleToggleBookmark}
              onPlay={handlePlay}
            />
          ))}
        </div>
      </section>
      <TrailerModal videoKey={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
};

export default TVSeries;
