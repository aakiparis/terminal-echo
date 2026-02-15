class AnalyticsManager {
    constructor() {
        this.isAvailable = typeof window !== 'undefined' && window.posthog;
    }

    /**
     * Captures a PostHog event if available
     * @param {string} eventName - The name of the event
     * @param {object} properties - Event properties
     */
    capture(eventName, properties = {}) {
        if (!this.isAvailable) {
            console.log(`[Analytics] Event: ${eventName}`, properties);
            return;
        }

        try {
            window.posthog.capture(eventName, properties);
        } catch (error) {
            console.error(`[Analytics] Error capturing event ${eventName}:`, error);
        }
    }

    /**
     * Onboarding started (first narrative screen entered)
     */
    onboardingStarted() {
        this.capture('onboarding_started', {});
    }

    /**
     * Onboarding intro skipped (player went straight to attribute allocation)
     */
    onboardingSkipped() {
        this.capture('onboarding_skipped', {});
    }

    /**
     * First quest completed (e.g. headroom in Still Quarter)
     */
    firstQuestCompleted(questId = '') {
        this.capture('first_quest_completed', { quest_id: questId });
    }

    /**
     * Game started — fired when the player enters the World Map for the first time (after onboarding).
     * @param {string} gameMode - The game mode selected (e.g., 'scripted')
     * @param {object} playerStats - Initial player stats
     */
    gameStarted(gameMode, playerStats = {}) {
        this.capture('game_started', {
            game_mode: gameMode,
            player_name: playerStats?.name,
            str: playerStats?.str,
            int: playerStats?.int,
            lck: playerStats?.lck
        });
    }

    /**
     * Navigation to world map
     */
    navigatedToWorldMap() {
        this.capture('navigation_world_map');
    }

    /**
     * Navigation to location
     * @param {string} locationId - The location ID
     */
    navigatedToLocation(locationId) {
        this.capture('navigation_location', {
            location_id: locationId
        });
    }

    /**
     * Quest update event
     * @param {string} questId - The quest ID
     * @param {number} stage - The quest stage
     */
    questUpdated(questId, stage) {
        this.capture('quest_update', {
            quest_id: questId,
            stage: stage
        });
    }

    /**
     * Dialogue screen event
     * @param {string} npcId - The NPC ID
     * @param {string} nodeType - 'start' or 'return'
     */
    dialogueScreen(npcId, nodeType) {
        this.capture('dialogue_screen', {
            npc_id: npcId,
            node_type: nodeType
        });
    }

    /**
     * Buy item event
     * @param {string} itemId - The item ID
     */
    buyItem(itemId) {
        this.capture('buy_item', {
            item_id: itemId
        });
    }

    /**
     * Sell item event
     * @param {string} itemId - The item ID
     */
    sellItem(itemId) {
        this.capture('sell_item', {
            item_id: itemId
        });
    }

    /**
     * Waitlist submitted event
     * @param {string} email - The email address
     * @param {string} surveyId - The survey ID
     */
    waitlistSubmitted(email, surveyId) {
        // This method maintains the existing PostHog survey integration
        // while also sending a simplified event
        if (!this.isAvailable) {
            console.log(`[Analytics] Waitlist submitted: ${email}`);
            return;
        }

        try {
            const questionId = '9955f792-0ba6-43d3-8fa4-05caaa39fc6c';
            const responseKey = `$survey_response_${questionId}`;

            const props = {
                $survey_id: surveyId,
                [responseKey]: email,
                email: email,
                survey_name: 'Waiting list of Indefinite game mode'
            };

            // Capture the standardized survey event
            window.posthog.capture('survey sent', props);
            
            // Also capture as a custom event for easier querying
            window.posthog.capture('indefinite_mode_waiting_list_signup', {
                email: email,
                survey_id: surveyId,
                timestamp: new Date().toISOString()
            });
            
            // Store email in PostHog person properties
            window.posthog.identify(window.posthog.get_distinct_id(), {
                waiting_list_email: email,
                indefinite_mode_waiting_list: true
            });

            // Send simplified event
            this.capture('waitlist_submitted', {
                email: email,
                survey_id: surveyId
            });
        } catch (error) {
            console.error('[Analytics] Error submitting waitlist:', error);
        }
    }

    /**
     * Game over event
     */
    gameOver() {
        this.capture('game_over');
    }

    /**
     * Combat started — fired when the player enters a battle.
     * @param {string} enemyName - Display name of the enemy (e.g. "Rat")
     */
    combatStarted(enemyName) {
        this.capture('combat_started', { enemy_name: enemyName });
    }
}
