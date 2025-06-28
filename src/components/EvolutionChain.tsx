import React, { useEffect, useState } from 'react';
import type { EvolutionChain as EvolutionChainType } from '../types/pokemon';

interface Props {
  evolutionChain: EvolutionChainType;
  currentPokemon: string;
}

interface EvolutionNode {
  name: string;
  min_level?: number;
  sprite?: string;
}

const getEvolutionNodes = (chain: any): EvolutionNode[] => {
  const nodes: EvolutionNode[] = [];
  let current = chain;
  while (current) {
    nodes.push({
      name: current.species.name,
      min_level: current.evolves_to[0]?.evolution_details[0]?.min_level,
    });
    current = current.evolves_to[0];
  }
  return nodes;
};

const EvolutionChain: React.FC<Props> = ({ evolutionChain, currentPokemon }) => {
  const [evolutions, setEvolutions] = useState<EvolutionNode[]>([]);

  useEffect(() => {
    const nodes = getEvolutionNodes(evolutionChain.chain);
    // Fetch sprites for each evolution
    Promise.all(
      nodes.map(async (node) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${node.name}`);
        const data = await res.json();
        return { ...node, sprite: data.sprites.front_default };
      })
    ).then(setEvolutions);
  }, [evolutionChain]);

  const isUnique = evolutionChain.chain.evolves_to.length === 0 && evolutionChain.chain.species.name === currentPokemon.toLowerCase();

  if (isUnique) {
    return <div>Este Pokémon no tiene evoluciones ni involuciones.</div>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      {evolutions.map((evo, idx) => (
        <React.Fragment key={evo.name}>
          <div style={{ textAlign: 'center' }}>
            <img src={evo.sprite} alt={evo.name} style={{ width: 72, height: 72, background: '#fff', borderRadius: 8, border: '1px solid #eee' }} />
            <div style={{ fontWeight: evo.name === currentPokemon.toLowerCase() ? 'bold' : 'normal', fontSize: '1.1rem', marginTop: 8 }}>
              {evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}
            </div>
          </div>
          {idx < evolutions.length - 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#888', fontSize: 14 }}>
              <span style={{ fontSize: 32 }}>→</span>
              {evolutions[idx + 1].min_level && <span>{evolutions[idx + 1].min_level}</span>}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EvolutionChain;