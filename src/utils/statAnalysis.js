import { TYPES } from './typeChart.js';

export function getTeamStatAverages(team) {
    if (team.length === 0) return null;

    const statKeys = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'];
    const averages = {};

    for (const stat of statKeys) {
        const total = team.reduce((sum, p) => sum + p.stats[stat], 0);
        averages[stat] = Math.round(total / team.length);
    }

    return averages;
}

export function getRadarData(team) {
    const averages = getTeamStatAverages(team);
    if (!averages) return [];

    return [
        { stat: 'HP',       value: averages.hp },
        { stat: 'Attack',   value: averages.attack },
        { stat: 'Defense',  value: averages.defense },
        { stat: 'Sp. Atk',  value: averages.specialAttack },
        { stat: 'Sp. Def',  value: averages.specialDefense },
        { stat: 'Speed',    value: averages.speed },
    ];
}

export function getSpeedDistribution(team) {
    return {
        fast:   team.filter(p => p.stats.speed >= 90),
        medium: team.filter(p => p.stats.speed >= 60 && p.stats.speed < 90),
        slow:   team.filter(p => p.stats.speed < 60),
    };
}
