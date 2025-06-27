import { useState } from 'react';
import PokemonSearch from './components/PokemonSearch';
import PokemonCard from './components/PokemonCard';
import { PokemonApiService } from './services/pokemonApi';
import type { PokemonData } from './types/pokemon';
import './App.css';

function App() {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (name: string) => {
    if (!name.trim()) {
      setError('Por favor ingresa un nombre de Pokémon');
      return;
    }

    setLoading(true);
    setError(null);
    setPokemonData(null);

    try {
      const data = await PokemonApiService.getPokemonData(name);
      setPokemonData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al buscar el Pokémon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokédex</h1>
        <p>Busca información de cualquier Pokémon</p>
      </header>

      <main className="app-main">
        <PokemonSearch onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Buscando Pokémon...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-message">
              <h3>¡Oops!</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {pokemonData && !loading && !error && (
          <PokemonCard pokemonData={pokemonData} />
        )}

        {!pokemonData && !loading && !error && (
          <div className="welcome-message">
            <h2>¡Bienvenido a la Pokédex!</h2>
            <p>Busca cualquier Pokémon por su nombre para ver su información completa.</p>
            <div className="search-suggestions">
              <p>Prueba buscando: <strong>pikachu</strong>, <strong>charizard</strong>, <strong>blastoise</strong></p>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Datos proporcionados por <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a></p>
      </footer>
    </div>
  );
}

export default App;
