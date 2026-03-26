import {
    RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis,
    Tooltip, ResponsiveContainer,
} from 'recharts';

import { useTeam } from '../../context/TeamContext';
import { getRadarData, getSpeedDistribution } from '../../utils/statAnalysis';
import { getTeamRoleBreakdown, getRoleCounts } from '../../utils/roleClassifier';
import './StatChart.css';

const ROLE_COLORS = {
    'Physical Attacker': '#f97316',
    'Special Attacker':  '#8b5cf6',
    'Mixed Attacker':    '#06b6d4',
    'Defensive':         '#22c55e',
    'Fast':              '#f59e0b',
};

export default function StatRadarChart() {
    const { team } = useTeam();

    if (team.length === 0) {
        return (
            <div className="radar-empty">
                Add Pokémon to your team to see stat analysis.
            </div>
        );
    }

    const radarData     = getRadarData(team);
    const roleCounts    = getRoleCounts(team);
    const roleBreakdown = getTeamRoleBreakdown(team);
    const { fast, medium, slow } = getSpeedDistribution(team);

    return (
        <div className="radar-section">
            <h2 className="radar-title">Team Stats & Roles</h2>

            <div className="radar-grid">
                <div className="radar-panel">
                    <h3 className="panel-title">Average Base Stats</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis
                                dataKey="stat"
                                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 255]}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                tickCount={4}
                            />
                            <Radar
                                dataKey="value"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.25}
                                strokeWidth={2}
                            />
                            <Tooltip
                                formatter={(value) => [value, 'Avg']}
                                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="radar-panel">
                    <h3 className="panel-title">Role Distribution</h3>
                    <div className="role-list">
                        {Object.entries(roleCounts).map(([role, count]) => (
                            <div key={role} className="role-row">
                <span
                    className="role-dot"
                    style={{ background: ROLE_COLORS[role] }}
                />
                                <span className="role-name">{role}</span>
                                <div className="role-bar-track">
                                    <div
                                        className="role-bar-fill"
                                        style={{
                                            width: `${(count / team.length) * 100}%`,
                                            background: ROLE_COLORS[role],
                                        }}
                                    />
                                </div>
                                <span className="role-count">{count}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pokemon-roles">
                        {roleBreakdown.map(({ name, roles }) => (
                            <div key={name} className="pokemon-role-row">
                                <span className="pokemon-role-name">{capitalize(name)}</span>
                                <div className="pokemon-role-tags">
                                    {roles.map(role => (
                                        <span
                                            key={role}
                                            className="role-tag"
                                            style={{ background: ROLE_COLORS[role] + '22', color: ROLE_COLORS[role] }}
                                        >
                      {role}
                    </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="speed-section">
                        <h4 className="speed-title">Speed Tiers</h4>
                        <div className="speed-tiers">
                            <SpeedTier label="Fast (≥90)" pokemon={fast} color="#22c55e" />
                            <SpeedTier label="Medium (60–89)" pokemon={medium} color="#f59e0b" />
                            <SpeedTier label="Slow (<60)" pokemon={slow} color="#ef4444" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpeedTier({ label, pokemon, color }) {
    return (
        <div className="speed-tier">
            <span className="speed-tier-label" style={{ color }}>{label}</span>
            <span className="speed-tier-names">
        {pokemon.length === 0
            ? '—'
            : pokemon.map(p => capitalize(p.name)).join(', ')
        }
      </span>
        </div>
    );
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
