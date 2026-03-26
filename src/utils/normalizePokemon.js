export function normalizePokemon(raw) {
    return {
        id: raw.id,
        name: raw.name,
        sprite: raw.sprites.other['official-artwork'].front_default
            ?? raw.sprites.front_default,
        types: raw.types.map(t => t.type.name),
        abilities: raw.abilities.map(a => ({
            name: a.ability.name,
            isHidden: a.is_hidden,
        })),
        stats: {
            hp: raw.stats[0].base_stat,
            attack: raw.stats[1].base_stat,
            defense: raw.stats[2].base_stat,
            specialAttack: raw.stats[3].base_stat,
            specialDefense: raw.stats[4].base_stat,
            speed: raw.stats[5].base_stat,
        },
    };
}
