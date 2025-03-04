
// ------------------------------------------------------------ Data


let tierNames = [
    "Multi",
    "Resets",
    "Prestige",
    "Power",
    "Ascension",
    "Rebirths",
    "Transcension",
    "Divinity",
    "Supremity",
    "Hyperity",
]

let tierColors = [
    "#f56",
    "#4b5",
    "#68f",
    "#aa3",
    "#4ac",
    "#aaa",
    "#c4c",
    "#f94",
    "#777",
    "#a7c",
]

let unlocks = {
    "btn1": {
        desc: () => "Gain 1 Money per second",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => game.money = D.sub(game.money, 10),
    },
    "btn2": {
        requires: ["btn1"],
        desc: () => "Unlock Multi",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => { game.money = D.sub(game.money, 10); makeRow(-1); },
    },
    "btn3": {
        requires: ["btn2"],
        desc: () => "Unlock Resets",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => { game.money = D.sub(game.money, 10); makeRow(0); },
    },
    "btn4": {
        requires: ["btn3"],
        desc: () => "Unlock X-axis expansion",
        condition: () => D.gte(getRowAmount(0), 10),
        conDisplay: () => "−" + format(10) + " Multi",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 0)); r.amount = D.sub(r.amount, 10); makeRow(1); },
    },
    "btn5": {
        requires: ["btn3"],
        desc: () => "Unlock Y-axis expansion",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => { game.money = D.sub(game.money, 10); },
    },
    "btn6": {
        requires: ["btn5"],
        desc: () => "Mark button numbers",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => { game.money = D.sub(game.money, 10); allDirty = true; },
    },
    "rne1": {
        requires: ["btn4"],
        desc: () => "Unlock Runes",
        condition: () => D.gte(getRowAmount(2), 1),
        conDisplay: () => "−" + format(0) + " Prestige",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 2)); r.amount = D.sub(r.amount, 0); updateTabVisibility(); },
    },
    "rne2": {
        requires: ["rne1"],
        desc: () => "Unlock Rune merging",
        condition: () => D.gte(game.gems, 25),
        conDisplay: () => "−" + format(25) + " Gems",
        execute: () => { game.gems = D.sub(game.gems, 25); },
    },
    "rne3": {
        requires: ["rne2"],
        desc: () => "Unlock Bulk scraping",
        condition: () => D.gte(game.scraps, 2),
        conDisplay: () => "−" + format(2) + " Glyphs",
        execute: () => { game.scraps = D.sub(game.scraps, 2); },
    },
    "mle1": {
        requires: ["rne1"],
        desc: () => "Unlock Milestones",
        condition: () => D.gte(getRowAmount(3), 1),
        conDisplay: () => "−" + format(0) + " Power",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 3)); r.amount = D.sub(r.amount, 0); updateTabVisibility(); },
    },
    "tok1": {
        requires: ["mle1"],
        desc: () => "Unlock Tokens",
        condition: () => D.gte(getRowAmount(4), 1),
        conDisplay: () => "−" + format(0) + " Ascension",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 4)); r.amount = D.sub(r.amount, 0); updateTabVisibility(); },
    },
    "tok2": {
        requires: ["tok1"],
        desc: () => "Unlock Rune upgrades",
        condition: () => D.gte(game.tokens, 2),
        conDisplay: () => "−" + format(2) + " Tokens",
        execute: () => { game.tokens = D.sub(game.tokens, 2); },
    },
    "tok3": {
        requires: ["tok2"],
        desc: () => "Unlock Rune effect shop",
        condition: () => D.gte(game.tokens, 1),
        conDisplay: () => "−" + format(1) + " Tokens",
        execute: () => { game.tokens = D.sub(game.tokens, 1); },
    },
    "atm1": {
        requires: ["btn6"],
        desc: () => "Unlock Automation",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => { game.money = D.sub(game.money, 10); updateTabVisibility(); },
    },
    "atm1a": {
        requires: ["atm1"],
        desc: () => "Unlock Reset Automator",
        condition: () => D.gte(game.money, 1200),
        conDisplay: () => "−" + format(1200) + " Money",
        execute: () => { game.money = D.sub(game.money, 1200); },
    },
    "atm2a": {
        requires: ["atm1a"],
        desc: () => "Unlock Automator configs",
        condition: () => D.gte(game.money, 1250),
        conDisplay: () => "−" + format(1250) + " Money",
        execute: () => { game.money = D.sub(game.money, 1250); },
    },
    "atm3a": {
        requires: ["atm2a"],
        desc: () => "Unlock Automator controller",
        condition: () => D.gte(game.money, 1300),
        conDisplay: () => "−" + format(1300) + " Money",
        execute: () => { game.money = D.sub(game.money, 1300); },
    },
    "atm4a": {
        requires: ["atm3a"],
        desc: () => "Unlock Charger odometer",
        condition: () => D.gte(game.money, Number.MAX_VALUE),
        conDisplay: () => "−" + format(Number.MAX_VALUE) + " Money",
        execute: () => { game.money = D.sub(game.money, Number.MAX_VALUE); },
    },
    "atm5a": {
        requires: ["atm4a", "sig1"],
        desc: () => "Unlock Sigil Automator",
        condition: () => D.gte(temp.sigilPoints, 1),
        conDisplay: () => "≥" + format(1) + " Sigil Points",
        execute: () => {  },
    },
    "atm2": {
        requires: ["atm1"],
        desc: () => "Unlock Big Charges",
        condition: () => D.gte(game.charge, 0),
        conDisplay: () => "−" + format(0) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 0); },
    },
    "atm3": {
        requires: ["atm2"],
        desc: () => "Unlock Wide Charges",
        condition: () => D.gte(game.charge, 0),
        conDisplay: () => "−" + format (0) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 0); },
    },
    "atm4": {
        requires: ["atm3", "tok1"],
        desc: () => "Charges give Tokens",
        condition: () => D.gte(game.charge, 0),
        conDisplay: () => "−" + format(0) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 0); },
    },
    "sig1": {
        requires: ["tok1"],
        desc: () => "Unlock Sigils",
        condition: () => D.gte(temp.skillLevel,1),
        conDisplay: () => "Skill level ≥" + format(1) + "",
        execute: () => { updateTabVisibility(); },
    },
    "col1": {
        requires: ["sig1", "atm4", "atm4a", "tok3", "rne3"],
        desc: () => "Unlock Collapse",
        condition: () => D.gte(temp.skillLevel,2),
        conDisplay: () => "Skill level ≥" + format(2) + "",
        execute: () => { updateTabVisibility(); },
    },
    "abs1": {
        requires: ["col1"],
        desc: () => "Unlock Abstract",
        condition: () => D.gte(game.colPoints, 15),
        conDisplay: () => "−" + format(15) + " Collapse Pts.",
        execute: () => { game.colPoints = D.sub(game.colPoints, 15); },
    },
}
let visibleUnlocks = [];


