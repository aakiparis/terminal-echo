/* ==================================================================
    TERMINAL ECHO - EXPANDED WORLD DATA
   ================================================================== */

// --- 1. LOCATION DATA ---
const LOCATION_DATA = {
    "aethelburg_sprawl": {
        "name": "Aethelburg Sprawl",
        "description": "A rain-slicked concrete canyon where flickering neon signs bleed into pools of rust and refuse. The air is thick with the smell of ozone and decay.",
        "npcs": ["cypher_jack", "sergeant_kail"]
    },
    "haven": {
        "name": "Haven",
        "description": "A small, fortified settlement built into the shell of a pre-catastrophe data center. The hum of servers and the smell of clean, filtered air is a stark contrast to the wastes outside.",
        "npcs": ["warden_kai", "silas_merchant", "dr_araya", "echo_mystic", "old_ben", "zara_scout"]
    },
    "relay_station_gamma": {
        "name": "Relay Station Gamma",
        "description": "A skeletal communications tower clawing at the sky, surrounded by the husks of rusted machinery. A constant, low hum of static fills the air.",
        "npcs": ["wrench_scavenger"]
    },
    "rust_canyon": {
        "name": "Rust Canyon",
        "description": "A treacherous canyon carved through layers of junk and scrap metal. The wind whistles through the metallic labyrinth, carrying whispers of danger.",
        "npcs": ["hermit_zane"]
    }
};

