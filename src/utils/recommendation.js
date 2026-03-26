import { getDuplicateWeaknesses, getTeamResistances, getOffensiveWeaknesses, getSuperEffectiveAgainst } from './typeAnalysis';
import { getRoleCounts, getSpeedDistribution } from './statAnalysis';
import { getTeamRoleBreakdown } from './roleClassifier';

export function generateRecommendations(team) {
    if (team.length === 0) return [];

    const recommendations = [];

    if (team.length < 6) {
        recommendations.push({
            id: 'incomplete-team',
            severity: 'info',
            message: `Your team has ${team.length}/6 Pokémon. Add ${6 - team.length} more to complete it.`,
        });
    }

    const duplicateWeaknesses = getDuplicateWeaknesses(team);
    for (const { type, count } of duplicateWeaknesses) {
        recommendations.push({
            id: `duplicate-weakness-${type}`,
            severity: count >= 3 ? 'error' : 'warning',
            message: `${count} of your Pokémon are weak to ${capitalize(type)}-type attacks. Consider adding a Pokémon that resists ${capitalize(type)}.`,
        });
    }

    const offensiveWeaknesses = getOffensiveWeaknesses(team);
    if (offensiveWeaknesses.length > 0) {
        recommendations.push({
            id: 'offensive-gaps',
            severity: 'warning',
            message: `Your team struggles to hit ${formatList(offensiveWeaknesses.map(capitalize))}-type Pokémon super effectively.`,
        });
    }

    const roleCounts = getRoleCounts(team);

    if (roleCounts['Defensive'] === 0 && team.length >= 3) {
        recommendations.push({
            id: 'no-defensive',
            severity: 'warning',
            message: 'Your team lacks a defensive Pokémon. Consider adding one with high HP, Defense, and Sp. Def.',
        });
    }

    if (roleCounts['Physical Attacker'] === 0 && team.length >= 3) {
        recommendations.push({
            id: 'no-physical',
            severity: 'info',
            message: 'Your team has no physical attackers. This may make you predictable against high Sp. Def opponents.',
        });
    }

    if (roleCounts['Special Attacker'] === 0 && team.length >= 3) {
        recommendations.push({
            id: 'no-special',
            severity: 'info',
            message: 'Your team has no special attackers. This may make you predictable against high Defense opponents.',
        });
    }

    const { fast, slow } = getSpeedDistribution(team);

    if (fast.length === 0 && team.length >= 3) {
        recommendations.push({
            id: 'no-fast',
            severity: 'info',
            message: 'None of your Pokémon are particularly fast (Speed < 90). You may frequently move second in battle.',
        });
    }

    if (slow.length === team.length && team.length >= 3) {
        recommendations.push({
            id: 'all-slow',
            severity: 'warning',
            message: 'Your entire team is slow. Consider adding a fast Pokémon (Speed ≥ 90) to outspeed opponents.',
        });
    }

    const allTypes = [...new Set(team.flatMap(p => p.types))];
    if (allTypes.length <= 2 && team.length >= 3) {
        recommendations.push({
            id: 'low-type-diversity',
            severity: 'error',
            message: 'Your team has very low type diversity. This creates many overlapping weaknesses.',
        });
    }

    const resistances = getTeamResistances(team);
    if (resistances.length >= 6) {
        recommendations.push({
            id: 'good-resistances',
            severity: 'info',
            message: `Great coverage! Your team resists or is immune to ${formatList(resistances.map(capitalize))}-type attacks.`,
        });
    }

    return recommendations;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatList(items) {
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
