/**
 * Onboarding narrative: a few screens with short attenuation intro.
 * Player advances with [Next]. After the last slide, game state is initialized and player goes to home location.
 */
const ONBOARDING_SLIDES = [
    "Before the fall, a change spread — not a plague or a war. Something subtler. People kept their minds and their kindness. But they lost the drive to plan beyond tomorrow, to trust systems they couldn't touch, to build for others. No explosion. Just… attenuation.",
    "Infrastructure didn't collapse from malice. It faded from neglect. When maintenance feels pointless and innovation feels indulgent, grids fail, networks simplify. Civilisation didn't end in fire. It stopped caring.",
    "Settlements survived. Civilisation didn't. People are not hostile to reunion. They simply cannot feel its necessity. The world entered limbo.",
    "You are different. You still ask how things connect. You still feel the pull of unfinished systems. Your story begins at home — in a place that has learned to be enough."
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
