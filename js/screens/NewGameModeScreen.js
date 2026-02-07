class NewGameModeScreen extends BaseScreen {
    // THIS METHOD IS CRITICAL. It creates the components for this screen.
    initComponents() {
        this.components.title = new ScreenTitle({ text: 'Select Game Mode' });
        this.components.description = new ScreenDescription(
            { text: 'Terminal Echo Scripted mode - a hand-curated story<br>Indefinite Terminal Echo - In-flight AI-Generated game', centered: false }
        );
        
        const menuItems = [
            { id: 'scripted', label: 'Scripted', type: 'navigation', action: () => this.selectMode('scripted') },
            { 
                id: 'ai-generated', 
                label: 'Indefinite ( waiting list )', 
                type: 'action', 
                action: () => this.showWaitingListPopup()
            },
            {
                id: 'separator',
                label: `------`,
                type: 'separator'
            },
            { id: 'back', label: '[ BACK ]', type: 'navigation', action: () => this.navigationManager.navigateTo({ screen: 'MainMenu' }) },
        ];

        this.components.menu = new Menu({
            items: menuItems,
            onSelect: (item) => {
                if (item.action) item.action();
            }
        });
    }
    
    showWaitingListPopup() {
        // Create a custom popup with email input
        const emailPopup = new PopupComponent({
            eventBus: this.eventBus,
            title: 'JOIN WAITING LIST',
            message: 'Indefinite mode is coming soon! Enter your email to be notified when AI-generated adventures are available.',
            menuItems: [
                {
                    id: 'email_input',
                    label: 'Email:',
                    type: 'input',
                    value: ''
                },
                {
                    id: 'submit_email',
                    label: '[ SUBMIT ]',
                    type: 'action',
                    action: () => {
                        const emailInput = emailPopup.menu.element?.querySelector('#email_input');
                        const email = emailInput?.value?.trim();
                        
                        if (!email || !email.includes('@')) {
                            this.eventBus.emit('log', { text: 'Please enter a valid email address.', type: 'error' });
                            return;
                        }
                        
                        // Submit to PostHog survey API
                        const surveyId = '019c068e-3e42-0000-188b-9dec52c98e15';
                        if (this.analyticsManager) {
                            this.analyticsManager.waitlistSubmitted(email, surveyId);
                        } else {
                            this.submitEmailToPostHogSurvey(email, surveyId);
                        }
                        
                        this.navigationManager.closePopup();
                        this.eventBus.emit('log', { text: 'Thank you! You\'ve been added to the waiting list.', type: 'system' });
                    }
                },
                {
                    id: 'cancel',
                    label: '[ CANCEL ]',
                    type: 'action',
                    action: () => {
                        this.navigationManager.closePopup();
                    }
                }
            ]
        });
        
        this.navigationManager.activePopup = emailPopup;
        this.navigationManager.renderCurrentScreen();
        
        // Focus the email input after a short delay
        setTimeout(() => {
            const emailInput = emailPopup.menu.element?.querySelector('#email_input');
            if (emailInput) {
                emailInput.focus();
            }
        }, 100);
    }
    
    submitEmailToPostHogSurvey(email, surveyId) {
        if (typeof window === 'undefined' || !window.posthog) {
            console.warn('[NewGameModeScreen] PostHog not available for email submission');
            return;
        }
        
        try {
            // According to PostHog survey docs, each answer should be sent as:
            //   $survey_response_<question_id>: <answer>
            // and included in a "survey sent" event with $survey_id.

            const questionId = '9955f792-0ba6-43d3-8fa4-05caaa39fc6c'; // Your email question ID
            const responseKey = `$survey_response_${questionId}`;

            const props = {
                $survey_id: surveyId,
                [responseKey]: email,
                email: email,
                survey_name: 'Waiting list of Indefinite game mode'
            };

            // Capture the standardized survey event
            window.posthog.capture('survey sent', props);
            
            // Also capture as a custom event for easier querying if desired
            window.posthog.capture('indefinite_mode_waiting_list_signup', {
                email: email,
                survey_id: surveyId,
                timestamp: new Date().toISOString()
            });
            
            // Store email in PostHog person properties for easy access
            window.posthog.identify(window.posthog.get_distinct_id(), {
                waiting_list_email: email,
                indefinite_mode_waiting_list: true
            });
            
            console.log('[NewGameModeScreen] Email captured and sent to PostHog:', email);
        } catch (error) {
            console.error('[NewGameModeScreen] Error submitting email to PostHog:', error);
        }
    }

    selectMode(mode) {
        // this.eventBus.emit('log', { text: 'Scripted game mode' });
        this.stateManager.updateState({ gameMode: mode });
        this.navigationManager.navigateTo({ screen: 'NewGamePlayerName' });
    }

    // This method handles arrow keys and enter.
    handleInput(input) {
        // It must delegate the input to the menu component.
        if (this.components.menu) {
            this.components.menu.handleInput(input);
        }
    }
}