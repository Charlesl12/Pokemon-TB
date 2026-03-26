import { createContext, useContext, useState, useCallback } from 'react';

const TeamContext = createContext(null);

export function TeamProvider({ children }) {
    const [team, setTeam] = useState([]);

    const addPokemon = useCallback((pokemon) => {
        setTeam(prev => {
            if (prev.length >= 6) return prev;
            if (prev.find(p => p.id === pokemon.id)) return prev;
            return [...prev, pokemon];
        });
    }, []);

    const removePokemon = useCallback((pokemonId) => {
        setTeam(prev => prev.filter(p => p.id !== pokemonId));
    }, []);

    return (
        <TeamContext.Provider value={{ team, addPokemon, removePokemon }}>
            {children}
        </TeamContext.Provider>
    );
}

export function useTeam() {
    const ctx = useContext(TeamContext);
    if (!ctx) throw new Error('useTeam must be used within TeamProvider');
    return ctx;
}
