/**
 * Onboarding narrative: a few screens with short attenuation intro.
 * Player advances with [Next]. After the last slide, game state is initialized and player goes to home location.
 */
// const ONBOARDING_SLIDES = [
//     "Human societies do fragment under stress.<br>But they also re-aggregate far faster and more stubbornly than most fiction tells.",
//     "Anthropologically, humans do not tolerate sustained anarchy well.<br>Even hunter-gatherers had norms, enforcement, leadership rotation.<br>In disasters, people immediately form rules, markets, and informal governance.",
//     "Religions, ideologies, flags, and taboos arise during chaos.<br>People need stories to coordinate behaviour before they need comfort.",
//     "Inventors and entrepreneurs appear faster under collapse, not slower.<br>Scarcity doesn’t kill innovation — it rewards it more brutally",
//     "Nevertheless, that time the collapse has been lasting for a long time.",
//     "Before the fall, a change spread. Not a plague or a war. Something subtler.<br>People kept their minds and their kindness. But they lost the drive to plan beyond tomorrow, to trust systems they couldn't touch, to build for others.",
//     "Infrastructure didn't collapse from malice. It faded from neglect. <br>No explosion. Just… attenuation.",
//     "Settlements survived.<br>Civilisation didn't.",
//     "You are different.<br>You still ask how things connect.<br>Your story begins from The Still Quarter, a place that has learned to be enough."
// ];

const ONBOARDING_SLIDES = [
    "Under stress, societies fragment.<br>But humans rebuild order fast—rules, markets, leaders. Humans do not tolerate sustained anarchy well. Chaos doesn’t last.",
    "So why has this collapse lasted?<br>Why did the world stop recombining?",
    "Before the fall, a program spread—subtle, intentional.<br>People kept intelligence and kindness, but lost the drive for abstraction: long plans, shared systems, building for strangers.",
    "Nothing exploded.<br>Infrastructure didn’t fail from hate—it faded from neglect.<br>Systems died politely.<br>Settlements survived.<br>Civilisation didn't.",
    "You are different.<br>You still feel the missing connections.<br>Your story begins in The Still Quarter—where “enough” became a rule."
];

class OnboardingNarrativeScreen extends BaseScreen {
    initComponents(params) {
        this.slideIndex = params?.slideIndex ?? 0;
        const isFirstSlide = this.slideIndex === 0;

        if (isFirstSlide && this.analyticsManager) {
            this.analyticsManager.onboardingStarted();
        }

        this.components.title = new ScreenTitle({ text: 'The Attenuation' });
        this.components.description = new ScreenDescription({
            text: ONBOARDING_SLIDES[this.slideIndex],
            centered: true
        });

        const isLastSlide = this.slideIndex >= ONBOARDING_SLIDES.length - 1;
        const menuItems = [
            {
                id: 'next',
                label: isLastSlide ? '[ BEGIN ]' : '[ NEXT ]',
                type: 'action',
                action: () => this.onNext()
            },
            {
                id: 'skip',
                label: '[ SKIP INTRO ]',
                type: 'action',
                action: () => this.skipIntro()
            }
        ];

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => item.action && item.action()
        });
    }

    onNext() {
        if (this.slideIndex >= ONBOARDING_SLIDES.length - 1) {
            const state = this.stateManager.getState();
            const playerName = state.player?.name || 'Echo';
            this.stateManager.startGameStateFromOnboarding(playerName);
            this.navigationManager.navigateTo({ screen: 'Location', params: { id: 'still_quarter' } });
            this.eventBus.emit('log', { text: `You are in the Still Quarter.`, type: 'system' });
        } else {
            this.navigationManager.navigateTo({
                screen: 'OnboardingNarrative',
                params: { slideIndex: this.slideIndex + 1 }
            });
        }
    }

    skipIntro() {
        if (this.analyticsManager) {
            this.analyticsManager.onboardingSkipped();
        }
        const state = this.stateManager.getState();
        const playerName = state.player?.name || 'Echo';
        this.stateManager.startGameStateFromOnboarding(playerName);
        // Unlock Neon Nexus and mark world map intro as seen (skip intro → attributes → world map, so never show intro)
        const updatedState = this.stateManager.getState();
        const locations = updatedState.unlocked_locations || [];
        const updates = { has_seen_world_map_intro: true };
        if (!locations.includes('neon_nexus')) {
            updates.unlocked_locations = [...locations, 'neon_nexus'];
        }
        this.stateManager.updateState(updates);
        this.navigationManager.navigateTo({ screen: 'NewGamePlayerAttributes' });
    }

    handleInput(input) {
        if (this.components.menu && input.type === 'COMMAND' && input.command === 'SELECT') {
            this.components.menu.handleInput(input);
            return;
        }
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}
