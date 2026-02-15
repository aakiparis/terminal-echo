/**
 * Battle Screen: turn-based combat when entering a dialogue node with mode "battle".
 * Params: locationId, npcId, battleNodeKey, enemyId
 * One round = creature turn then player turn; [ Continue ] advances. Victory applies outcomes and navigates to first destination.
 */
class BattleScreen extends BaseScreen {
    // Luck table (L 1, 5, 10): self, miss, hit, crit (percent) — matches damage-probabilities illustration
    static LUCK_TABLE = {
        "luck_1": { self: 15, miss: 40, hit: 45, crit: 0 },
        "luck_2": { self: 10, miss: 40, hit: 50, crit: 0 },
        "luck_3": { self: 10, miss: 35, hit: 50, crit: 5 },
        "luck_4": { self: 10, miss: 30, hit: 55, crit: 5 },
        "luck_5": { self: 5, miss: 30, hit: 55, crit: 10 },
        "luck_6": { self: 5, miss: 25, hit: 60, crit: 10 },
        "luck_7": { self: 5, miss: 20, hit: 65, crit: 10 },
        "luck_8": { self: 0, miss: 20, hit: 65, crit: 15 },
        "luck_9": { self: 0, miss: 15, hit: 70, crit: 15},
        "luck_10": { self: 0, miss: 10, hit: 70, crit: 20 }
    }

    enter(params) {
        this.battleParams = params || this.battleParams;
        if (this.creatureHp === undefined) {
            this.initBattleState(this.battleParams);
            if (this.enemyData) {
                this.eventBus.emit('log', { text: `Combat started: ${this.enemyName}`, type: 'combat' });
                if (this.analyticsManager) this.analyticsManager.combatStarted(this.enemyName);
                // Run creature's first turn after the battle screen is painted so log and damage animation are visible
                const runFirstCreatureTurn = () => {
                    this.resolveCreatureTurn();
                    if (this.creatureHp <= 0) {
                        this.victory = true; // creature killed itself (self-harm)
                    } else {
                        this.isPlayerTurn = true; // next: player's turn
                    }
                    this.refreshView();
                    const state = this.stateManager.getState();
                    if ((state.player?.hp ?? 0) <= 0) {
                        this.defeat = true;
                        this.stateManager.updateState({ player: { ...state.player, hp: 0 } });
                        this.eventBus.emit('gameOver');
                        this.refreshView();
                    }
                };
                super.enter(this.battleParams);
                requestAnimationFrame(() => runFirstCreatureTurn());
                return;
            }
        }
        super.enter(this.battleParams);
    }

    initBattleState(params) {
        const enemy = typeof ENEMIES_DATA !== 'undefined' && ENEMIES_DATA[params.enemyId];
        if (!enemy) {
            console.error(`BattleScreen: enemy "${params.enemyId}" not found in ENEMIES_DATA`);
            this.navigationManager.goBack();
            return;
        }
        this.creatureHp = enemy.health;
        this.creatureMaxHp = enemy.health;
        this.enemyName = enemy.name;
        this.enemyData = enemy;
        this.combatLog = [];
        this.victory = false;
        this.defeat = false;
        this.isPlayerTurn = false; // creature acts first, then we set true after first turn
    }

