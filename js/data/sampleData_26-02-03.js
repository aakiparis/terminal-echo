/*
 * Terminal Echo - Sample Game Data
 *
 * This file contains interconnected game data for two locations:
 * - Rusthaven: A settlement struggling with a mysterious illness.
 * - The Echo Mines: A dangerous, abandoned mine that may hold the key to the illness.
 *
 * Central Story: "The Water Contamination"
 * The water from Rusthaven's purifier is making people sick. The story unfolds through three lenses:
 * 1.  The Leadership Angle (Kai & Anya): A technical and logistical problem threatening Rusthaven's stability.
 * 2.  The Commercial Angle (Silas & Jax): A crisis that presents financial opportunities and risks.
 * 3.  The Mystic/Survivor Angle (Elara & Ronan): A spiritual or mutational crisis with deeper, more sinister roots.
 *
 * The player's investigation will uncover a conspiracy involving a hidden research project, forcing moral choices that will determine the fate of both locations.
 */

const LOCATION_DATA = {
    "rusthaven": {
        "name": "Rusthaven",
        "description": "A small, dusty settlement huddled around a large, humming water purifier. The air is thick with the smell of ozone and damp earth, a testament to the life-giving machine at its heart.",
        "npcs": ["kai_leader", "anya_tech", "silas_merchant", "elara_mystic", "old_ben_civilian"]
    },
    "echo_mines": {
        "name": "The Echo Mines",
        "description": "The skeletal remains of a pre-catastrophe mining operation. A strange, low hum emanates from deep within, and the rocks themselves seem to pulse with a faint, sickly green light.",
        "npcs": ["jax_scavenger", "ronan_hermit", "mina_guard", "cora_biologist", "automated_sentry"]
    }
};

