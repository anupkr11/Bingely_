import React, { useEffect, useState, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { fetchTrending, fetchMovies, fetchVideos } from '../api/tmdb';
import { useSelector, useDispatch } from 'react-redux';
import { setBookmarks } from '../store';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrailerModal from '../components/TrailerModal';
import DetailsModal from '../components/DetailsModal';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
        const trendingData = await fetchTrending();
        const recommendedData = await fetchMovies();
        setTrending(trendingData);
        setRecommended(recommendedData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, dispatch]);

  const handleToggleBookmark = async (item) => {
    if (!token) {
      alert('Please login to bookmark items');
      return;
    }

    try {
      const year = (item.release_date || item.first_air_date || '').split('-')[0];
      const type = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
      
      const { data } = await axios.post('http://localhost:5000/api/bookmarks/toggle', {
        tmdbId: item.id,
        title: item.title || item.name,
        type,
        posterPath: item.poster_path,
        year,
        rating: 'PG' 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh bookmarks
      const { data: updatedBookmarks } = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setBookmarks(updatedBookmarks));
      
      const isNowBookmarked = updatedBookmarks.some(b => b.tmdbId === item.id);
      if (isNowBookmarked) {
        toast.success(`${item.title || item.name} bookmarked! View in bookmarks tab.`);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const isBookmarked = (id) => bookmarks.some((b) => b.tmdbId === id);

  const trendingRef = useRef(null);

  const scroll = (direction) => {
    if (trendingRef.current) {
      const { scrollLeft, clientWidth } = trendingRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      trendingRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const [activeVideo, setActiveVideo] = useState(null);
  const [detailsState, setDetailsState] = useState(null);

  const handlePlay = async (item) => {
    try {
      const type = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
      const video = await fetchVideos(item.id, type);
      if (video) {
        setActiveVideo(video.key);
      } else {
        alert('Trailer not available for this item');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const handleDetails = (id, type) => {
    setDetailsState({ id, type });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-8">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {debouncedSearchQuery ? (
        <section>
          {(() => {
            const results = (recommended.concat(trending)).filter(item => 
              (item.title || item.name || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
            return (
              <>
                <h2 className="text-xl md:text-3xl mb-8">Found {results.length} results for '{debouncedSearchQuery}'</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10">
                  {results.map((item) => (
                    <MovieCard 
                      key={item.id} 
                      item={item} 
                      isBookmarked={isBookmarked(item.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onPlay={handlePlay}
                      onDetails={handleDetails}
                    />
                  ))}
                </div>
              </>
            );
          })()}
        </section>
      ) : (
        <>
          <section className="relative group">
            <h2 className="text-xl md:text-3xl mb-6 font-light">Trending</h2>
            
            <div className="relative">
              {/* Left Scroll Button */}
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-dark-blue/60 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center border border-pure-white/10 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div 
                ref={trendingRef}
                className="flex overflow-x-auto gap-4 md:gap-10 no-scrollbar pb-4 scroll-smooth"
              >
                {trending.map((item) => (
                  <MovieCard 
                    key={item.id} 
                    item={item} 
                    isTrending={true}
                    isBookmarked={isBookmarked(item.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                ))}
              </div>

              {/* Right Scroll Button */}
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-dark-blue/60 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center border border-pure-white/10 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-3xl mb-8 font-light">Recommended for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10">
              {recommended.map((item) => (
                <MovieCard 
                  key={item.id} 
                  item={item} 
                  isBookmarked={isBookmarked(item.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onPlay={handlePlay}
                  onDetails={handleDetails}
                />
              ))}
            </div>
          </section>
        </>
      )}
      
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

export default Home;
