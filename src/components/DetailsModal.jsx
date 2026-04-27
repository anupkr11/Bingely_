import React, { useEffect, useState } from 'react';
import { X, Star, Link as LinkIcon } from 'lucide-react';
import { fetchDetails, getImageUrl } from '../api/tmdb';

const DetailsModal = ({ id, type, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await fetchDetails(id, type);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadDetails();
  }, [id, type]);

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-dark-blue w-full max-w-[1200px] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 text-pure-white hover:text-primary transition-colors bg-dark-blue/50 p-2 rounded-full backdrop-blur-md"
        >
          <X size={32} />
        </button>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Poster Section */}
            <div className="w-full md:w-[400px] h-[400px] md:h-auto flex-shrink-0">
              <img
                src={getImageUrl(details.poster_path, 'w780')}
                alt={details.title || details.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 md:p-12 flex flex-col gap-8 overflow-y-auto max-h-[80vh] md:max-h-none">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-light text-pure-white">
                  {details.title || details.name}
                </h2>
                {details.tagline && (
                  <p className="text-xl text-grey-blue font-light italic">
                    {details.tagline}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-medium text-pure-white">
                  {details.vote_average?.toFixed(1)}
                </div>
                <div className="flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < Math.round(details.vote_average / 2) ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-grey-blue text-sm mb-1 uppercase tracking-widest">Language</h4>
                  <p className="text-pure-white text-lg">
                    {details.spoken_languages?.[0]?.english_name || 'English'}
                  </p>
                </div>
                <div>
                  <h4 className="text-grey-blue text-sm mb-1 uppercase tracking-widest">
                    {type === 'movie' ? 'Length' : 'First Air'}
                  </h4>
                  <p className="text-pure-white text-lg">
                    {type === 'movie' ? `${details.runtime} min.` : details.first_air_date}
                  </p>
                </div>
                <div>
                  <h4 className="text-grey-blue text-sm mb-1 uppercase tracking-widest">
                    {type === 'movie' ? 'Release' : 'Last Air'}
                  </h4>
                  <p className="text-pure-white text-lg">
                    {type === 'movie' ? details.release_date : details.last_air_date}
                  </p>
                </div>
                <div>
                  <h4 className="text-grey-blue text-sm mb-1 uppercase tracking-widest">Status</h4>
                  <p className="text-pure-white text-lg">{details.status}</p>
                </div>
              </div>

              <div>
                <h4 className="text-grey-blue text-sm mb-3 uppercase tracking-widest">Genres</h4>
                <div className="flex flex-wrap gap-3">
                  {details.genres?.map(genre => (
                    <span key={genre.id} className="px-4 py-1 rounded-full border border-pure-white text-pure-white text-sm bg-pure-white/5">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-grey-blue text-sm mb-3 uppercase tracking-widest">Synopsis</h4>
                <p className="text-pure-white/80 leading-relaxed text-lg">
                  {details.overview}
                </p>
              </div>

              <div>
                <h4 className="text-grey-blue text-sm mb-3 uppercase tracking-widest">Casts</h4>
                <div className="flex flex-wrap gap-3">
                  {details.credits?.cast?.slice(0, 5).map(person => (
                    <span key={person.id} className="px-4 py-1 rounded-full border border-grey-blue text-pure-white text-sm hover:border-primary transition-colors cursor-default">
                      {person.name}
                    </span>
                  ))}
                </div>
              </div>

              {details.homepage && (
                <div className="pt-4">
                  <a 
                    href={details.homepage} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-grey-blue/20 hover:bg-grey-blue/40 text-pure-white px-8 py-3 rounded-xl transition-all font-medium border border-grey-blue/30"
                  >
                    <span>Website</span>
                    <LinkIcon size={20} />
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsModal;
