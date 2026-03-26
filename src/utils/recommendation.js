import { getDuplicateWeaknesses, getTeamResistances, getOffensiveWeaknesses, getSuperEffectiveAgainst } from './typeAnalysis';
import { getEffectivenessAgainstTypes } from "./typeChart.js";
import { getSpeedDistribution } from './statAnalysis';
import { getRoleCounts } from './roleClassifier';

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
        const weakPokemon = team
            .filter(p => {
                const mult = getEffectivenessAgainstTypes(type, p.types);
                return mult > 1;
            })
            .map(p => capitalize(p.name));

        recommendations.push({
            id: `duplicate-weakness-${type}`,
            severity: count >= 3 ? 'error' : 'warning',
            message: `${formatList(weakPokemon)} ${count === 1 ? 'is' : 'are'} weak to ${capitalize(type)}-type attacks. Consider adding a Pokémon that resists ${capitalize(type)}.`,
        });
    }

    const offensiveWeaknesses = getOffensiveWeaknesses(team);
    if (offensiveWeaknesses.length > 0) {
        const teamTypeNames = [...new Set(team.flatMap(p => p.types))].map(capitalize);
        recommendations.push({
            id: 'offensive-gaps',
            severity: 'warning',
            message: `Your team's types (${formatList(teamTypeNames)}) struggle to hit ${formatList(offensiveWeaknesses.map(capitalize))}-type Pokémon super effectively.`,
        });
    }

    const roleCounts = getRoleCounts(team);

    if (roleCounts['Defensive'] === 0 && team.length >= 3) {
        const highestDefenders = [...team]
            .sort((a, b) => (b.stats.defense + b.stats.specialDefense) - (a.stats.defense + a.stats.specialDefense))
            .slice(0, 1)
            .map(p => capitalize(p.name));

        recommendations.push({
            id: 'no-defensive',
            severity: 'warning',
            message: `Your team lacks a defensive Pokémon. ${highestDefenders[0]} has the best bulk on your team but may not be enough.`,
        });
    }

    if (roleCounts['Physical Attacker'] === 0 && team.length >= 3) {
        const bestSpecial = [...team]
            .sort((a, b) => b.stats.specialAttack - a.stats.specialAttack)
            .slice(0, 1)
            .map(p => capitalize(p.name));

        recommendations.push({
            id: 'no-physical',
            severity: 'info',
            message: `Your team has no physical attackers — ${bestSpecial[0]} is your strongest special attacker. High Defense opponents may wall you.`,
        });
    }

    if (roleCounts['Special Attacker'] === 0 && team.length >= 3) {
        const bestPhysical = [...team]
            .sort((a, b) => b.stats.attack - a.stats.attack)
            .slice(0, 1)
            .map(p => capitalize(p.name));

        recommendations.push({
            id: 'no-special',
            severity: 'info',
            message: `Your team has no special attackers — ${bestPhysical[0]} is your strongest physical attacker. High Sp. Def opponents may wall you.`,
        });
    }

    const { fast, slow } = getSpeedDistribution(team);

    if (fast.length === 0 && team.length >= 3) {
        const fastest = [...team]
            .sort((a, b) => b.stats.speed - a.stats.speed)[0];

        recommendations.push({
            id: 'no-fast',
            severity: 'info',
            message: `None of your Pokémon are particularly fast. ${capitalize(fastest.name)} is your fastest at ${fastest.stats.speed} Speed.`,
        });
    }

    if (slow.length === team.length && team.length >= 3) {
        recommendations.push({
            id: 'all-slow',
            severity: 'warning',
            message: `Your entire team is slow: ${formatList(slow.map(p => `${capitalize(p.name)} (${p.stats.speed})`))}. Consider swapping one for a faster Pokémon.`,
        });
    }

    const allTypes = [...new Set(team.flatMap(p => p.types))];

    if (allTypes.length <= 2 && team.length >= 3) {
        recommendations.push({
            id: 'low-type-diversity',
            severity: 'error',
            message: `Your team only covers ${formatList(allTypes.map(capitalize))} types. This creates heavily overlapping weaknesses across ${team.map(p => capitalize(p.name)).join(', ')}.`,
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
