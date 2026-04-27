import React from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ videoKey, onClose }) => {
  if (!videoKey) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-pure-white hover:text-primary transition-colors"
      >
        <X size={40} />
      </button>
      
      <div className="w-full max-w-[1000px] aspect-video rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;
