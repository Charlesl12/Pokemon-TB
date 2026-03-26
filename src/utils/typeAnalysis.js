import { TYPES, getEffectiveness, getEffectivenessAgainstTypes } from './typeChart';

export function getDefensiveProfile(pokemonTypes) {
    const profile = {};
    for (const attackingType of TYPES) {
        profile[attackingType] = getEffectivenessAgainstTypes(attackingType, pokemonTypes);
    }
    return profile;
}

export function getTeamDefensiveProfile(team) {
    const totals = Object.fromEntries(TYPES.map(t => [t, 0]));

    for (const pokemon of team) {
        const profile = getDefensiveProfile(pokemon.types);
        for (const type of TYPES) {
            if (profile[type] > 1) totals[type] += profile[type]; // only count weaknesses
        }
    }

    return totals;
}

export function getDuplicateWeaknesses(team) {
    const weaknessCounts = Object.fromEntries(TYPES.map(t => [t, 0]));

    for (const pokemon of team) {
        const profile = getDefensiveProfile(pokemon.types);
        for (const type of TYPES) {
            if (profile[type] > 1) weaknessCounts[type]++;
        }
    }

    return TYPES.filter(t => weaknessCounts[t] >= 2).map(t => ({
        type: t,
        count: weaknessCounts[t],
    }));
}

export function getTeamResistances(team) {
    if (team.length === 0) return [];

    return TYPES.filter(attackingType => {
        return team.every(pokemon => {
            const mult = getEffectivenessAgainstTypes(attackingType, pokemon.types);
            return mult <= 1;
        });
    });
}

export function getOffensiveCoverage(team) {
    const teamTypes = [...new Set(team.flatMap(p => p.types))];

    const coverage = {};
    for (const type of TYPES) {
        const bestMultiplier = Math.max(
            ...teamTypes.map(attackingType => getEffectiveness(attackingType, type))
        );
        coverage[type] = bestMultiplier;
    }

    return coverage;
}

export function getSuperEffectiveAgainst(team) {
    const coverage = getOffensiveCoverage(team);
    return TYPES.filter(t => coverage[t] >= 2);
}

export function getOffensiveWeaknesses(team) {
    const coverage = getOffensiveCoverage(team);
    return TYPES.filter(t => coverage[t] <= 0.5);
}
