import { useTeam } from '../../context/TeamContext';
import { TYPES } from '../../utils/typeChart';
import {
    getTeamDefensiveProfile,
    getDuplicateWeaknesses,
    getTeamResistances,
    getOffensiveCoverage,
    getSuperEffectiveAgainst,
    getOffensiveWeaknesses,
} from '../../utils/typeAnalysis';
import './TypeCoverageChart.css';

const TYPE_COLORS = {
    normal: '#A8A878',   fire: '#F08030',    water: '#6890F0',
    electric: '#F8D030', grass: '#78C850',   ice: '#98D8D8',
    fighting: '#C03028', poison: '#A040A0',  ground: '#E0C068',
    flying: '#A890F0',   psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038',     ghost: '#705898',   dragon: '#7038F8',
    dark: '#705848',     steel: '#B8B8D0',   fairy: '#EE99AC',
};

export default function TypeCoverageChart() {
    const { team } = useTeam();

    if (team.length === 0) {
        return (
            <div className="coverage-empty">
                Add Pokémon to your team to see type coverage analysis.
            </div>
        );
    }

    const defensiveProfile = getTeamDefensiveProfile(team);
    const duplicateWeaknesses = getDuplicateWeaknesses(team);
    const resistances = getTeamResistances(team);
    const offensiveCoverage = getOffensiveCoverage(team);
    const superEffective = getSuperEffectiveAgainst(team);
    const offensiveGaps = getOffensiveWeaknesses(team);

    return (
        <div className="coverage-section">
            <h2 className="coverage-title">Type Coverage</h2>

            <div className="coverage-grid">
                <div className="coverage-panel">
                    <h3 className="panel-title">Defensive — Incoming Damage</h3>
                    <p className="panel-subtitle">
                        How hard each type hits your team (sum of multipliers across members)
                    </p>
                    <div className="type-rows">
                        {TYPES.map(type => {
                            const value = defensiveProfile[type];
                            const isDuplicate = duplicateWeaknesses.find(d => d.type === type);
                            return (
                                <TypeRow
                                    key={type}
                                    type={type}
                                    value={value}
                                    max={team.length * 4}
                                    isDanger={!!isDuplicate}
                                    label={value === 0 ? 'Immune' : `${value.toFixed(1)}×`}
                                />
                            );
                        })}
                    </div>

                    {resistances.length > 0 && (
                        <div className="summary-row good">
                            ✅ Resists: {resistances.map(capitalize).join(', ')}
                        </div>
                    )}

                    {duplicateWeaknesses.length > 0 && (
                        <div className="summary-row bad">
                            ⚠️ Multiple members weak to: {duplicateWeaknesses.map(d => capitalize(d.type)).join(', ')}
                        </div>
                    )}
                </div>

                <div className="coverage-panel">
                    <h3 className="panel-title">Offensive — Attacking Power</h3>
                    <p className="panel-subtitle">
                        Best multiplier your team can achieve against each type
                    </p>
                    <div className="type-rows">
                        {TYPES.map(type => {
                            const value = offensiveCoverage[type];
                            return (
                                <TypeRow
                                    key={type}
                                    type={type}
                                    value={value}
                                    max={4}
                                    isDanger={value <= 0.5}
                                    isGood={value >= 2}
                                    label={value === 0 ? 'No effect' : `${value}×`}
                                />
                            );
                        })}
                    </div>

                    {superEffective.length > 0 && (
                        <div className="summary-row good">
                            ✅ Super effective vs: {superEffective.map(capitalize).join(', ')}
                        </div>
                    )}

                    {offensiveGaps.length > 0 && (
                        <div className="summary-row bad">
                            ⚠️ Struggles against: {offensiveGaps.map(capitalize).join(', ')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TypeRow({ type, value, max, isDanger, isGood, label }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const barColor = isDanger ? '#ef4444' : isGood ? '#22c55e' : '#6b7280';

    return (
        <div className="type-row">
      <span
          className="type-pill"
          style={{ background: TYPE_COLORS[type] }}
      >
        {capitalize(type)}
      </span>
            <div className="type-bar-track">
                <div
                    className="type-bar-fill"
                    style={{ width: `${pct}%`, background: barColor }}
                />
            </div>
            <span className="type-value" style={{ color: barColor }}>
        {label}
      </span>
        </div>
    );
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