// ------------------------------------------------------------ Functions


function getButtonGain(row, tier) {
    let base = D.eq(row, 0) ? 8 : 4;
    let mult = D.eq(row, 0) ? 1 : D.add(row, 1);
    return D.pow(base, D.pow(1.05, tier).sub(1).mul(2069)).mul(mult);
}
function getRowMulti(row, index) {
    index ??= game.ladder.findIndex(x => D.eq(x.tier, row));
    return D.add(getRowAmount(D.add(row, 1)), 1).mul(temp.milestoneMultis[index] ?? 1).mul(temp.sigilEffects[index] ?? 1);
}
function getButtonCost(row, tier) {
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(2);
    return D.add(row, 1).mul(1).pow(D.pow(1.1, tier).sub(1).mul(1)).mul(base);
}
function getHighestButton(row, amount) {
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(250);
    return D.div(amount, base).logBase(D.add(row, 1).mul(10)).div(10).add(1).logBase(1.1).floor().max(-1);
}

function getRowAmount(row) {
    return D(game.ladder.find(x => D.eq(x.tier, row))?.amount ?? 0);
}

function clickButton(row, tier, auto = false) {
    let index = game.ladder.findIndex(x => D.eq(x.tier, row));
    let data = game.ladder[index];
    let cost = getButtonCost(row, tier);
    if (index <= 0) {
        if (D.gte(game.money, cost)) {
            game.money = D.sub(game.money, cost);
            data.amount = getButtonGain(row, tier).mul(getRowMulti(row, index)).add(data.amount);
            data.presses = D.add(data.presses, 1);
            if (!auto && game.unlocks.tok1 && Math.random() * 100 <= temp.tokenUpgEffects.tokens.normalChance)
                game.tokens = D.add(row, 1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).add(game.tokens);
            if (!auto) game.stats.presses++;
        }
    } else {
        let prevData = game.ladder[index - 1];
        if (D.gte(prevData.amount, cost)) {
            game.money = 0;
            for (let a = 0; a < index; a++) game.ladder[a].amount = game.ladder[a].level = D(0);
            data.amount = getButtonGain(row, tier).mul(getRowMulti(row)).add(data.amount);
            data.level = D(0);
            data.presses = D.add(data.presses, 1);
            if (!auto && game.unlocks.tok1 && Math.random() * 100 <= temp.tokenUpgEffects.tokens.normalChance)
                game.tokens = D.add(row, 1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).add(game.tokens);
            if (!auto) game.stats.presses++;
            if (game.unlocks.btn5) makeRow(row);
        }
    }
}