const NPC_DATA = {
    "rusthaven": {
        "kai_leader": {
            "name": "Foreman Kai",
            "type": "npc",
            "description": "The leader of Rusthaven. His face is a mask of weary resolve, his hands calloused from years of work and worry. He carries the weight of the settlement on his shoulders.",
            "is_merchant": false,
            "dialogue_graph": {
                "start": {
                    "response": "Welcome to Rusthaven. I'm Kai, the foreman here. State your business. We have enough troubles without adding strangers to the mix.",
                    "destination_nodes": [
                        { "node_id": "story_rusthaven_1" },
                        { "node_id": "quest_purifier_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You're back. Has something changed?",
                    "destination_nodes": [
                        { "node_id": "story_rusthaven_1", "prompt_replacement": "Remind me about this place." },
                        { "node_id": "quest_purifier_intro" }, // Guardrail #2: Quest is always available if not started.
                        { "node_id": "quest_purifier_reminder" }, // Guardrail #3: Reminder for active quest.
                        { "node_id": "quest_purifier_complete_check" }, // Guardrail #3: Check for completion.
                        { "node_id": "quest_elara_followup" }, // Appears after Elara's quest progresses.
                        { "node_id": "end" }
                    ]
                },
                "story_rusthaven_1": {
                    "prompt": "Tell me about Rusthaven.",
                    "response": "This settlement is built on one thing: that purifier. It gives us clean water, which means it gives us life. My job is to make sure it keeps running and our people are safe. Lately, that's been getting harder.",
                    "destination_nodes": [
                        { "node_id": "story_rusthaven_2" }
                    ]
                },
                "story_rusthaven_2": {
                    "prompt": "Harder how?",
                    "response": "People are getting sick. A strange fatigue, a tremor in their hands. They're calling it 'The Shakes.' Anya, our technician, thinks it's the water. But the purifier is running perfectly. Something else is going on.",
                    "destination_nodes": [
                        { "node_id": "quest_purifier_intro", "prompt_replacement": "Maybe I can help investigate." },
                        { "node_id": "end" }
                    ]
                },
                "quest_purifier_intro": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "the_shakes", "stage": 0 }] },
                    "prompt": "You need someone to look into this sickness.",
                    "response": "I do. Anya's analysis is useless without a baseline. I need a water sample from the source, before it even reaches our intake pipes. That means going to the Echo Mines. It's dangerous, but it's the only way to know what we're dealing with.",
                    "destination_nodes": [
                        { "node_id": "quest_purifier_accept" },
                        { "node_id": "quest_purifier_details" },
                        { "node_id": "quest_purifier_reject" }
                    ]
                },
                "quest_purifier_details": {
                    "prompt": "What's so dangerous about the Echo Mines?",
                    "response": "The place is unstable. Strange energy readings, mutated creatures... and scavengers who'd kill you for your boots. The aquifer we need is deep inside. Get in, get the sample, get out.",
                    "destination_nodes": [
                        { "node_id": "quest_purifier_accept" },
                        { "node_id": "quest_purifier_reject" }
                    ]
                },
                "quest_purifier_accept": {
                    "prompt": "I'll get your sample.",
                    "response": "Good. You've got guts, I'll give you that. Here is an empty flask. Be careful. The fate of this town could rest on what you find.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "the_shakes", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "empty_flask" },
                        { "type": "LOCATION_UNLOCK", "location_id": "echo_mines" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_purifier_reject": {
                    "prompt": "Sounds too risky for me.",
                    "response": "Then you're no use to me. Don't let the door hit you on the way out.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_purifier_reminder": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "the_shakes", "stage": 1 }] },
                    "prompt": "About that water sample...",
                    "response": "Every hour you waste is another hour the sickness spreads. Have you been to the Echo Mines yet?",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_purifier_complete_check": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "mine_water_sample" }] },
                    "prompt": "I have the water sample from the mines.",
                    "response": "You got it! Thank the spirits. Give it here. I'll get this to Anya immediately. This is a huge step. You've done this town a great service. Here, for your trouble.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "the_shakes", "stage": 2 },
                        { "type": "ITEM_LOSE", "item_id": "mine_water_sample" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 150 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 100 },
                        { "type": "REPUTATION_CHANGE", "value": 10 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_elara_followup": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 2 }] },
                    "prompt": "Elara told me about a hidden vent.",
                    "response": "A vent? Pumping waste into the aquifer? That... that explains everything. The purifier can't filter what it's not designed for. That woman... she may be a mystic, but she sees things we don't. Thank you. Now we have a real target.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "the_culprit", "stage": 1 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "end": {
                    "prompt": "I'll be going.",
                    "response": "Stay safe out there."
                }
            }
        },
        "anya_tech": {
            "name": "Anya",
            "type": "npc",
            "description": "Rusthaven's sharp, pragmatic technician. She's perpetually surrounded by diagnostic equipment, her brow furrowed in concentration as she analyzes readings from the purifier.",
            "is_merchant": false,
            "dialogue_graph": {
                 "start": {
                    "response": "Don't touch anything. This equipment is calibrated. I'm Anya. Unless you know how to re-sequence a hydro-filter, I'm busy.",
                    "destination_nodes": [
                        { "node_id": "story_purifier_1" },
                        { "node_id": "quest_data_check_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You again. Did you need something, or are you just admiring the machinery?",
                    "destination_nodes": [
                        { "node_id": "story_purifier_1", "prompt_replacement": "Could you explain the purifier again?" },
                        { "node_id": "quest_data_check_intro" }, // Quest offer
                        { "node_id": "quest_data_check_results" }, // Post-Kai quest dialogue
                        { "node_id": "quest_cora_data_check" }, // Check for Cora's data
                        { "node_id": "quest_cora_final_choice" }, // Moral choice node
                        { "node_id": "end" }
                    ]
                },
                "story_purifier_1": {
                    "prompt": "What's wrong with the purifier?",
                    "response": "Nothing! That's the problem. Diagnostics are green across the board. The machine is filtering out all known biological and chemical contaminants. And yet, people are getting sick.",
                    "destination_nodes": [
                        { "node_id": "story_purifier_2" }
                    ]
                },
                "story_purifier_2": {
                    "prompt": "So what's the cause?",
                    "response": "The laws of physics don't just stop working. The variable isn't the machine; it's the source water. There's an unknown factor, something I can't test for because I don't know what it is. It's infuriating.",
                    "destination_nodes": [
                        { "node_id": "quest_data_check_intro", "prompt_replacement": "Is there any way I can help?" },
                        { "node_id": "end" }
                    ]
                },
                "quest_data_check_intro": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "the_shakes", "stage": 0 }] },
                    "prompt": "You seem to need more data.",
                    "response": "I'm drowning in useless data. What I need is a control sample. Something from the source aquifer in the Echo Mines. Kai is too cautious to send anyone. He's afraid of what we'll find.",
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "I'll talk to Kai about it." }
                    ]
                },
                "quest_data_check_results": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "the_shakes", "stage": 2 }] },
                    "prompt": "Kai gave me this sample for you.",
                    "response": "Let me see that... (She runs a quick analysis). The trace elements... they're off the charts. Heavy metals, complex proteins... this isn't natural contamination. This is industrial-grade waste. But there's no industry out there.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "the_shakes", "stage": 3 }
                    ],
                    "destination_nodes": [
                        { "node_id": "quest_data_check_results_2" }
                    ]
                },
                "quest_data_check_results_2": {
                    "prompt": "So it's deliberate?",
                    "response": "It has to be. Someone is dumping this stuff. The composition is... sophisticated. Almost like a failed experiment. If you find any data logs or research notes out in those mines, they could be the key.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "uncover_the_source", "stage": 1 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_cora_data_check": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "cora_research_notes" }] },
                    "prompt": "I found these research notes in the mines.",
                    "response": "Let me see... 'Project Chimera'... 'bio-leaching agent'... My god. This wasn't just dumping. It was a research project. They were using engineered microbes to extract minerals. The 'waste' is a byproduct. This 'Cora' is responsible for all of it.",
                    "destination_nodes": [
                        { "node_id": "quest_cora_final_choice" }
                    ]
                },
                "quest_cora_final_choice": {
                    "prompt": "She says she can create a cure, but needs the data.",
                    "response": "A cure? From the person who caused the plague? It's a risk. But... the formulas in these notes are brilliant. If she failed, it's possible she knows how to succeed. Giving her this data could save everyone... or doom them if she's lying. But destroying it means we have to find a cure ourselves, which could take years.",
                    "destination_nodes": [
                        { "node_id": "choice_give_data" },
                        { "node_id": "choice_destroy_data" }
                    ]
                },
                "choice_give_data": {
                    "prompt": "[Give Data] We have to trust her. It's our only chance.",
                    "response": "I... I hope you're right. The logic is sound. Let's pray her ethics are too. This modifies the data on the holotape, removing her name but keeping the core research. Give it to her. It's the best bad idea we have.",
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "cora_research_notes" },
                        { "type": "ITEM_GAIN", "item_id": "anonymized_research_data" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "moral_choice", "stage": 1 } // Stage 1: Sided with Cora
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "choice_destroy_data": {
                    "prompt": "[Destroy Data] She's a monster. We can't risk it.",
                    "response": "I agree. She doesn't deserve a second chance. The risk is too high. I'm deleting these files. We'll find another way. A slower, safer way. Kai needs to know about this immediately.",
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "cora_research_notes" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "moral_choice", "stage": 2 } // Stage 2: Sided with Rusthaven
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "end": {
                    "prompt": "I'll let you work.",
                    "response": "Good."
                }
            }
        },
        "silas_merchant": {
            "name": "Silas",
            "type": "npc",
            "description": "A slick merchant with a smile that never quite reaches his eyes. His stall is an oasis of rare goods in dusty Rusthaven, and he always seems to know more than he lets on.",
            "is_merchant": true,
            "inventory": ["stimpack", "rad_away", "canned_food"],
            "dialogue_graph": {
                 "start": {
                    "response": "Welcome, traveler! Silas is the name, and rare finds are my game. If you've got the caps, I've got the goods. What can I get for you?",
                    "destination_nodes": [
                        { "node_id": "story_silas_1" },
                        { "node_id": "trade" },
                        { "node_id": "quest_filter_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Back for more? I knew you were a discerning customer. What's your pleasure?",
                    "destination_nodes": [
                        { "node_id": "story_silas_1", "prompt_replacement": "Tell me about your business again." },
                        { "node_id": "trade" },
                        { "node_id": "quest_filter_intro" }, // Guardrail #2
                        { "node_id": "quest_filter_reminder" }, // Guardrail #3
                        { "node_id": "quest_filter_completion" }, // Guardrail #3
                        { "node_id": "info_on_cora" },
                        { "node_id": "end" }
                    ]
                },
                "story_silas_1": {
                    "prompt": "You seem to be doing well for yourself.",
                    "response": "It's all about supply and demand, my friend. People get sick, they need medicine. The purifier gets shaky, they need parts. I just anticipate the need. A man's got to make a living.",
                    "destination_nodes": [
                        { "node_id": "story_silas_2" }
                    ]
                },
                "story_silas_2": {
                    "prompt": "You profit from their problems?",
                    "response": "I provide a service! A valuable one. I take risks to get these goods. Risks others won't. So yes, I expect to be compensated. Don't look at me like that; it's the way of the world.",
                    "destination_nodes": [
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "quest_filter_intro": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "supply_and_demand", "stage": 0 }] },
                    "prompt": "Speaking of risks, I hear you need a courier.",
                    "response": "Heh, word gets around. I have a client, a very private collector in the Echo Mines, who pays top cap for pre-catastrophe tech. I have a package, but my usual runner has... come down with 'The Shakes.' Interested?",
                    "destination_nodes": [
                        { "node_id": "quest_filter_accept" },
                        { "node_id": "quest_filter_reject" }
                    ]
                },
                "quest_filter_accept": {
                    "prompt": "I'm interested. What's the job?",
                    "response": "Simple delivery. Take this 'Geological Scanner' to a scavenger named Jax in the Echo Mines. He'll have my payment. Don't look in the package. Just deliver it. Half my payment for you upfront, half on return.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "supply_and_demand", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "geological_scanner" },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 75 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_filter_reject": {
                    "prompt": "No deal. Too shady for me.",
                    "response": "Your loss. Plenty of desperate souls in the wastes.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_filter_reminder": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "supply_and_demand", "stage": 1 }] },
                    "prompt": "About that delivery to Jax...",
                    "response": "My client doesn't like to be kept waiting. Have you made the delivery yet?",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_filter_completion": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "silas_payment" }] },
                    "prompt": "I've delivered the package. Here's your payment.",
                    "response": "Excellent! See? Simple, clean, profitable. A pleasure doing business with you. Here's the other half of your fee. Maybe we can work together again soon.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "supply_and_demand", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "silas_payment" },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 75 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "info_on_cora": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "uncover_the_source", "stage": 1 }] },
                    "prompt": "I'm looking for a scientist named Cora. Ever heard of her?",
                    "response": "Cora... Cora... the name rings a bell. A biologist, wasn't she? Very secretive. Used to buy a lot of lab equipment from me, back before she vanished. Heard she set up a private lab out in the Echo Mines. Chasing some personal project.",
                    "destination_nodes": [
                        { "node_id": "info_on_cora_2" }
                    ]
                },
                "info_on_cora_2": {
                    "prompt": "[INT 5] What kind of project?",
                    "condition": { "op": "AND", "condition": [{ "type": "STAT_CHECK", "stat": "int", "min": 5 }] },
                    "response": "She was obsessed with 'bio-leaching.' Using microbes to pull minerals from rock. Said it was the future. I told her it was a pipe dream. Looks like I was right. Never saw her again.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "uncover_the_source", "stage": 2 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "trade": {
                    "prompt": "Let's trade.",
                    "response": "Music to my ears. Let's see what you've got.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Is there anything else?" }
                    ]
                },
                "end": {
                    "prompt": "Goodbye, Silas.",
                    "response": "Come back any time. My door is always open to a paying customer."
                }
            }
        },
        "elara_mystic": {
            "name": "Elara",
            "type": "npc",
            "description": "A mystic who reads the future in patterns of rust and the hum of the purifier. Her eyes are a startling, pale blue, and she speaks in cryptic pronouncements.",
            "is_merchant": false,
            "dialogue_graph": {
                // This NPC has a long dialogue tree, as requested
                "start": {
                    "response": "The machine spirit sings a sick song. The water carries a sleeping poison. Why have you come to this troubled place?",
                    "destination_nodes": [
                        { "node_id": "story_elara_1" },
                        { "node_id": "quest_vision_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "The currents shift. You have walked the path of iron and dust. What have you learned?",
                    "destination_nodes": [
                        { "node_id": "story_elara_1", "prompt_replacement": "Tell me of your visions again." },
                        { "node_id": "quest_vision_intro" },
                        { "node_id": "quest_vision_reminder" },
                        { "node_id": "quest_vision_completion" },
                        { "node_id": "quest_cora_insight" },
                        { "node_id": "end" }
                    ]
                },
                "story_elara_1": {
                    "prompt": "You believe the water is poisoned?",
                    "response": "I don't believe, I feel. The water weeps. It carries a memory of a wound, a deep wrong committed in the belly of the earth. The machine cannot filter out a memory.",
                    "destination_nodes": [{ "node_id": "story_elara_2" }]
                },
                "story_elara_2": {
                    "prompt": "A wound in the earth?",
                    "response": "The Echo Mines. It is a place of pain. The rock itself screams. A serpent of metal and malice sleeps there, leaking venom into the heart of the world.",
                    "destination_nodes": [
                        { "node_id": "quest_vision_intro", "prompt_replacement": "Can you show me what you mean?" },
                        { "node_id": "end" }
                    ]
                },
                 "quest_vision_intro": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 0 }] },
                    "prompt": "You mentioned a 'serpent of metal'. What is it?",
                    "response": "A vision. A hidden place where a metal pipe bleeds poison into a sacred pool. It is a secret, a crime against the earth. If you were to find this place, you would understand the source of the sickness.",
                    "destination_nodes": [
                        { "node_id": "quest_vision_accept" },
                        { "node_id": "quest_vision_reject" }
                    ]
                },
                "quest_vision_accept": {
                    "prompt": "I will find this place.",
                    "response": "Then you must carry this. It is a lodestone, attuned to the earth's pain. When you are near the wound, it will grow warm. Follow its heat. It will not lie.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "lodestone" }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_vision_reject": {
                    "prompt": "That's too cryptic for me.",
                    "response": "The truth is not always a straight path. Return when you are ready to listen.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_vision_reminder": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 1 }] },
                    "prompt": "The lodestone... what am I looking for?",
                    "response": "Seek the hidden, the forgotten. A place that feels wrong. Where the air is still and the water tastes of metal. The lodestone will guide your heart.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_vision_completion": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 99 }] }, // Set by an interaction in the mines
                    "prompt": "I found a hidden vent, just as you said.",
                    "response": "You have seen the truth. The wound is real. The serpent's tooth has been revealed. You must show the others. Let the Foreman see the truth his machines cannot.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 200 }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_cora_insight": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "uncover_the_source", "stage": 2 }] },
                    "prompt": "I'm looking for a scientist named Cora.",
                    "response": "The name is a shadow. A ghost who tried to teach the rock a new song. But the rock refused to learn, and her song became a scream. She is trapped by her own creation, a prisoner of her pride.",
                    "destination_nodes": [
                        { "node_id": "quest_cora_insight_2" }
                    ]
                },
                "quest_cora_insight_2": {
                    "prompt": "Can she fix what she's done?",
                    "response": "Every poison has an antidote. Every crime has a chance for redemption. But the path is steep. Her heart must be weighed. Whether she brings salvation or ruin... that is a choice that will fall to you.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "end": {
                    "prompt": "I must go.",
                    "response": "Walk in light, even when you are surrounded by darkness."
                }
            }
        },
        "old_ben_civilian": {
            "name": "Old Ben",
            "type": "npc",
            "description": "A long-time resident of Rusthaven, his hands tremble slightly from the early stages of 'The Shakes.' He spends his days watching the comings and goings of the settlement.",
            "is_merchant": false,
            "dialogue_graph": {
                "start": {
                    "response": "Another new face. Careful with the water, friend. It's not what it used to be. Got a tremor in my hands that says so.",
                    "destination_nodes": [
                        { "node_id": "story_ben_1" },
                        { "node_id": "quest_lost_locket_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Back again? Good to see someone with some energy. This sickness... it drains you.",
                    "destination_nodes": [
                        { "node_id": "story_ben_1", "prompt_replacement": "Tell me about the old days again." },
                        { "node_id": "quest_lost_locket_intro" },
                        { "node_id": "quest_lost_locket_reminder" },
                        { "node_id": "quest_lost_locket_completion" },
                        { "node_id": "gossip_about_silas" },
                        { "node_id": "end" }
                    ]
                },
                "story_ben_1": {
                    "prompt": "You've been here a long time?",
                    "response": "Since the beginning. Saw Kai's father switch that purifier on for the first time. It was a miracle. We thought our troubles were over. Seems troubles always find a new way in.",
                    "destination_nodes": [{ "node_id": "story_ben_2" }]
                },
                "story_ben_2": {
                    "prompt": "When did the sickness start?",
                    "response": "Few months back. Just a little tremor. Then my neighbor, Martha, she got it bad. Now, seems like a new person every week is complaining. It's a quiet panic. Everyone's scared.",
                    "destination_nodes": [{ "node_id": "gossip_about_silas" }]
                },
                "gossip_about_silas": {
                    "prompt": "What do you make of Silas, the merchant?",
                    "response": "Hmph. Silas. He's got a nose for trouble, that one. And for profit. You notice his supply of stimpacks and Rad-Away came in just *before* everyone started getting really sick? Man's a vulture in a trader's coat.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_lost_locket_intro": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "precious_memories", "stage": 0 }] },
                    "prompt": "Is there anything I can do to help?",
                    "response": "You're a kind soul. My daughter... she left years ago to become a scavenger. Last I heard she was working the Echo Mines. She gave me a locket, and with these shaky hands, I dropped it. I think it rolled into a maintenance grate near the purifier.",
                    "destination_nodes": [
                        { "node_id": "quest_lost_locket_accept" },
                        { "node_id": "quest_lost_locket_reject" }
                    ]
                },
                "quest_lost_locket_accept": {
                    "prompt": "I'll look for it.",
                    "response": "Oh, would you? Thank you, thank you. It's just a small, silver thing. But it's all I have left of her. Her name was Mina.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "precious_memories", "stage": 1 }],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_lost_locket_reject": {
                    "prompt": "I don't have time for that.",
                    "response": "Oh. I understand. Everyone's busy these days.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_lost_locket_reminder": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "precious_memories", "stage": 1 }] },
                    "prompt": "About that locket...",
                    "response": "Any luck? I keep hoping... It's foolish, I know.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_lost_locket_completion": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "silver_locket" }] },
                    "prompt": "I found this silver locket. Is it yours?",
                    "response": "My locket! You found it! Oh, bless you. I... I can't tell you what this means to me. Here, it's not much, but please, take it. For your kindness.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "precious_memories", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "silver_locket" },
                        { "type": "ITEM_GAIN", "item_id": "antique_watch" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 },
                        { "type": "REPUTATION_CHANGE", "value": 5 }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": {
                    "prompt": "Take care, Ben.",
                    "response": "You too, friend. You too."
                }
            }
        }
    },
    "echo_mines": {
        "jax_scavenger": {
            "name": "Jax",
            "type": "npc",
            "description": "A wiry scavenger with quick, nervous energy. He's constantly checking his surroundings, his gaze darting into the shadows of the mine.",
            "is_merchant": true,
            "inventory": ["scrap_metal", "purified_water", "mutated_fern"],
            "dialogue_graph": {
                "start": {
                    "response": "Hey! Keep your distance. This is my claim. You a scavenger, or just another tourist looking to get killed? Name's Jax.",
                    "destination_nodes": [
                        { "node_id": "story_jax_1" },
                        { "node_id": "quest_silas_delivery_check" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You're still kicking. Surprising. What do you want?",
                    "destination_nodes": [
                        { "node_id": "story_jax_1", "prompt_replacement": "What's the score in these mines?" },
                        { "node_id": "quest_silas_delivery_check" },
                        { "node_id": "quest_silas_package_open" },
                        { "node_id": "trade" },
                        { "node_id": "info_on_cora_lab" },
                        { "node_id": "end" }
                    ]
                },
                "story_jax_1": {
                    "prompt": "What are you scavenging for?",
                    "response": "Whatever the rock gives me. Mostly old-world salvage, copper wiring, the occasional tech chip. But there's strange stuff in this mine, too. Glowing rocks, weird plants... stuff that pays well, if you know who to sell to.",
                    "destination_nodes": [{ "node_id": "story_jax_2" }]
                },
                "story_jax_2": {
                    "prompt": "Like who?",
                    "response": "Like Silas in Rusthaven. He's got a client who pays for 'geological samples.' Don't know, don't care. The caps are good.",
                    "destination_nodes": [
                        { "node_id": "quest_silas_delivery_check" },
                        { "node_id": "trade" }
                    ]
                },
                "quest_silas_delivery_check": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "geological_scanner" }] },
                    "prompt": "I have a package for you from Silas.",
                    "response": "About time! He said he was sending someone. Give it here. It's a 'Geological Scanner'... right. Here's the payment for Silas. Now buzz off, I've got work to do.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "supply_and_demand", "stage": 2 },
                        { "type": "ITEM_LOSE", "item_id": "geological_scanner" },
                        { "type": "ITEM_GAIN", "item_id": "silas_payment" }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_silas_package_open": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "opened_scanner_parts" }] },
                    "prompt": "I opened the scanner. It's a water sensor.",
                    "response": "A what? You opened it? Are you crazy? Silas will have my hide! ...A water sensor, you say? Why would his client want to test the water? Wait... the sickness in Rusthaven... Is he... is he tracking it?",
                    "destination_nodes": [{ "node_id": "quest_silas_package_open_2" }]
                },
                "quest_silas_package_open_2": {
                    "prompt": "It looks like it. He's profiting from the crisis.",
                    "response": "That son of a... I knew he was shady. So his 'client' is probably himself. He's playing both sides. Look, I don't want any part of this. You do what you want with that information. Just leave me out of it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "supply_and_demand", "stage": 3 } // Alternate stage
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "info_on_cora_lab": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "uncover_the_source", "stage": 1 }] },
                    "prompt": "I'm looking for a hidden lab.",
                    "response": "A lab? Yeah, I know it. Deep in the eastern tunnels. Gave it a wide berth. Guarded by automated turrets and the door's locked up tight. Saw a woman there once, a biologist. Looked half-mad.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "uncover_the_source", "stage": 3 }]
                },
                "trade": {
                    "prompt": "Show me what you've got.",
                    "response": "Fine, fine. But make it quick.",
                    "destination_nodes": [{ "node_id": "return", "prompt_replacement": "Anything else?" }]
                },
                "end": {
                    "prompt": "I'm leaving.",
                    "response": "Good. Less competition."
                }
            }
        },
        // Additional NPCs for Echo Mines...
        "ronan_hermit": {
            "name": "Ronan the Rock-Talker",
            "type": "npc",
            "description": "A hermit living deep within the mines, his skin stained green from the glowing rocks. He claims to hear the voice of the mountain.",
            "is_merchant": false,
            "dialogue_graph": {
                 "start": {
                    "response": "Hush! The mountain is speaking. It tells of a poison in its veins. You walk loudly. You disturb the song.",
                    "destination_nodes": [
                        { "node_id": "story_ronan_1" },
                        { "node_id": "quest_heartstone_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You return. The song is fainter now. The poison spreads. Have you learned to listen?",
                    "destination_nodes": [
                        { "node_id": "story_ronan_1", "prompt_replacement": "Tell me of the mountain's song again." },
                        { "node_id": "quest_heartstone_intro" },
                        { "node_id": "quest_heartstone_reminder" },
                        { "node_id": "quest_heartstone_completion" },
                        { "node_id": "end" }
                    ]
                },
                "story_ronan_1": {
                    "prompt": "The mountain speaks to you?",
                    "response": "Not with words. With tremors. With light. With the taste of the water. I am part of it, and it is part of me. It is sick, and so I am sick.",
                    "destination_nodes": [{ "node_id": "story_ronan_2" }]
                },
                "story_ronan_2": {
                    "prompt": "You have 'The Shakes'?",
                    "response": "I have had them for a long time. It is the price of listening. The Old Ones put a sickness in the rock, and the Sky-fallers woke it up. Now it bleeds into the water, into everything.",
                    "destination_nodes": [{ "node_id": "quest_heartstone_intro" }]
                },
                 "quest_heartstone_intro": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "the_rock_sings_sadly", "stage": 0 }] },
                    "prompt": "How can I stop the poison?",
                    "response": "You cannot stop a scream. You can only soothe it. Find the Heartstone. It is a piece of the mountain that still sings a pure song. Bring it to the poisoned pool. It will not cure the sickness, but it will quiet the pain.",
                    "destination_nodes": [
                        { "node_id": "quest_heartstone_accept" },
                        { "node_id": "quest_heartstone_reject" }
                    ]
                },
                "quest_heartstone_accept": {
                    "prompt": "I will find the Heartstone.",
                    "response": "It hides in a place where the light does not touch, but the air is warm. Listen for its song. A low, steady hum. Not the angry buzz of the poison.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "the_rock_sings_sadly", "stage": 1 }],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                 "quest_heartstone_reject": {
                    "prompt": "I have more important things to do.",
                    "response": "The poison does not care for your importance. It will claim all in time.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_heartstone_reminder": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "the_rock_sings_sadly", "stage": 1 }] },
                    "prompt": "I'm still looking for the Heartstone.",
                    "response": "Hurry. The mountain's song grows weaker.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_heartstone_completion": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "heartstone" }] },
                    "prompt": "I have the Heartstone.",
                    "response": "Yes! The pure song! Take it to the hidden pool, where the metal serpent weeps its venom. Place it in the water. Grant the mountain a moment of peace.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "the_rock_sings_sadly", "stage": 2 }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": {
                    "prompt": "Farewell, Ronan.",
                    "response": "Listen..."
                }
            }
        },
        "mina_guard": {
            "name": "Mina",
            "type": "npc",
            "description": "A grim-faced guard with a thousand-yard stare, she patrols a specific section of the mines. She moves with the efficiency of a seasoned survivor.",
            "is_merchant": false,
            "dialogue_graph": {
                "start": {
                    "response": "This is as far as you go. My territory. Turn back.",
                    "destination_nodes": [
                        { "node_id": "story_mina_1" },
                        { "node_id": "locket_check" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You're still here. I admire your persistence, if not your wisdom.",
                    "destination_nodes": [
                        { "node_id": "story_mina_1", "prompt_replacement": "Why do you guard this area?" },
                        { "node_id": "locket_check" },
                        { "node_id": "quest_cora_access" },
                        { "node_id": "end" }
                    ]
                },
                "story_mina_1": {
                    "prompt": "What are you guarding?",
                    "response": "The past. A mistake. There's a research lab deeper in. The scientist within, Cora, she made a promise to me. I'm here to make sure no one interrupts her work.",
                    "destination_nodes": [{ "node_id": "story_mina_2" }]
                },
                "story_mina_2": {
                    "prompt": "What kind of promise?",
                    "response": "A promise to fix what she broke. She's the reason the water is poison. She's the reason people are getting sick. And she's the only one who can undo it. My loyalty is to the cure, not the cause.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "locket_check": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "silver_locket" }] },
                    "prompt": "I met your father, Old Ben. He asked me to find this.",
                    "response": "My... my father? He's... still alive? And he kept this? (Her stoic expression cracks for a moment). All these years... I thought... Thank you. I thought I was alone. What I'm doing here... it's to protect people like him.",
                    "destination_nodes": [{ "node_id": "locket_check_2" }]
                },
                "locket_check_2": {
                    "prompt": "He misses you.",
                    "response": "I can't go back. Not until this is finished. But knowing he's there... it changes things. Look, the scientist, Cora. She needs supplies. If you can get her a 'Biochemical Reagent,' it would speed up her work. You can find some in old med-kits.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "a_daughter_s_duty", "stage": 1 }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_cora_access": {
                    "condition": { "op": "AND", "condition": [{ "type": "QUEST_STAGE", "quest_id": "uncover_the_source", "stage": 3 }] },
                    "prompt": "I need to speak with Cora.",
                    "response": "She sees no one. Her work is too delicate.",
                    "destination_nodes": [
                        { "node_id": "cora_access_persuade" },
                        { "node_id": "cora_access_bribe" },
                        { "node_id": "end" }
                    ]
                },
                 "cora_access_persuade": {
                    "condition": { "op": "AND", "condition": [{ "type": "STAT_CHECK", "stat": "reputation", "min": 15 }] },
                    "prompt": "[Reputation 15] People are dying. Her work is the only hope.",
                    "response": "You... you understand. Fine. Go. But do not distract her. The fate of Rusthaven is in her hands.",
                    "outcomes": [{ "type": "NPC_UNLOCK", "location_id": "echo_mines", "npc_id": "cora_biologist" }],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "cora_access_bribe": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "biochemical_reagent" }] },
                    "prompt": "I brought this for her. It should help.",
                    "response": "A reagent! This is... vital. You are not just a scavenger. You are a true help. Very well, you have earned a moment of her time. Go on in.",
                     "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "biochemical_reagent" },
                        { "type": "NPC_UNLOCK", "location_id": "echo_mines", "npc_id": "cora_biologist" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "a_daughter_s_duty", "stage": 100 }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": {
                    "prompt": "I'll be careful.",
                    "response": "See that you are."
                }
            }
        },
        "cora_biologist": {
            "name": "Dr. Cora",
            "type": "npc",
            "description": "A brilliant but haunted biologist, cornered by the disastrous consequences of her own ambition. She works feverishly in her hidden lab.",
            "is_available": false, // Unlocked by Mina
            "is_merchant": false,
            "dialogue_graph": {
                "start": {
                    "response": "Who are you? How did you get past Mina? My work is at a critical stage! You cannot be here.",
                    "destination_nodes": [
                        { "node_id": "story_cora_1" },
                        { "node_id": "quest_cure_check" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You're back. Every moment you're here is a moment I'm not working on the cure. What is it?",
                    "destination_nodes": [
                        { "node_id": "story_cora_1", "prompt_replacement": "Explain your research again." },
                        { "node_id": "quest_cure_check" },
                        { "node_id": "quest_cure_final" },
                        { "node_id": "end" }
                    ]
                },
                "story_cora_1": {
                    "prompt": "Your work is what's making people sick.",
                    "response": "I know what I've done! You think I don't live with that every second? Project Chimera was supposed to be a miracle—a bio-agent that could extract resources without heavy machinery. A way to rebuild.",
                    "destination_nodes": [{ "node_id": "story_cora_2" }]
                },
                "story_cora_2": {
                    "prompt": "What went wrong?",
                    "response": "The microbes were too efficient. They didn't just leach minerals; they started breaking down the bedrock itself, creating toxic byproducts. It was an unforeseen cascade failure. I contained the primary site, but the contamination had already reached the water table. Now... now I'm trying to engineer a counter-agent. A cure.",
                    "destination_nodes": [{ "node_id": "quest_cure_check" }]
                },
                "quest_cure_check": {
                    "prompt": "What do you need to make the cure?",
                    "response": "Data. My original research data is on a corrupted server. I can't access the core algorithms I need to synthesize the counter-agent. Without that data, I'm working blind. It's hopeless.",
                    "destination_nodes": [{ "node_id": "quest_cure_final" }]
                },
                "quest_cure_final": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "anonymized_research_data" }] },
                    "prompt": "I have your research data, recovered from Rusthaven's systems.",
                    "response": "You... you found it? This is it! The core algorithms! With this, I can stabilize the counter-agent. I can create the cure! You've... you've saved us all. I can't undo the harm I've caused, but I can stop it from spreading. Thank you.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "the_cure", "stage": 1 },
                        { "type": "ITEM_LOSE", "item_id": "anonymized_research_data" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 500 },
                        { "type": "REPUTATION_CHANGE", "value": 20 }
                    ],
                    "destination_nodes": [{ "node_id": "quest_cure_epilogue" }]
                },
                 "quest_cure_epilogue": {
                    "prompt": "What happens now?",
                    "response": "Now, I work. It will take time, but the cure is possible. Tell Kai... tell them a solution is coming. And that I am sorry.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "the_cure", "stage": 100 }],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": {
                    "prompt": "I'll leave you to it.",
                    "response": "Yes. Time is running out."
                }
            }
        },
        "automated_sentry": {
            "name": "[ Automated Sentry ]",
            "type": "device",
            "description": "An old-world automated turret, covered in grime but with a single, glowing red optical sensor. It swivels to track you.",
            "is_merchant": false,
            "dialogue_graph": {
                "start": {
                    "response": "Access Denied. Lethal force authorized. Present valid credentials.",
                    "destination_nodes": [
                        { "node_id": "hack_attempt" },
                        { "node_id": "bypass_attempt" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Warning: Loitering in a restricted area is prohibited.",
                    "destination_nodes": [
                        { "node_id": "hack_attempt" },
                        { "node_id": "bypass_attempt" },
                        { "node_id": "end" }
                    ]
                },
                "hack_attempt": {
                    "condition": { "op": "AND", "condition": [{ "type": "STAT_CHECK", "stat": "int", "min": 7 }] },
                    "prompt": "[INT 7] Attempt to hack the terminal.",
                    "response": "Security protocols bypassed. Welcome, Administrator. Sentry protocols now in standby mode.",
                    "outcomes": [{ "type": "NPC_LOCK", "location_id": "echo_mines", "npc_id": "automated_sentry" }],
                    "destination_nodes": []
                },
                "bypass_attempt": {
                    "condition": { "op": "AND", "condition": [{ "type": "HAVE_ITEM", "item_id": "cora_id_badge" }] }, // Item found elsewhere in the mine
                    "prompt": "[Use ID Badge] Present credentials.",
                    "response": "Credential accepted. Welcome, Dr. Cora. Sentry protocols now in standby mode.",
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "cora_id_badge" },
                        { "type": "NPC_LOCK", "location_id": "echo_mines", "npc_id": "automated_sentry" }
                    ],
                    "destination_nodes": []
                },
                "end": {
                    "prompt": "[Back Away]",
                    "response": "Compliance is advised."
                }
            }
        }
    }
};

