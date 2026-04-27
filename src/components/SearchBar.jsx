import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="flex items-center gap-4 md:gap-6 px-0">
      <Search className="text-pure-white w-6 h-6 md:w-8 md:h-8" />
      <input
        type="text"
        placeholder={placeholder || 'Search for movies or TV series'}
        className="search-input text-lg md:text-2xl font-light"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
