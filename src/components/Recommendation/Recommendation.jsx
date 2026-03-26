import { useTeam } from '../../context/TeamContext';
import { generateRecommendations } from '../../utils/recommendation';
import './Recommendation.css';

const SEVERITY_CONFIG = {
    error:   { icon: '🔴', label: 'Critical', className: 'rec-error' },
    warning: { icon: '🟡', label: 'Warning',  className: 'rec-warning' },
    info:    { icon: '🔵', label: 'Info',     className: 'rec-info' },
};

export default function Recommendations() {
    const { team } = useTeam();
    const recommendations = generateRecommendations(team);

    if (team.length === 0) {
        return (
            <div className="rec-empty">
                Add Pokémon to your team to get recommendations.
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="rec-section">
                <h2 className="rec-title">Recommendations</h2>
                <div className="rec-all-good">
                    🎉 Your team looks well balanced! No major issues found.
                </div>
            </div>
        );
    }

    const grouped = {
        error:   recommendations.filter(r => r.severity === 'error'),
        warning: recommendations.filter(r => r.severity === 'warning'),
        info:    recommendations.filter(r => r.severity === 'info'),
    };

    return (
        <div className="rec-section">
            <h2 className="rec-title">Recommendations</h2>
            <p className="rec-subtitle">
                {recommendations.length} suggestion{recommendations.length !== 1 ? 's' : ''} based on your team composition
            </p>

            <div className="rec-list">
                {['error', 'warning', 'info'].map(severity =>
                    grouped[severity].map(rec => {
                        const config = SEVERITY_CONFIG[severity];
                        return (
                            <div key={rec.id} className={`rec-card ${config.className}`}>
                                <span className="rec-icon">{config.icon}</span>
                                <div className="rec-content">
                                    <span className="rec-label">{config.label}</span>
                                    <p className="rec-message">{rec.message}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
