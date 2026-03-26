import { useTeam } from '../../context/TeamContext';
import PokemonCard from '../PokemonCard/PokemonCard.jsx';
import './TeamSlots.css';

export default function TeamSlots() {
    const { team } = useTeam();
    
    const slots = Array.from({ length: 6 }, (_, i) => team[i] ?? null);

    return (
        <div className="team-section">
            <div className="team-header">
                <h2 className="team-title">Your Team</h2>
                <span className="team-count">{team.length} / 6</span>
            </div>

            <div className="team-grid">
                {slots.map((pokemon, i) => (
                    pokemon
                        ? <PokemonCard key={pokemon.id} pokemon={pokemon} />
                        : <EmptySlot key={`empty-${i}`} index={i} />
                ))}
            </div>
        </div>
    );
}

function EmptySlot({ index }) {
    return (
        <div className="empty-slot">
            <div className="empty-slot-ball" />
            <span className="empty-slot-label">Empty Slot {index + 1}</span>
        </div>
    );
}