// --- 2. NPC DATA ---
const NPC_DATA = {
    "aethelburg_sprawl": {
        "cypher_jack": {
            "name": "Cypher Jack", "description": "A man who seems to be in two places at once. One eye is a milky orb, the other a flickering cybernetic lens.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                "start_first_time": {
                    "text": "Another construct wandering the grid... I know of a place, Haven, where the code runs differently. It's safer there. I've marked it on your grid.",
                    "outcomes": [{ "type": "LOCATION_UNLOCK", "location_id": "haven" }],
                    "options": [{ "text": "Why are you helping me?", "destination_node": "why_help" }]
                },
                "why_help": { "text": "Let's call it an investment in a promising variable. Now go.", "options": [{ "text": "I'll be on my way.", "destination_node": "end_conversation" }] },
                "start_return": { "is_fallback": true, "text": "Back again? The grid is vast. Don't linger.", "options": [{ "text": "Goodbye.", "destination_node": "end_conversation" }] }
            }}
        },
        "sergeant_kail": { /* Unchanged from previous version, serves as flavor NPC */
            "name": "Sergeant Kail", "description": "His face is a roadmap of scars, his armor a patchwork of riot gear and steel plates.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                "start_first_time": { "text": "Halt. This sector is under military jurisdiction. State your business.", "options": [{ "text": "Just passing through.", "destination_node": "end_conversation" }] },
                "start_return": { "is_fallback": true, "text": "Move along.", "options": [{ "text": "Goodbye.", "destination_node": "end_conversation" }] }
            }}
        }
    },
    "haven": {
        "warden_kai": {
            "name": "Warden Kai", "description": "His armor is pristine, his posture rigid. He watches over Haven with a disciplined gaze.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                "start_first_time": { /* ... no changes here ... */
                    "text": "I am Warden Kai. This is a protected zone. You follow our rules, we have no problems. I'm getting strange energy readings from an old relay station. I need someone to investigate.",
                    "options": [
                        { "text": "What kind of readings?", "destination_node": "quest_accept" },
                        { "text": "I'm not interested.", "destination_node": "end_conversation" }
                    ]
                },
                "quest_accept": { /* ... no changes here ... */
                    "text": "A looping signal, clean amidst the static. Unnatural. Go to Relay Station Gamma, find the source, and report back. I'll make it worth your while.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "q_the_signal", "stage": 1 },
                        { "type": "LOCATION_UNLOCK", "location_id": "relay_station_gamma" }
                    ],
                    "options": [{ "text": "I'm on it.", "destination_node": "end_conversation" }]
                },
                "post_quest_q_the_signal_a": { /* ... no changes here ... */
                    "text": "[QUEST] You have the regulator? Good work. This will help us stabilize our power grid. Here is your reward.",
                    "conditions": [
                        // { "type": "HAVE_ITEM", "item_id": "power_regulator" },
                        { "type": "QUEST_STAGE", "quest_id": "q_the_signal", "stage": 2 }
                    ],
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "power_regulator" },
                        { "type": "REPUTATION_CHANGE", "value": 10 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "q_the_signal", "stage": 100 }
                    ],
                    "options": [{ "text": "Glad I could help.", "destination_node": "end_conversation" }]
                },
                 "post_quest_q_the_signal_b": { /* ... no changes here ... */
                    "text": "[QUEST] You were supposed to retrieve that regulator, not give it away! You've made a powerful enemy today.",
                    "conditions": [
                        { "type": "QUEST_STAGE", "quest_id": "q_the_signal", "stage": 3 }
                    ],
                    "outcomes": [
                        { "type": "REPUTATION_CHANGE", "value": -25 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "q_the_signal", "stage": 100 }
                    ],
                    "options": [{ "text": "I did what I had to do.", "destination_node": "end_conversation" }]
                },
                // === THIS NODE IS NOW CORRECTED ===
                "start_return": {
                    "is_fallback": true,
                    "text": "Keep your affairs in order. We value order here.",
                    "options": [
                        // Option for turning in the regulator
                        {
                            "text": "[QUEST] I have the regulator from the relay station.",
                            "destination_node": "post_quest_q_the_signal_a",
                            "conditions": [
                                { "type": "QUEST_STAGE", "quest_id": "q_the_signal", "stage": 2 },
                                // { "type": "HAVE_ITEM", "item_id": "power_regulator" }
                            ]
                        },
                        // Option for confessing you sided with Wrench
                        {
                            "text": "[QUEST] About the relay station...",
                            "destination_node": "post_quest_q_the_signal_b",
                            "conditions": [
                                { "type": "QUEST_STAGE", "quest_id": "q_the_signal", "stage": 3 }
                            ]
                        },
                        // Default goodbye option
                        { "text": "Goodbye.", "destination_node": "end_conversation" }
                    ]
                }
            }}
        },
        "silas_merchant": { // MERCHANT
            "name": "Silas", "description": "A merchant with a wry smile and eyes that miss nothing.", "is_merchant": true,
            "dialogue_graph": { "nodes": {
                "start_first_time": { "text": "Fresh off the dust trail, eh? Take a look. Everything has a price.", "options": [{ "text": "Let's trade.", "destination_node": "trade" }] },
                "trade": { "text": "(Trade screen)", "options": [{ "text": "Goodbye.", "destination_node": "end_conversation" }] },
                "start_return": { "is_fallback": true, "text": "Back for more? My prices haven't changed.", "options": [{ "text": "Let's trade.", "destination_node": "trade" }] }
            }}
        },
        "dr_araya": { // TECHNICIAN (Interconnected Story with Zara)
            "name": "Dr. Araya", "description": "A brilliant but worried-looking technician, her hands constantly fiddling with a datapad.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                 "start_first_time": {
                    "text": "My daughter, Zara... she's a scout. She went on a supply run to Rust Canyon and hasn't returned. I'm terrified. The comms are just static.",
                    "options": [
                        { "text": "I can look for her.", "destination_node": "accept_zara_quest" },
                        { "text": "I'm sorry, I can't help.", "destination_node": "end_conversation" }
                    ]
                },
                "accept_zara_quest": {
                    "text": "You will? Thank you! She was looking for a hermit named Zane, trying to trade for some old tech. Please, find her.",
                     "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "q_hermits_wisdom", "stage": 1 },
                        { "type": "LOCATION_UNLOCK", "location_id": "rust_canyon" }
                    ],
                    "options": [{ "text": "I'll do my best.", "destination_node": "end_conversation" }]
                },
                 "post_quest_q_hermits_wisdom": {
                    "text": "[QUEST] Zara is safe? And you brought the schematics? Oh, thank you! I don't have much, but please, take this for your trouble.",
                    "conditions": [{ "type": "QUEST_STAGE", "quest_id": "q_hermits_wisdom", "stage": 3 }, { "type": "HAVE_ITEM", "item_id": "drive_schematics" }],
                     "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "drive_schematics" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "q_hermits_wisdom", "stage": 100 }
                    ],
                    "options": [{ "text": "You're welcome.", "destination_node": "end_conversation" }]
                },
                "start_return": { "is_fallback": true, "text": "Any news of Zara? I'm so worried.", "options": [{ "text": "I'm still looking.", "destination_node": "end_conversation" }] }
            }}
        },
        "zara_scout": { // CIVILIAN (Interconnected Story with Dr. Araya)
            "name": "Zara", "description": "A young, capable scout with dirt on her face and a determined look in her eye. She seems relieved to see you.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                "start_first_time": {
                    "text": "You're not one of the canyon junkers. My mother, Dr. Araya, sent you, didn't she? I'm fine, but that old hermit Zane won't part with the schematics she needs.",
                    "conditions": [{ "type": "QUEST_STAGE", "quest_id": "q_hermits_wisdom", "stage": 1 }],
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "q_hermits_wisdom", "stage": 2 }],
                    "options": [{ "text": "What does he want?", "destination_node": "zane_deal" }]
                },
                "zane_deal": { "text": "He wants a 'Geiger Counter'. Says the hum of the tech hurts his teeth. Find one, and he'll trade. There might be one at the old Relay Station.", "options": [{ "text": "I'll see what I can find.", "destination_node": "end_conversation" }] },
                "start_return": { "is_fallback": true, "text": "Any luck with that Geiger Counter?", "options": [{ "text": "Still working on it.", "destination_node": "end_conversation" }] }
            }}
        },
        "echo_mystic": { // MYSTIC
            "name": "Echo", "description": "A figure cloaked in rags, sitting cross-legged by a humming server bank.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                "start_first_time": { "text": "The signal... it fractures. Do you see the data stream behind the world? The numbers that make us all dance?", "options": [{ "text": "[LCK > 5] I see the patterns in the static.", "destination_node": "insight_path", "conditions": [{ "type": "STAT_CHECK", "stat": "lck", "min": 6 }] }, { "text": "I don't know what you mean.", "destination_node": "end_conversation" }] },
                "insight_path": { "text": "Yes! You feel it too! The universe is just code, and you just learned to read a new line. The system rewards your insight.", "outcomes": [{ "type": "STAT_CHANGE", "stat": "xp", "value": 50 }], "options": [{ "text": "Thank you... I think.", "destination_node": "end_conversation" }] },
                "start_return": { "is_fallback": true, "text": "The signal fades and returns...", "options": [{ "text": "Goodbye.", "destination_node": "end_conversation" }] }
            }}
        },
        "old_ben": { // CIVILIAN (Bad)
            "name": "Old Ben", "description": "A grumpy old man who watches everyone with suspicion.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                "start_first_time": { "text": "Another outsider. Haven's gone soft. In my day, we'd have thrown you back into the dust. What do you want?", "options": [{ "text": "[STR > 5] You should watch your tone, old man.", "destination_node": "intimidate", "conditions": [{"type": "STAT_CHECK", "stat": "str", "min": 6 }] }, { "text": "Nothing from you.", "destination_node": "end_conversation" }] },
                "intimidate": { "text": "Hmph. All muscle and no manners. Fine. Leave me be.", "outcomes": [{ "type": "REPUTATION_CHANGE", "value": -5 }], "options": [{ "text": "Glad we understand each other.", "destination_node": "end_conversation" }] },
                "start_return": { "is_fallback": true, "text": "Still here? Go bother someone else.", "options": [{ "text": "Goodbye.", "destination_node": "end_conversation" }] }
            }}
        }
    },
    "relay_station_gamma": {
        "wrench_scavenger": { // SCAVENGER (Moral Choice NPC)
            "name": "Wrench", "description": "A jittery scavenger, clutching a complex-looking power regulator.", "is_merchant": true,
            "dialogue_graph": { "nodes": {
                "start_first_time": {
                    "text": "Whoa there! This is my claim! I found this Power Regulator fair and square. You here for it? Kai send you?",
                    "conditions": [{ "type": "QUEST_STAGE", "quest_id": "q_the_signal", "stage": 1 }],
                    "options": [
                        { "text": "[QUEST] Yes. He needs it for Haven's power grid.", "destination_node": "kai_side" },
                        { "text": "[INT > 5] What are you planning to do with it?", "destination_node": "wrench_side", "conditions": [{ "type": "STAT_CHECK", "stat": "int", "min": 6 }] }
                    ]
                },
                "kai_side": { "text": "Of course he does. Always taking from us little folk. Fine, take it. But my community out here in the dust could've used the power.", "outcomes": [{ "type": "ITEM_GAIN", "item_id": "power_regulator" }, { "type": "QUEST_SET_STAGE", "quest_id": "q_the_signal", "stage": 2 }], "options": [{ "text": "I'm sorry. I have to take it.", "destination_node": "end_conversation" }] },
                "wrench_side": {
                    "text": "I'm rigging it to a water purifier for a scavenger outpost. Kai can afford his own tech. Help me, and I'll reward you. My people won't forget it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "q_the_signal", "stage": 3 },
                        { "type": "REPUTATION_CHANGE", "value": 15 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 }
                    ],
                    "options": [{ "text": "Deal. Keep the regulator.", "destination_node": "end_conversation" }] },
                "start_return": { "is_fallback": true, "text": "You again? This is still my scrap yard. Scram.", "options": [{ "text": "Leaving.", "destination_node": "end_conversation" }] }
            }}
        }
    },
    "rust_canyon": {
        "hermit_zane": { // HERMIT (Barter Chain NPC)
            "name": "Hermit Zane", "description": "A man whose face is hidden by a gas mask and layers of rags. He tinkers with a strange antenna.", "is_merchant": false,
            "dialogue_graph": { "nodes": {
                "start_first_time": { "text": "The hum... the hum! It never stops! Makes my teeth ache! Go away!", "options": [{ "text": "Wait, I need to talk to you.", "destination_node": "end_conversation" }] },
                "return_with_item": {
                    "text": "[QUEST] Is that... a Geiger Counter? The sweet sound of silence! Fine. You've earned your prize. Here are the FTL drive schematics you wanted.",
                    "conditions": [{ "type": "QUEST_STAGE", "quest_id": "q_hermits_wisdom", "stage": 2 }, { "type": "HAVE_ITEM", "item_id": "geiger_counter" }],
                    "outcomes": [{ "type": "ITEM_LOSE", "item_id": "geiger_counter" }, { "type": "ITEM_GAIN", "item_id": "drive_schematics" }, { "type": "QUEST_SET_STAGE", "quest_id": "q_hermits_wisdom", "stage": 3 }],
                    "options": [{ "text": "Thank you. Take care.", "destination_node": "end_conversation" }]
                },
                "start_return": { "is_fallback": true, "text": "Gah! Still here? Unless you can stop the hum, leave me to my misery!", "options": [{ "text": "I'm working on it.", "destination_node": "end_conversation" }] }
            }}
        }
    }
};

