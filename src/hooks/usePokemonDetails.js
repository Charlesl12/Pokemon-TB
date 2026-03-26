import { useState, useCallback } from 'react';
import { normalizePokemon } from '../utils/normalizePokemon';

const cache = new Map();

export function usePokemonDetails() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPokemon = useCallback(async (name) => {
        if (cache.has(name)) return cache.get(name);

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!res.ok) throw new Error(`Could not find "${name}"`);
            const data = await res.json();
            const normalized = normalizePokemon(data);
            cache.set(name, normalized);
            return normalized;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { fetchPokemon, loading, error };
}
