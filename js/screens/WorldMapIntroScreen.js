/**
 * Shown the first time the player opens the World Map.
 * Tells the story about the world and requires attribute allocation before continuing to the map.
 */
const WORLD_MAP_INTRO_TEXT = "Beyond your home, the world is a patchwork of settlements and ruins. Some places still hum with old systems; others have gone quiet. You've felt the signal. You know where to go. Before you travel further, choose how you're built — strength, intelligence, or luck.";

class WorldMapIntroScreen extends BaseScreen {
    initComponents() {
        this.components.title = new ScreenTitle({ text: 'The World Awaits' });
        this.components.description = new ScreenDescription({
            text: WORLD_MAP_INTRO_TEXT,
            centered: true
        });

        const menuItems = [
            {
                id: 'pick-stats',
                label: '[ PICK YOUR STATS ]',
                type: 'action',
                action: () => this.goToAttributes()
            }
        ];

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => item.action && item.action()
        });
    }

    goToAttributes() {
        this.stateManager.updateState({ has_seen_world_map_intro: true });
        this.navigationManager.navigateTo({
            screen: 'NewGamePlayerAttributes',
            params: { fromOnboarding: true }
        });
    }

    handleInput(input) {
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}
