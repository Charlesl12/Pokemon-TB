import { useState, useMemo, useRef, useEffect } from 'react';
import { usePokemonList } from '../../hooks/usePokemonList';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import { useTeam } from '../../context/TeamContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorState from '../ErrorState/ErrorState';
import './SearchBar.css';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const { list, loading: listLoading } = usePokemonList();
    const { fetchPokemon, loading: detailLoading, error } = usePokemonDetails();
    const { team, addPokemon } = useTeam();

    const suggestions = useMemo(() => {
        if (query.length < 2) return [];
        return list
            .filter(name => name.includes(query.toLowerCase()))
            .slice(0, 8);
    }, [query, list]);
    
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function handleSelect(name) {
        setQuery('');
        setIsOpen(false);
        const pokemon = await fetchPokemon(name);
        if (pokemon) addPokemon(pokemon);
    }

    const isTeamFull = team.length >= 6;

    return (
        <div className="search-wrapper" ref={wrapperRef}>
            <div className="search-input-row">
                <input
                    className="search-input"
                    type="text"
                    placeholder={isTeamFull ? 'Team is full (6/6)' : 'Search for a Pokémon...'}
                    value={query}
                    disabled={isTeamFull || listLoading}
                    onChange={e => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {detailLoading && <LoadingSpinner size={20} />}
            </div>

            {error && <ErrorState message={error} />}

            {isOpen && suggestions.length > 0 && (
                <ul className="search-dropdown">
                    {suggestions.map(name => (
                        <li
                            key={name}
                            className="search-dropdown-item"
                            onMouseDown={() => handleSelect(name)} // mousedown fires before blur
                        >
                            {capitalize(name)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
