import React from 'react';
import { Bookmark, Play, Film, Tv } from 'lucide-react';
import { getImageUrl } from '../api/tmdb';

const MovieCard = ({ item, isBookmarked, onToggleBookmark, onPlay, onDetails, isTrending = false }) => {
  const title = item.title || item.name || item.original_title || item.original_name;
  const year = (item.release_date || item.first_air_date || '').split('-')[0];
  const type = item.media_type === 'tv' || item.first_air_date ? 'TV Series' : 'Movie';
  const typeKey = item.media_type || (item.first_air_date ? 'tv' : 'movie');

  // Use backdrop for both for a more cinematic grid look as per the design screenshots
  const imagePath = item.backdrop_path || item.poster_path;

  const handleTitleClick = (e) => {
    e.stopPropagation();
    if (onDetails) onDetails(item.id, typeKey);
  };

  return (
    <div className={`group relative ${isTrending ? 'min-w-[280px] md:min-w-[470px] h-[140px] md:h-[230px]' : 'w-full'}`}>
      <div 
        className={`card-container ${isTrending ? 'h-full' : 'aspect-video'}`}
        onClick={() => onPlay && onPlay(item)}
      >
        <img
          src={getImageUrl(imagePath, isTrending ? 'w780' : 'w500')}
          alt={title}
          className="w-full h-full object-cover group-hover:opacity-50 transition-opacity duration-300"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4 bg-pure-white/25 rounded-full px-4 py-2 backdrop-blur-sm cursor-pointer hover:bg-pure-white/40 transition-colors">
            <Play className="fill-pure-white" size={24} />
            <span className="font-medium">Play</span>
          </div>
        </div>

        {/* Bookmark Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(item);
          }}
          className={`bookmark-btn ${isBookmarked ? 'text-pure-white fill-pure-white' : 'text-pure-white'}`}
        >
          <Bookmark size={16} className={isBookmarked ? 'fill-pure-white' : ''} />
        </button>

        {/* Trending Info Overlay */}
        {isTrending && (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
             <div className="flex items-center gap-2 text-[10px] md:text-sm text-pure-white/75 mb-1">
              <span>{year}</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                {type === 'Movie' ? <Film size={12} className="md:w-[14px] md:h-[14px]" /> : <Tv size={12} className="md:w-[14px] md:h-[14px]" />}
                <span>{type}</span>
              </div>
              <span>•</span>
              <span>PG</span>
            </div>
            <h3 
              className="text-lg md:text-2xl font-medium truncate cursor-pointer hover:underline decoration-primary underline-offset-4"
              onClick={handleTitleClick}
            >
              {title}
            </h3>
          </div>
        )}
      </div>

      {!isTrending && (
        <div className="mt-2">
          <div className="flex items-center gap-2 text-xs text-pure-white/75 mb-1">
            <span>{year}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              {type === 'Movie' ? <Film size={12} /> : <Tv size={12} />}
              <span>{type}</span>
            </div>
            <span>•</span>
            <span>PG</span>
          </div>
          <h3 
            className="text-lg font-medium truncate cursor-pointer hover:underline decoration-primary underline-offset-4"
            onClick={handleTitleClick}
          >
            {title}
          </h3>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
