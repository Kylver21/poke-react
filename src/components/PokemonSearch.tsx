import React, { useState } from 'react';

interface PokemonSearchProps {
  onSearch: (name: string) => void;
  loading: boolean;
}

const PokemonSearch: React.FC<PokemonSearchProps> = ({ onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    
    if (trimmedSearch) {
      onSearch(trimmedSearch);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Buscar Pokémon por nombre..."
            className="search-input"
            disabled={loading}
            aria-label="Buscar Pokémon"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !searchTerm.trim()}
            aria-label="Buscar"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PokemonSearch;