const QUEST_DATA = {
    "the_shakes": {
        "title": "The Shakes",
        "description": "The people of Rusthaven are getting sick from a mysterious illness. Foreman Kai has asked you to investigate the source by collecting a water sample from the Echo Mines.",
        "location": "rusthaven",
        "giver": "kai_leader",
        "stages": {
            "0": "Not started",
            "1": "Travel to the Echo Mines and collect a water sample from the aquifer.",
            "2": "Bring the water sample to Foreman Kai in Rusthaven.",
            "3": "Anya has analyzed the sample and found industrial waste. She needs more data.",
            "100": "Completed"
        },
        "rewards": { "stat_change": [{ "stat": "xp", "value": 150 }] }
    },
    "whispers_in_the_dark": {
        "title": "Whispers in the Dark",
        "description": "Elara the Mystic has had a vision of a 'metal serpent' poisoning the water in the Echo Mines. She has given you a lodestone to find the source.",
        "location": "rusthaven",
        "giver": "elara_mystic",
        "stages": {
            "0": "Not started",
            "1": "Use the lodestone to find the source of the earth's pain in the Echo Mines.",
            "99": "You've discovered the hidden waste vent.",
            "100": "You told Elara about the vent. Now you must inform Kai."
        },
        "rewards": { "stat_change": [{ "stat": "xp", "value": 200 }] }
    },
    "supply_and_demand": {
        "title": "Supply and Demand",
        "description": "The merchant Silas has hired you to deliver a package to a scavenger named Jax in the Echo Mines. He insists you do not look inside.",
        "location": "rusthaven",
        "giver": "silas_merchant",
        "stages": {
            "0": "Not started",
            "1": "Deliver the 'Geological Scanner' to Jax in the Echo Mines.",
            "2": "You delivered the package and received payment for Silas.",
            "3": "You opened the package and discovered Silas is monitoring the water contamination.",
            "100": "Completed"
        },
        "rewards": { "stat_change": [{ "stat": "caps", "value": 150 }] }
    },
    "uncover_the_source": {
        "title": "Uncover the Source",
        "description": "Anya's analysis and intel from others point to a hidden lab in the Echo Mines run by a biologist named Cora. Find her and uncover the truth.",
        "location": "rusthaven",
        "giver": "anya_tech",
        "stages": {
            "0": "Not started",
            "1": "Anya needs data logs or research notes from the Echo Mines.",
            "2": "You've learned about Dr. Cora's hidden lab.",
            "3": "You've located the entrance to the lab, but it's guarded.",
            "100": "You've confronted Dr. Cora."
        },
        "rewards": { "stat_change": [{ "stat": "xp", "value": 300 }] }
    },
    "moral_choice": {
        "title": "A Rock and a Hard Place",
        "description": "You have Dr. Cora's research notes. Do you give them to her to develop a cure, risking she might be lying, or destroy them and condemn her for her actions?",
        "location": "rusthaven",
        "giver": "anya_tech",
        "stages": {
            "0": "Not started",
            "1": "You chose to trust Dr. Cora and give her the data.",
            "2": "You chose to condemn Dr. Cora and destroy the data.",
            "100": "Choice Made"
        },
        "rewards": { "reputation": 0 } // The outcome is the reward.
    },
    "precious_memories": {
        "title": "Precious Memories",
        "description": "Old Ben has lost a silver locket given to him by his daughter, Mina. He thinks it fell into a grate near the purifier.",
        "location": "rusthaven",
        "giver": "old_ben_civilian",
        "stages": {
            "0": "Not started",
            "1": "Search for the silver locket near the purifier.",
            "100": "You returned the locket to Old Ben."
        },
        "rewards": { "items": ["antique_watch"] }
    }
};