// --- 3. QUEST DATA ---
const QUEST_DATA = {
    "q_the_signal": {
        "title": "The Signal",
        "description": "Warden Kai of Haven has detected a strange signal from Relay Station Gamma and wants me to investigate its source.",
        "location": "haven",
        "giver": "warden_kai",
        "stages": {
            "0": "Not Started.",
            "1": "I need to travel to Relay Station Gamma and find the source of the signal.",
            "2": "I've acquired the Power Regulator from Wrench. I should return it to Warden Kai in Haven.",
            "100": "Completed: I gave the regulator to Warden Kai, securing Haven's power grid.",
            "101": "Completed: I allowed Wrench to keep the regulator for his community, angering Warden Kai."
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 150 },
                { "stat": "cap", "value": 100 },
                { "stat": "reputation", "value": 10 }
            ]
        }
    },
    "q_hermits_wisdom": {
        "title": "The Hermit's Wisdom",
        "description": "Dr. Araya's daughter, Zara, is stuck in Rust Canyon. She needs a 'Geiger Counter' to trade with a hermit for some important schematics.",
        "location": "haven",
        "giver": "dr_araya",
        "stages": {
            "0": "Not Started.",
            "1": "I need to find Zara in Rust Canyon.",
            "2": "Zara is safe. Now I need to find a Geiger Counter to trade with Hermit Zane for the schematics.",
            "3": "I have the schematics from Zane. I should return to Dr. Araya in Haven.",
            "100": "Completed: I delivered the schematics to Dr. Araya, helping her with her research and ensuring her daughter is safe."
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 250 },
                { "stat": "cap", "value": 50 }
            ]
        }
    }
};

// --- 4. ITEMS DATA ---
const ITEMS_DATA = {
    // Quest Items
    "power_regulator": { "name": "Power Regulator", "tradeable": false, "type": "quest", "price": 0 },
    "geiger_counter": { "name": "Geiger Counter", "tradeable": false, "type": "quest", "price": 0 },
    "drive_schematics": { "name": "FTL Drive Schematics", "tradeable": false, "type": "quest", "price": 0 },

    // New Items for Inventory Testing
    "stim_pack": {
        "name": "Stim-Pack", "tradeable": true, "type": "consumable", "price": 75,
        "stat_change": [{ "stat": "hp", "value": 20 }]
    },
    "nano_gloves": {
        "name": "Nano-Weave Gloves", "tradeable": true, "type": "gear", "price": 250,
        "stat_change": [{ "stat": "str", "value": 1 }]
    },
    "scrap_metal": { "name": "Scrap Metal", "tradeable": true, "type": "junk", "price": 10 },
    "broken_sensor": { "name": "Broken Sensor", "tradeable": true, "type": "junk", "price": 25 },
    "data_shard_corrupt": { "name": "Corrupted Data Shard", "tradeable": true, "type": "junk", "price": 5 }
};