    initComponents(params) {
        if (!this.enemyData) return;

        this.components.title = new ScreenTitle({
            text: `COMBAT: ${this.enemyName} — ${this.creatureHp}/${this.creatureMaxHp} HP`
        });

        const logText = this.combatLog.length
            ? this.combatLog.slice(-15).join('<br>')
            : '—';
        this.components.combatLog = new ScreenDescription({ text: '<strong>Combat log</strong><br>' + logText });

        const menuItems = [];
        if (this.victory) {
            menuItems.push({
                id: 'continue',
                label: '[VICTORY]',
                type: 'action',
                action: () => this.onVictoryContinue()
            });
        } else if (this.defeat) {
            menuItems.push({ id: 'defeat', label: 'Defeat.', type: 'separator' });
        } else {
            if (this.isPlayerTurn) {
                menuItems.push({
                    id: 'attack',
                    label: '[ATTACK]',
                    type: 'action',
                    action: () => this.doPlayerAttack()
                });
            } else {
                menuItems.push({
                    id: 'enemy_turn',
                    label: `[${this.enemyName} turn]`,
                    type: 'action',
                    action: () => this.doCreatureTurn()
                });
            }
        }

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action && !item.disabled) item.action();
            }
        });
    }

    getLuckProbabilities(luck) {
        const L = BattleScreen.LUCK_TABLE;
        const l = Math.max(1, Math.min(10, Math.floor(Number(luck)) || 1));
        const row = L["luck_" + l];
        if (!row) return { self: 0.1, miss: 0.35, hit: 0.45, crit: 0.1 };
        return {
            self: row.self / 100,
            miss: row.miss / 100,
            hit: row.hit / 100,
            crit: row.crit / 100
        };
    }

    rollOutcome(probs) {
        const r = Math.random();
        if (r < probs.self) return 'self';
        if (r < probs.self + probs.miss) return 'miss';
        if (r < probs.self + probs.miss + probs.hit) return 'hit';
        return 'crit';
    }

    rollDamage(minD, maxD, isCrit) {
        const min = Math.floor(minD);
        const max = Math.floor(maxD);
        if (isCrit) return Math.max(1, Math.floor(max * 1.5));
        if (max <= min) return min;
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    resolveCreatureTurn() {
        const probs = this.getLuckProbabilities(this.enemyData.lck ?? 1);
        const outcome = this.rollOutcome(probs);
        const minD = this.enemyData.minDamage ?? 1;
        const maxD = this.enemyData.maxDamage ?? 1;
        const name = this.enemyName;

        if (outcome === 'hit') {
            const d = this.rollDamage(minD, maxD, false);
            const state = this.stateManager.getState();
            const newHp = Math.max(0, (state.player.hp ?? 0) - d);
            this.stateManager.updateState({ player: { ...state.player, hp: newHp } });
            this.combatLog.push(`${name} does ${d} damage`);
            if (d > 0) this.eventBus.emit('playerLostHp', { amount: -d });
        } else if (outcome === 'crit') {
            const d = this.rollDamage(minD, maxD, true);
            const state = this.stateManager.getState();
            const newHp = Math.max(0, (state.player.hp ?? 0) - d);
            this.stateManager.updateState({ player: { ...state.player, hp: newHp } });
            this.combatLog.push(`${name} does ${d} critical damage`);
            if (d > 0) this.eventBus.emit('playerLostHp', { amount: -d });
        } else if (outcome === 'miss') {
            this.combatLog.push(`${name} misses you`);
        } else {
            // Self-harm: damage in [1, minDamage] for creature
            const d = this.rollDamage(1, minD, false);
            this.creatureHp = Math.max(0, this.creatureHp - d);
            this.combatLog.push(`${name} hurts itself for ${d} damage`);
            if (this.creatureHp <= 0) this.combatLog.push(`${name} dies`);
        }
    }

    resolvePlayerTurn() {
        const state = this.stateManager.getState();
        const str = state.player?.str ?? 1;
        const minD = Math.floor(1 + str * 0.7);
        const maxD = Math.max(minD, Math.floor(1 + str * 1.3));
        const probs = this.getLuckProbabilities(state.player?.lck ?? 1);
        const outcome = this.rollOutcome(probs);
        const name = this.enemyName;

        if (outcome === 'hit') {
            const d = this.rollDamage(minD, maxD, false);
            this.creatureHp = Math.max(0, this.creatureHp - d);
            this.combatLog.push(`You damage the ${name.toLowerCase()} by ${d} points`);
            if (this.creatureHp <= 0) this.combatLog.push(`${name} dies`);
        } else if (outcome === 'crit') {
            const d = this.rollDamage(minD, maxD, true);
            this.creatureHp = Math.max(0, this.creatureHp - d);
            this.combatLog.push(`You do ${d} critical damage`);
            if (this.creatureHp <= 0) this.combatLog.push(`${name} dies`);
        } else if (outcome === 'miss') {
            this.combatLog.push(`You miss the ${name.toLowerCase()}`);
        } else {
            // Self-harm: damage in [1, str*0.7] (i.e. [1, player min damage])
            const d = this.rollDamage(1, minD, false);
            const newHp = Math.max(0, (state.player.hp ?? 0) - d);
            this.stateManager.updateState({ player: { ...state.player, hp: newHp } });
            this.combatLog.push(`You hurt yourself for ${d} damage`);
            if (d > 0) this.eventBus.emit('playerLostHp', { amount: -d });
        }
    }

    doCreatureTurn() {
        if (this.victory || this.defeat) return;
        this.resolveCreatureTurn();
        if (this.creatureHp <= 0) {
            this.victory = true; // creature killed itself (self-harm)
        } else {
            this.isPlayerTurn = true; // next: player's turn
        }
        this.refreshView();
        const state = this.stateManager.getState();
        if ((state.player?.hp ?? 0) <= 0) {
            this.defeat = true;
            this.stateManager.updateState({ player: { ...state.player, hp: 0 } });
            this.eventBus.emit('gameOver');
            this.refreshView();
        }
    }

    doPlayerAttack() {
        if (this.victory || this.defeat) return;
        this.resolvePlayerTurn();
        this.isPlayerTurn = false; // next: creature's turn
        if (this.creatureHp <= 0) this.victory = true;
        const state = this.stateManager.getState();
        if ((state.player?.hp ?? 0) <= 0) {
            this.defeat = true;
            this.eventBus.emit('gameOver');
        }
        this.refreshView();
    }

    refreshView() {
        this.initComponents(this.battleParams);
        if (!this.element) return;
        this.element.innerHTML = '';
        Object.values(this.components).forEach(component => {
            const el = component.render();
            if (el) this.element.appendChild(el);
        });
    }

    onVictoryContinue() {
        const params = this.battleParams;
        const node = NPC_DATA[params.locationId]?.[params.npcId]?.dialogue_graph?.[params.battleNodeKey];
        if (node?.outcomes?.length) {
            this.processOutcomes(node.outcomes);
        }
        const dests = node?.destination_nodes || [];
        const npcData = NPC_DATA[params.locationId]?.[params.npcId];
        const graph = npcData?.dialogue_graph || {};
        for (let i = 0; i < dests.length; i++) {
            const dest = dests[i];
            const targetNode = graph[dest.node_id];
            if (!targetNode) continue;
            if (!this.checkConditions(targetNode?.conditions || targetNode?.condition)) continue;
            if (dest.node_id === 'trade') {
                this.eventBus.emit('navigate', { screen: 'Trade', params: { locationId: params.locationId, npcId: params.npcId } });
                return;
            }
            if (dest.node_id === 'end') {
                this.navigationManager.navigateTo({ screen: 'Location', params: { id: params.locationId } });
                return;
            }
            this.navigationManager.navigateTo({
                screen: 'Dialogue',
                params: { locationId: params.locationId, npcId: params.npcId, nodeKey: dest.node_id }
            });
            return;
        }
        this.navigationManager.navigateTo({ screen: 'Location', params: { id: params.locationId } });
    }

    processOutcomes(outcomes) {
        const state = this.stateManager.getState();
        let playerUpdates = {};
        let rootUpdates = {};
        const questsUpdates = { ...(state.quests || {}) };
        let accumulatedUnlockedNpcs = { ...(state.unlocked_npcs || {}) };
        let accumulatedNewlyUnlockedNpcs = { ...(state.newly_unlocked_npcs || {}) };

        outcomes.forEach(outcome => {
            switch (outcome.type) {
                case 'STAT_CHANGE':
                    playerUpdates[outcome.stat] = (state.player[outcome.stat] || 0) + outcome.value;
                    this.eventBus.emit('log', { text: `[${outcome.stat.toUpperCase()} changed by ${outcome.value}]`, type: 'system' });
                    if (outcome.stat === 'hp' && outcome.value < 0) {
                        this.eventBus.emit('playerLostHp', { amount: outcome.value });
                    }
                    break;
                case 'REPUTATION_CHANGE':
                    playerUpdates.reputation = (state.player.reputation || 0) + outcome.value;
                    this.eventBus.emit('log', { text: `[Reputation changed by ${outcome.value}]`, type: 'system' });
                    break;
                case 'ITEM_GAIN': {
                    const qty = Math.max(1, outcome.quantity || 1);
                    playerUpdates.inventory = StateManager.addInventoryItem(state.player.inventory || [], outcome.item_id, qty);
                    const itemName = typeof ITEMS_DATA !== 'undefined' && ITEMS_DATA[outcome.item_id]?.name || outcome.item_id;
                    this.eventBus.emit('log', { text: `[Received ${qty > 1 ? qty + ' ' : ''}${itemName}]`, type: 'system' });
                    break;
                }
                case 'ITEM_LOSE': {
                    const loseQty = Math.max(1, outcome.quantity || 1);
                    const currentQty = StateManager.getInventoryQuantity(state.player.inventory || [], outcome.item_id);
                    if (currentQty > 0) {
                        const remove = Math.min(loseQty, currentQty);
                        playerUpdates.inventory = StateManager.removeInventoryItem(state.player.inventory || [], outcome.item_id, remove);
                        const itemName = typeof ITEMS_DATA !== 'undefined' && ITEMS_DATA[outcome.item_id]?.name || outcome.item_id;
                        this.eventBus.emit('log', { text: `[Gave ${remove > 1 ? remove + ' ' : ''}${itemName}]`, type: 'system' });
                    }
                    break;
                }
                case 'LOCATION_UNLOCK':
                    if (!state.unlocked_locations.includes(outcome.location_id)) {
                        rootUpdates.unlocked_locations = [...state.unlocked_locations, outcome.location_id];
                        rootUpdates.has_new_location_unlocked = true;
                        rootUpdates.newly_unlocked_location_id = outcome.location_id;
                        const locName = typeof LOCATION_DATA !== 'undefined' && LOCATION_DATA[outcome.location_id]?.name || outcome.location_id;
                        this.eventBus.emit('log', { text: `[New location unlocked: ${locName}]`, type: 'system' });
                    }
                    break;
                case 'NPC_UNLOCK': {
                    const locationNpcs = accumulatedUnlockedNpcs[outcome.location_id] || [];
                    if (!locationNpcs.includes(outcome.npc_id)) {
                        accumulatedUnlockedNpcs[outcome.location_id] = [...locationNpcs, outcome.npc_id];
                        const newlyList = accumulatedNewlyUnlockedNpcs[outcome.location_id] || [];
                        if (!newlyList.includes(outcome.npc_id)) {
                            accumulatedNewlyUnlockedNpcs[outcome.location_id] = [...newlyList, outcome.npc_id];
                        }
                        const npcData = NPC_DATA[outcome.location_id]?.[outcome.npc_id];
                        const npcName = npcData?.name || outcome.npc_id;
                        this.eventBus.emit('log', { text: `[Unlocked: ${npcName}]`, type: 'system' });
                    }
                    break;
                }
                case 'QUEST_SET_STAGE':
                    questsUpdates[outcome.quest_id] = { stage: outcome.stage };
                    const questTitle = typeof QUEST_DATA !== 'undefined' && QUEST_DATA[outcome.quest_id]?.title || outcome.quest_id;
                    this.eventBus.emit('log', { text: `[Quest "${questTitle}" updated]`, type: 'system' });
                    if (outcome.stage === 100 && state.quest_completion_order) {
                        rootUpdates.quest_completion_order = [...(state.quest_completion_order || []), outcome.quest_id];
                    }
                    break;
                default:
                    break;
            }
        });

        if (Object.keys(playerUpdates).length > 0) {
            this.stateManager.updateState({ player: { ...state.player, ...playerUpdates } });
        }
        if (Object.keys(questsUpdates).length > 0) rootUpdates.quests = questsUpdates;
        if (Object.keys(accumulatedUnlockedNpcs).length > 0) rootUpdates.unlocked_npcs = accumulatedUnlockedNpcs;
        rootUpdates.newly_unlocked_npcs = accumulatedNewlyUnlockedNpcs;
        if (Object.keys(rootUpdates).length > 0) this.stateManager.updateState(rootUpdates);
    }

    checkConditions(conditions) {
        if (!conditions) return true;
        if (conditions.condition && Array.isArray(conditions.condition)) {
            const op = conditions.op || 'AND';
            const results = conditions.condition.map(c => this.checkSingleCondition(c));
            return op === 'OR' ? results.some(Boolean) : results.every(Boolean);
        }
        return this.checkSingleCondition(conditions);
    }

    checkSingleCondition(condition) {
        if (!condition || !condition.type) return true;
        const state = this.stateManager.getState();
        switch (condition.type) {
            case 'STAT_CHECK':
                return (state.player[condition.stat] || 0) >= condition.min;
            case 'QUEST_STAGE':
                const stage = state.quests?.[condition.quest_id]?.stage ?? 0;
                const op = condition.op || 'eq';
                if (op === 'eq') return stage === condition.stage;
                if (op === 'neq') return stage !== condition.stage;
                if (op === 'gte') return stage >= condition.stage;
                return stage === condition.stage;
            case 'HAVE_ITEM':
                return StateManager.getInventoryQuantity(state.player.inventory || [], condition.item_id) >= Math.max(1, condition.quantity || 1);
            case 'NO_ITEM':
                return StateManager.getInventoryQuantity(state.player.inventory || [], condition.item_id) === 0;
            default:
                return true;
        }
    }

    exit() {
        this.creatureHp = undefined;
        this.creatureMaxHp = undefined;
        this.combatLog = undefined;
        this.victory = undefined;
        this.defeat = undefined;
        this.isPlayerTurn = undefined;
        this.enemyData = undefined;
        this.battleParams = undefined;
        super.exit();
    }

    handleInput(input) {
        if (this.components.menu) this.components.menu.handleInput(input);
    }
}