function makeRow(row) {
    let highest = game.ladder[game.ladder.length - 1] ?? {tier: -1};
    while (D.lte(highest.tier, row) && game.ladder.length < 10) {
        highest = {
            tier: D.add(highest.tier, 1), 
            amount: D(0), 
            level: D(0),
            presses: D(0),
        };
        game.ladder.push(highest);
    }
}

function updateVisibleUnlocks() {
    visibleUnlocks = [];
    unlLoop: for (let unl in unlocks) {
        if (game.unlocks[unl]) continue;
        for (let prev of unlocks[unl].requires ?? []) if (!game.unlocks[prev]) continue unlLoop;
        visibleUnlocks.push(unl);
    }
}
function performUnlock(unl) {
    let data = unlocks[unl];
    if (data.condition()) {
        game.unlocks[unl] = true;
        data.execute();
        checkEndgame();
    }
}

function checkEndgame() {
    for (let unl in unlocks) if (!game.unlocks[unl]) return;

    let desc = document.createElement("div");
    desc.innerHTML = `
        You've purchased all the available unlocks currently in the game!<br/>
        However, it is not the end of the journey...<br/>
        Collapse is not implemented yet, make sure to stay tuned for future game updates!<br/>
        <br/>
        Time played: <b>${format.time(game.stats.timePlayed)}</b><br/>
    `
    showOverlay("popup", "Congratulations!", desc, ["Ok"]);
}

function doMultiAuto(times) {
    if (game.ladder.length <= 0) return;
    let row = game.ladder[0]
    let pos = getHighestButton(row.tier, game.money);
    while (D.gt(times, 0) && D.gte(pos, 0) && D.gt(game.money, 0)) {
        let cost = getButtonCost(row.tier, pos);
        let gain = getButtonGain(row.tier, pos);
        let presses = D.div(game.money, cost).floor().min(times);
        game.money = D.sub(game.money, D.mul(cost, presses));
        row.amount = D.add(row.amount, D.mul(gain, presses).mul(getRowMulti(row.tier)));
        row.presses = D.add(row.presses, presses);
        times = D.sub(times, presses);
        pos = D.sub(pos, 1);
    }
    game.ladder[0] = row;
}

function doResetAuto(times) {
    if (game.ladder.length <= 0) return;
    whileloop: while (D.gt(times, 0)) {
        for (let a = (game.automators.reset?.depth ?? 1); a >= 1; a--) {
            let row = game.ladder[a];
            if (!row) continue;
            let pos = getHighestButton(row.tier, game.ladder[a - 1].amount);
            if (D.lt(pos, 0)) continue;
            let gain = getButtonGain(row.tier, pos).mul(getRowMulti(row.tier));
            if (D.div(gain, row.amount).gt(game.automators.reset?.factor ?? 0)) {
                clickButton(row.tier, pos, true);
                times = D.sub(times, 1);
                row.level = D.max(row.level, pos);
                continue whileloop;
            }
        }
        break;
    }
}