const ITEMS_DATA = {
    // Quest Items
    "empty_flask": { "name": "Empty Flask", "tradeable": false, "type": "quest", "price": 0 },
    "mine_water_sample": { "name": "Mine Water Sample", "tradeable": false, "type": "quest", "price": 0 },
    "lodestone": { "name": "Lodestone", "tradeable": false, "type": "quest", "price": 0 },
    "geological_scanner": { "name": "Geological Scanner", "tradeable": false, "type": "quest", "price": 150 },
    "opened_scanner_parts": { "name": "Opened Scanner Parts", "tradeable": false, "type": "quest", "price": 0 },
    "silas_payment": { "name": "Sealed Box of Caps", "tradeable": false, "type": "quest", "price": 150 },
    "cora_research_notes": { "name": "Cora's Research Notes", "tradeable": false, "type": "quest", "price": 0 },
    "anonymized_research_data": { "name": "Anonymized Research Data", "tradeable": false, "type": "quest", "price": 0 },
    "silver_locket": { "name": "Silver Locket", "tradeable": false, "type": "quest", "price": 0 },
    "biochemical_reagent": { "name": "Biochemical Reagent", "tradeable": true, "type": "quest", "price": 200 },
    "heartstone": { "name": "Heartstone", "tradeable": false, "type": "quest", "price": 0 },
    "cora_id_badge": { "name": "Cora's ID Badge", "tradeable": false, "type": "quest", "price": 0 },

    // General Items
    "stimpack": { "name": "Stimpack", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 25 }], "price": 50 },
    "rad_away": { "name": "Rad-Away", "tradeable": true, "type": "consumable", "price": 75 },
    "canned_food": { "name": "Canned Food", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 10 }], "price": 20 },
    "scrap_metal": { "name": "Scrap Metal", "tradeable": true, "type": "junk", "price": 5 },
    "purified_water": { "name": "Purified Water", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 15 }], "price": 30 },
    "mutated_fern": { "name": "Mutated Fern", "tradeable": true, "type": "junk", "price": 15 },
    "antique_watch": { "name": "Antique Watch", "tradeable": true, "type": "junk", "price": 100 }
};
