ìlet collapseUpgrades = {
    "11": {
        effectAmount: (x) => D.pow(5, x),
        effectText: ["×{0}", "all Charge gains"],
        effectPrecision: 0,
        costAmount: (x) => D.pow(25, x).mul(D.pow(2, D.pow(x, 2))).mul(1),
    },
    "12": {
        effectAmount: (x) => D.pow(2, x),
        effectText: ["×{0}", "all Gem gains"],
        effectPrecision: 0,
        costAmount: (x) => D.pow(10, x).mul(D.pow(5, D.pow(x, 2))).mul(100),
    },
    "13": {
        effectAmount: (x) => D.pow(1.5, x),
        effectText: ["×{0}", "all Token gains"],
        effectPrecision: 1,
        costAmount: (x) => D.pow(5, x).mul(D.pow(10, D.pow(x, 2))).mul(1000),
    },
    "14": {
        effectAmount: (x) => D.pow(2, x),
        effectText: ["×{0}", "all Collapse Point gains"],
        effectPrecision: 0,
        costAmount: (x) => D.pow(2, x).mul(D.pow(5, D.pow(x, 2))).mul(10000),
    },
    "21": {
        effectText: ["Keep Automation", "on Collapse resets"],
        cap: 1,
        costAmount: (x) => D(1),
    },
    "22": {
        effectText: ["Keep Runes", "on Collapse resets"],
        cap: 1,
        costAmount: (x) => D(1e9),
    },
    "23": {
        effectText: ["Keep Tokens", "on Collapse resets"],
        cap: 1,
        costAmount: (x) => D(1e3),
    },
    "24": {
        effectText: ["Keep Sigils", "on Collapse resets"],
        cap: 1,
        costAmount: (x) => D(1e24),
    },
}

function getCollapseGain() {
    if (D.lt(temp.skillLevel, 2)) return D(0)
    let level = D.sub(temp.skillLevel, 2);
    return D.pow(1.1, level.max(0).pow(0.5)).mul(1e303).add(level)
}

function resetLadder() {
    game.money = D(1e303);
    game.ladder = [];
    makeRow(0);
    updateTemp();
    updateMilestoneStats();
}

function resetRunes() {
    game.gems = D(1e302);
    game.gemGens = D(1e303);
    game.gemUpgs = D(1e203);
    game.runes = [];
    game.runeEquip = [];
    game.scraps = D(1e53);
    updateRuneStats();
}

function resetSigils() {
    game.sigils = [];
    updateSigilEffects();
}

function resetTokens() {
    game.tokens = D(1e259);
    game.tokenUpg = {};
    updateTokenStats();
}

function resetAutomation() {
    game.charge = D(0);
    game.charges = [];
    game.nextCharge = 1;
    game.chargerUpg = {};
    game.autoActive = true;
    game.automators = {};
    updateAllChargerUpgEffects();
    updateAutomationStats();
}


function performCollapse() {
    function act() {
        let gain = getCollapseGain()
        game.collapsium = D.add(game.collapsium ?? 0, gain);
        game.best.bestCollapsium = D.max(game.best.collapsium, game.collapsium);

        if (!game.colUpg[23]) resetTokens();
        if (!game.colUpg[21]) resetAutomation();
        if (!game.colUpg[22]) resetRunes();
        if (!game.colUpg[24]) resetSigils();
        resetLadder();
    }

    if (game.options.autoConfirm.collapse) {
        act();
    } else {
        let desc = document.createElement("div");
        desc.textContent = "Are you sure you want to perform a Collapse?";
    

        let resetList = document.createElement("div");
        resetList.classList.add("reset-list");
        resetList.textContent = "Performing a Collapse will reset the following:";
        desc.append(resetList);

        let list = document.createElement("ul");
        resetList.append(list);

        function addItem(val) {
            let item = document.createElement("li");
            item.textContent = val;
            list.append(item);
        }
        addItem("Money");
        addItem("Buttons");
        addItem("Button Milestones");
        if (!game.colUpg[22]) addItem("All Runes content");
        if (!game.colUpg[24]) addItem("All Sigils content");
        if (!game.colUpg[21]) addItem("All Automation content");
        if (!game.colUpg[23]) addItem("All Tokens content");
        
        desc.append("You will gain ");
        let b = document.createElement("b");
        b.textContent = format(getCollapseGain());
        desc.append(b);
        desc.append(" Collapsium after this Collapse.");
        desc.append(document.createElement("br"));
        desc.append("(based on your current skill level)");

        desc.append(document.createElement("br"));
        desc.append(document.createElement("br"));
    
        let autoCon = document.createElement("input");
        autoCon.id = Math.random();
        autoCon.type = "checkbox";
        autoCon.classList.add("inline-checkbox");
        desc.append(autoCon);
    
        let autoConLabel = document.createElement("label");
        autoConLabel.htmlFor = autoCon.id;
        autoConLabel.textContent = "Don't show this popup on future Collapses";
        desc.append(autoConLabel);
    
        showOverlay("popup", "Perform Collapse?", desc, ["Cancel", "Collapse"], x => { 
            if (x) {
                game.options.autoConfirm.collapse = autoCon.checked;
                act();
            }
        });
    }
}

function buyCollapseUpgrade(id) {
    let data = collapseUpgrades[id];
    let level = game.colUpg[id] ?? 0;
    let cost = data.costAmount(level);
    if (D.gte(game.colPoints, cost) && D.lte(level, data.cap ?? Infinity)) {
        game.colPoints = D.sub(game.colPoints, cost);
        game.colUpg[id] = D.add(level, 1);
        updateCollapseStats();
    }
}
