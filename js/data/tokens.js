
let tokenUpgrades = {
    tokens: {
        gain: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Token gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        normalChance: {
            effectAmount: (x) => D.mul(5, x).toNumber() + 10,
            effectText: ["{0}%", "button Token chance"],
            effectPrecision: 0,
            maxAmount: 18,
            costAmount: (x) => D.add(1, x).pow(x).mul(1),
        },
        normalTierFactor: {
            effectAmount: (x) => D.mul(0.05, x).add(0.5),
            effectText: ["^{0}", "button tier to Token multi"],
            effectPrecision: 2,
            costAmount: (x) => D.add(1, x).pow(x).mul(1),
        },
        gainFromCharge: {
            requires: ["atm4"],
            effectAmount: (x) => D.add(1, x),
            effectText: ["×{0}", "Token gain from charges"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
    },
    double: {
        money: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Money gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        gems: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Gems gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        scrap: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Glyph gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        charge: {
            requires: ["atm1"],
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Charge gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
    },
    rune: {
        genEff: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["^{0}", "effective gem generators"],
            effectPrecision: 1,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        upgEff: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["^{0}", "effective generator upgrades"],
            effectPrecision: 1,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
    },
    runeEff: {
        gem: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 20,
            effectText: ["{0}% chance", "+ base Gem gain"],
            effectPrecision: 0,
            maxAmount: 16,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        scrap: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 15,
            effectText: ["{0}% chance", "+ base Glyph gain"],
            effectPrecision: 0,
            maxAmount: 17,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        token: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 10,
            effectText: ["{0}% chance", "+ base Token gain"],
            effectPrecision: 0,
            maxAmount: 18,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
        charge: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 25,
            effectText: ["{0}% chance", "+ base Charge gain"],
            effectPrecision: 0,
            maxAmount: 15,
            costAmount: (x) => D.pow(1, x).mul(1),
        },
    },
}

function getTokenMulti() {
    return D.add(temp.runeStats.token ?? 0, 6e35).mul(temp.tokenUpgEffects.tokens.gain).mul(temp.colUpgEffects[13]);
}

function buyTokenUpgrade(cat, id) {
    let data = tokenUpgrades[cat][id];
    let level = game.tokenUpg[cat]?.[id] ?? 0;
    let cost = data.costAmount(level);
    if (D.gte(game.tokens, cost)) {
        game.tokens = D.sub(game.tokens, cost);
        if (!game.tokenUpg[cat]) game.tokenUpg[cat] = {};
        game.tokenUpg[cat][id] = D.add(level, 1);
        temp.tokenUpgEffects[cat][id] = data.effectAmount(game.tokenUpg[cat][id]);
    }
}

function getAvailableTokenUpgrades(cat) {
    return Object.keys(tokenUpgrades[cat]).filter(x => (tokenUpgrades[cat][x].requires ?? []).reduce((x, y) => x && game.unlocks[y], true));
}
