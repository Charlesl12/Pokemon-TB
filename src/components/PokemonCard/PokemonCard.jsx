import { useTeam } from '../../context/TeamContext';
import './PokemonCard.css';

// Generated using AI to match their in-game colours
const TYPE_COLORS = {
    normal: '#A8A878',   fire: '#F08030',    water: '#6890F0',
    electric: '#F8D030', grass: '#78C850',   ice: '#98D8D8',
    fighting: '#C03028', poison: '#A040A0',  ground: '#E0C068',
    flying: '#A890F0',   psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038',     ghost: '#705898',   dragon: '#7038F8',
    dark: '#705848',     steel: '#B8B8D0',   fairy: '#EE99AC',
};

export default function PokemonCard({ pokemon }) {
    const { removePokemon } = useTeam();

    const { id, name, sprite, types, abilities, stats } = pokemon;

    return (
        <div className="pokemon-card">
            <button
                className="remove-btn"
                onClick={() => removePokemon(id)}
                title="Remove from team"
            >
                ×
            </button>

            {/* Sprite */}
            <img
                className="pokemon-sprite"
                src={sprite}
                alt={name}
                loading="lazy"
            />

            {/* Name */}
            <h3 className="pokemon-name">{capitalize(name)}</h3>

            {/* Types */}
            <div className="type-badges">
                {types.map(type => (
                    <span
                        key={type}
                        className="type-badge"
                        style={{ background: TYPE_COLORS[type] }}
                    >
            {capitalize(type)}
          </span>
                ))}
            </div>

            <div className="stats-section">
                {Object.entries(STAT_LABELS).map(([key, label]) => (
                    <div key={key} className="stat-row">
                        <span className="stat-label">{label}</span>
                        <div className="stat-bar-track">
                            <div
                                className="stat-bar-fill"
                                style={{
                                    width: `${Math.min((stats[key] / 255) * 100, 100)}%`,
                                    background: getStatColor(stats[key]),
                                }}
                            />
                        </div>
                        <span className="stat-value">{stats[key]}</span>
                    </div>
                ))}
            </div>

            <div className="abilities-section">
                <span className="abilities-label">Abilities: </span>
                {abilities.map((a, i) => (
                    <span key={a.name} className={`ability ${a.isHidden ? 'hidden-ability' : ''}`}>
            {capitalize(a.name.replace('-', ' '))}
                        {a.isHidden && ' (H)'}
                        {i < abilities.length - 1 ? ', ' : ''}
          </span>
                ))}
            </div>
        </div>
    );
}

const STAT_LABELS = {
    hp:             'HP',
    attack:         'Atk',
    defense:        'Def',
    specialAttack:  'SpA',
    specialDefense: 'SpD',
    speed:          'Spe',
};

function getStatColor(value) {
    if (value >= 100) return '#22c55e'; // green
    if (value >= 70)  return '#f59e0b'; // yellow
    return '#ef4444';                   // red
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
