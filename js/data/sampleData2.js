// --- LOCATION DATA ---
const LOCATION_DATA = {
    "aethelburg_sprawl": {
        "name": "Aethelburg Sprawl",
        "description": "A rain-slicked concrete canyon where flickering neon signs bleed into pools of rust and refuse. The air is thick with the smell of ozone and decay, a ghost city dreaming of a future that never was.",
        "npcs": ["cypher_jack", "sergeant_kail"]
    },
    "haven": {
        "name": "Haven",
        "description": "A small, fortified settlement built into the shell of a pre-catastrophe data center. The hum of servers and the smell of clean, filtered air is a stark contrast to the wastes outside. It is a beacon of order in the chaos.",
        "npcs": ["silas", "warden_kai", "echo"]
    },
    "glitch_canyon": {
        "name": "Glitch Canyon",
        "description": "A narrow chasm where the very air seems to shimmer and distort. Strange, crystalline formations grow from the rock, emitting a low, pulsating hum. This place feels unstable.",
        "npcs": []
    }
};

// --- NPC DATA ---
const NPC_DATA = {
    "aethelburg_sprawl": {
        "cypher_jack": {
            "name": "Cypher Jack",
            "description": "A man who seems to be in two places at once. One eye is a milky orb, the other a flickering cybernetic lens. He deals in information, the only currency that truly matters.",
            "is_merchant": false,
            "dialogue_graph": {
                "nodes": {
                    "start_first_time": {
                        "text": "Another construct wandering the grid... You're either looking for a way out or a way deeper in. The code is the same for both. What do you see in the static?",
                        "options": [
                            { "text": "I'm just trying to survive.", "destination_node": "survival_path" },
                            { "text": "I'm looking for answers.", "destination_node": "end_conversation" }
                        ]
                    },
                    "survival_path": {
                        "text": "Survival is an illusion. A loop in the program. But I can show you the glitches, the backdoors. For a price, of course. Come back when you have something worth my time. Not caps. Information.",
                        "options": [ { "text": "I'll keep that in mind.", "destination_node": "end_conversation" } ]
                    }
                }
            }
        },
        "sergeant_kail": {
            "name": "Sergeant Kail",
            "description": "His face is a roadmap of scars, his armor a patchwork of pre-catastrophe riot gear and gleaming steel plates. He stands guard, a bulwark against the coming chaos.",
            "is_merchant": false,
            "dialogue_graph": {
                "nodes": {
                    "start_first_time": {
                        "text": "Halt. This sector is under the Warden's protection. State your business or I'll make you state it to the crows. We have no time for shades and whispers here.",
                        "options": [
                            { "text": "Just passing through.", "destination_node": "passing_through" },
                            { "text": "Who is the Warden?", "destination_node": "end_conversation" }
                        ]
                    },
                    "passing_through": {
                        "text": "See that you do. The Sprawl has a way of swallowing the unwary. Stick to the lit paths. The shadows here have teeth, and they answer to powers older than this rust-heap city. Now, move along.",
                        "options": [ { "text": "Right. Moving on.", "destination_node": "end_conversation" } ]
                    }
                }
            }
        }
    },
    "haven": {
        "silas": {
            "name": "Silas",
            "description": "A merchant with a wry smile and eyes that miss nothing. His stall is an organized collection of scrap, tech, and scavenged goods.",
            "is_merchant": true,
            "dialogue_graph": {
                "nodes": {
                    "start_first_time": {
                        "text": "Fresh off the dust trail, eh? Take a look. Everything has a price, but not everything has a label. What are you after?",
                        "options": [
                            { "text": "Let's trade.", "destination_node": "trade" },
                            { "text": "[INT > 5] You seem to have a knack for acquiring rare tech.", "destination_node": "rare_tech_path", "conditions": [{ "type": "STAT_CHECK", "stat": "int", "min": 6 }] },
                            { "text": "Just looking.", "destination_node": "end_conversation" }
                        ]
                    },
                    "rare_tech_path": {
                        "text": "Sharp eye. Most just see junk. I appreciate a discerning customer. Here, a little something for recognizing quality. A data shard, fresh from a corporate vault. Don't ask.",
                        "outcomes": [{ "type": "ITEM_GAIN", "item_id": "data_shard" }],
                        "options": [
                            { "text": "Thank you. Now, let's see what you have.", "destination_node": "trade" }
                        ]
                    },
                    "trade": {
                        "text": "Show me what you've got.",
                        "options": [ { "text": "End trade.", "destination_node": "end_conversation" } ]
                    }
                }
            }
        },
        "warden_kai": {
            "name": "Warden Kai",
            "description": "His armor is pristine, his posture rigid. He watches over Haven with a disciplined gaze, a symbol of order in a chaotic world.",
            "is_merchant": false,
            "dialogue_graph": {
                "nodes": {
                    "start_first_time": {
                        "text": "This is a protected zone. We have rules. You follow them, we have no problems. You break them... I am the problem. State your purpose.",
                        "options": [
                            { "text": "I'm here for sanctuary and trade.", "destination_node": "lawful_path" },
                            { "text": "[STR > 5] I go where I please. Try and stop me.", "destination_node": "aggressive_path", "conditions": [{ "type": "STAT_CHECK", "stat": "str", "min": 6 }] },
                            { "text": "Just passing through.", "destination_node": "end_conversation" }
                        ]
                    },
                    "lawful_path": {
                        "text": "Good. Sensible people are welcome here. Don't cause trouble, and trouble won't find you. We can offer safety, for a time. Your reputation precedes you.",
                        "outcomes": [{ "type": "REPUTATION_CHANGE", "value": 5 }],
                        "options": [ { "text": "I understand.", "destination_node": "end_conversation" } ]
                    },
                    "aggressive_path": {
                        "text": "That's a bold stance to take in my town. I admire the spine, but not the attitude. I'll be watching you. Don't give me a reason to act on it.",
                        "outcomes": [{ "type": "REPUTATION_CHANGE", "value": -5 }],
                        "options": [ { "text": "You'll have no reason to.", "destination_node": "end_conversation" } ]
                    }
                }
            }
        },
        "echo": {
            "name": "Echo",
            "description": "A figure cloaked in rags, sitting cross-legged by a humming server bank. They don't seem to notice you until you speak.",
            "is_merchant": false,
            "dialogue_graph": {
                "nodes": {
                    "start_first_time": {
                        "text": "The signal is weak, but you... you resonate. A question flickers in the data stream. Do you seek the static or the silence?",
                        "options": [
                            { "text": "What are you talking about?", "destination_node": "confusion_path" },
                            { "text": "[LCK > 5] The silence between the noise.", "destination_node": "wisdom_path", "conditions": [{ "type": "STAT_CHECK", "stat": "lck", "min": 6 }] }
                        ]
                    },
                    "confusion_path": {
                        "text": "The pattern is not for everyone to see. Return when your personal signal is stronger.",
                        "options": [ { "text": "Right...", "destination_node": "end_conversation" } ]
                    },
                    "wisdom_path": {
                        "text": "A lucky guess... or true resonance? No matter. The stream shows you a path. A canyon where the world glitches. A place of power and danger. I have marked it for you. Seek it, if you dare.",
                        "outcomes": [
                            { "type": "STAT_CHANGE", "stat": "xp", "value": 50 },
                            { "type": "LOCATION_UNLOCK", "location_id": "glitch_canyon" }
                        ],
                        "options": [ { "text": "You have my thanks.", "destination_node": "end_conversation" } ]
                    }
                }
            }
        }
    }
};

// --- QUEST DATA (not used yet) ---
const QUEST_DATA = {};

// --- ITEM DATA ---
const ITEMS_DATA = {
    "data_shard": {
        "name": "Data Shard",
        "tradeable": true,
        "type": "junk",
        "price": 150
    }
};