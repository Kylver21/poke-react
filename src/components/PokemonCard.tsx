import React from 'react';
import type { PokemonData } from '../types/pokemon';
import { TYPE_TRANSLATIONS, STAT_TRANSLATIONS } from '../types/pokemon';
import { PokemonApiService } from '../services/pokemonApi';

interface PokemonCardProps {
  pokemonData: PokemonData;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonData }) => {
  const { pokemon, species } = pokemonData;
  
  const getTypeTranslation = (type: string): string => {
    return TYPE_TRANSLATIONS[type] || type;
  };

  const getStatTranslation = (stat: string): string => {
    return STAT_TRANSLATIONS[stat] || stat;
  };

  const getTypeColorClass = (type: string): string => {
    const colorMap: Record<string, string> = {
      normal: 'type-normal',
      fire: 'type-fire',
      water: 'type-water',
      electric: 'type-electric',
      grass: 'type-grass',
      ice: 'type-ice',
      fighting: 'type-fighting',
      poison: 'type-poison',
      ground: 'type-ground',
      flying: 'type-flying',
      psychic: 'type-psychic',
      bug: 'type-bug',
      rock: 'type-rock',
      ghost: 'type-ghost',
      dragon: 'type-dragon',
      dark: 'type-dark',
      steel: 'type-steel',
      fairy: 'type-fairy'
    };
    return colorMap[type] || 'type-normal';
  };

  const formatHeight = (height: number): string => {
    return `${(height / 10).toFixed(1)} m`;
  };

  const formatWeight = (weight: number): string => {
    return `${(weight / 10).toFixed(1)} kg`;
  };

  const spanishName = PokemonApiService.getSpanishName(species);
  const description = PokemonApiService.getSpanishDescription(species);

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <h2 className="pokemon-name">
          {PokemonApiService.capitalizeFirstLetter(spanishName)}
        </h2>
        <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
      </div>

      <div className="pokemon-image-container">
        {pokemon.sprites.front_default ? (
          <img 
            src={pokemon.sprites.front_default} 
            alt={`${spanishName} sprite`}
            className="pokemon-image"
          />
        ) : (
          <div className="pokemon-image-placeholder">
            <span>Sin imagen disponible</span>
          </div>
        )}
      </div>

      <div className="pokemon-types">
        {pokemon.types.map((typeInfo) => (
          <span 
            key={typeInfo.type.name} 
            className={`pokemon-type ${getTypeColorClass(typeInfo.type.name)}`}
          >
            {getTypeTranslation(typeInfo.type.name)}
          </span>
        ))}
      </div>

      <div className="pokemon-info">
        <div className="pokemon-physical">
          <div className="info-item">
            <span className="info-label">Altura:</span>
            <span className="info-value">{formatHeight(pokemon.height)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Peso:</span>
            <span className="info-value">{formatWeight(pokemon.weight)}</span>
          </div>
        </div>

        <div className="pokemon-stats">
          <h3>Estadísticas Base</h3>
          {pokemon.stats.map((statInfo) => (
            <div key={statInfo.stat.name} className="stat-item">
              <span className="stat-name">
                {getStatTranslation(statInfo.stat.name)}
              </span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar" 
                  style={{ width: `${Math.min((statInfo.base_stat / 255) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="stat-value">{statInfo.base_stat}</span>
            </div>
          ))}
        </div>

        <div className="pokemon-description">
          <h3>Descripción</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;