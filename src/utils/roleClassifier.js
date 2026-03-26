export function classifyRole(stats) {
    const { attack, specialAttack, defense, specialDefense, hp, speed } = stats;

    const roles = [];

    if (attack > specialAttack + 10) roles.push('Physical Attacker');
    else if (specialAttack > attack + 10) roles.push('Special Attacker');
    else roles.push('Mixed Attacker');

    if (defense + specialDefense > 120 && hp > 70) roles.push('Defensive');

    if (speed >= 90) roles.push('Fast');

    return roles;
}

export function getTeamRoleBreakdown(team) {
    return team.map(p => ({
        name: p.name,
        roles: classifyRole(p.stats),
    }));
}

export function getRoleCounts(team) {
    const counts = {
        'Physical Attacker': 0,
        'Special Attacker': 0,
        'Mixed Attacker': 0,
        'Defensive': 0,
        'Fast': 0,
    };

    for (const pokemon of team) {
        const roles = classifyRole(pokemon.stats);
        for (const role of roles) {
            counts[role]++;
        }
    }

    return counts;
}
