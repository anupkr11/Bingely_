import MovieCard from '../components/MovieCard';
import { useSelector, useDispatch } from 'react-redux';
import { setBookmarks } from '../store';
import API from '../api/axios';
import { fetchVideos } from '../api/tmdb';
import TrailerModal from '../components/TrailerModal';
import DetailsModal from '../components/DetailsModal';
import { useState } from 'react';
import SearchBar from '../components/SearchBar';

const Bookmarks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { items: bookmarks } = useSelector((state) => state.bookmarks);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleToggleBookmark = async (item) => {
    // For bookmarks, we use tmdbId as id if it comes from our DB
    const id = item.tmdbId || item.id;
    try {
      await API.post('/bookmarks/toggle', {
        tmdbId: id,
        title: item.title,
        type: item.type,
        posterPath: item.posterPath || item.poster_path,
        year: item.year,
        rating: item.rating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { data } = await API.get('/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setBookmarks(data));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter(b => 
    (b.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bookmarkedMovies = filteredBookmarks.filter(b => b.type === 'movie');
  const bookmarkedTV = filteredBookmarks.filter(b => b.type === 'tv');

  const [activeVideo, setActiveVideo] = useState(null);
  const [detailsState, setDetailsState] = useState(null);

  const handlePlay = async (item) => {
    try {
      const id = item.tmdbId || item.id;
      const video = await fetchVideos(id, item.type);
      if (video) setActiveVideo(video.key);
      else alert('Trailer not available');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetails = (id, type) => {
    setDetailsState({ id, type });
  };

  if (!token) return <div className="p-8 text-center text-2xl font-light">Please login to see your bookmarks</div>;

  return (
    <div className="flex flex-col gap-8">
      <SearchBar 
        placeholder="Search for bookmarked shows" 
        value={searchQuery} 
        onChange={setSearchQuery} 
      />
      
      {searchQuery ? (
        <section>
          <h2 className="text-xl md:text-3xl mb-8 font-light">Found {filteredBookmarks.length} results for '{searchQuery}'</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10">
            {filteredBookmarks.map((item) => (
              <MovieCard 
                key={item.tmdbId} 
                item={{...item, id: item.tmdbId, poster_path: item.posterPath, media_type: item.type}} 
                isBookmarked={true}
                onToggleBookmark={handleToggleBookmark}
                onPlay={handlePlay}
                onDetails={handleDetails}
              />
            ))}
          </div>
        </section>
      ) : (
        <>
          {bookmarkedMovies.length > 0 && (
            <section>
              <h2 className="text-xl md:text-3xl mb-8 font-light">Bookmarked Movies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10">
                {bookmarkedMovies.map((item) => (
                  <MovieCard 
                    key={item.tmdbId} 
                    item={{...item, id: item.tmdbId, poster_path: item.posterPath, media_type: 'movie'}} 
                    isBookmarked={true}
                    onToggleBookmark={handleToggleBookmark}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </section>
          )}

          {bookmarkedTV.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl md:text-3xl mb-8 font-light">Bookmarked TV Series</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-6 md:gap-y-10">
                {bookmarkedTV.map((item) => (
                  <MovieCard 
                    key={item.tmdbId} 
                    item={{...item, id: item.tmdbId, poster_path: item.posterPath, media_type: 'tv'}} 
                    isBookmarked={true}
                    onToggleBookmark={handleToggleBookmark}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </section>
          )}

          {bookmarks.length === 0 && (
            <div className="p-20 text-center text-pure-white/50 text-2xl font-light">
              You haven't bookmarked anything yet.
            </div>
          )}
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

export default Bookmarks;
