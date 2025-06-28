import axios from 'axios';
import type { Pokemon, PokemonSpecies, PokemonData, FlavorTextEntry, EvolutionChain } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export class PokemonApiService {
  static async getPokemon(name: string): Promise<Pokemon> {
    const response = await api.get(`/pokemon/${name.toLowerCase()}`);
    return response.data;
  }

  static async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await api.get(`/pokemon-species/${id}`);
    return response.data;
  }

  static async getPokemonData(name: string): Promise<PokemonData & { evolutionChain: EvolutionChain }> {
  try {
    const pokemon = await this.getPokemon(name);
    const species = await this.getPokemonSpecies(pokemon.id);
    const evolutionChain = await this.getEvolutionChain(species.evolution_chain.url);

    return {
      pokemon,
      species,
      evolutionChain
    };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`No se encontró el Pokémon "${name}". Verifica el nombre e intenta de nuevo.`);
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Tiempo de espera agotado. Revisa tu conexión a internet.');
        }
        throw new Error('Error de conexión. Revisa tu conexión a internet e intenta de nuevo.');
      }
      throw new Error('Error desconocido al buscar el Pokémon.');
    }
  }

  static getSpanishDescription(species: PokemonSpecies): string {
    const spanishEntry = species.flavor_text_entries.find(
      (entry: FlavorTextEntry) => entry.language.name === 'es'
    );
    
    if (spanishEntry) {
      return spanishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    }

    const englishEntry = species.flavor_text_entries.find(
      (entry: FlavorTextEntry) => entry.language.name === 'en'
    );
    
    if (englishEntry) {
      return englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    }

    return 'Descripción no disponible';
  }
  static async getEvolutionChain(url: string): Promise<EvolutionChain> {
  const response = await axios.get(url);
  return response.data;
}

  static getSpanishName(species: PokemonSpecies): string {
    const spanishName = species.names.find(
      name => name.language.name === 'es'
    );
    
    return spanishName ? spanishName.name : species.name;
  }

  static capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}