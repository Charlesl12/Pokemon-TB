import { useState, useEffect } from 'react';

const cache = { data: null };

export function usePokemonList() {
    const [list, setList] = useState(cache.data ?? []);
    const [loading, setLoading] = useState(!cache.data);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (cache.data) return;

        async function fetchList() {
            try {
                const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
                if (!res.ok) throw new Error('Failed to fetch Pokémon list');
                const data = await res.json();
                cache.data = data.results.map(p => p.name);
                setList(cache.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchList();
    }, []);

    return { list, loading, error };
}
