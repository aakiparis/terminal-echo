const LOCATION_DATA = {
    "neon_nexus": {
        "name": "Neon Nexus",
        "description": "A bustling marketplace cobbled together in the ruins of an old subway station. The air hums with the glow of repurposed neon signs and the chatter of traders.",
        "npcs": ["zane", "mara", "rex", "selene"]
    }
};

const NPC_DATA = {
    "neon_nexus": {
        "zane": {
            "name": "Zane",
            "description": "A jittery technician with a constant stream of data flowing through his cybernetic eye. He seems to be tinkering with a datapad.",
            "is_merchant": true,
            "inventory": ["stimpack", "military_goggles"],
            "dialogue_graph": {
                // start node lists all possible sub-graphs
                "start": {
                    "response": "Whoa there, new face. Welcome to the Nexus. I'm Zane. You looking to trade, or just soaking in the ambiance?",
                    "destination_nodes": [
                        { "node_id": "nexus_story_1" },
                        { "node_id": "quest_intro" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                // return node allows to remind the location storu again and ensures acces to all other available sub-graphs (i.e. trade and quest-related). Important: NPCs reposnse doesn't allude the quest was accepted or completed.
                "return": {
                    "response": "You're back. Good.",
                    "destination_nodes": [
                        { "node_id": "nexus_story_1", "prompt_replacement": "Hey, can you remind me what this place is?"},
                        { "node_id": "trade" },
                        { "node_id": "quest_intro", "prompt_replacement": "You were saing something about problems with power supply, weren't you?" }, // this option is conditional and allows to get to the quest if it wasn't accepted the first time
                        { "node_id": "quest_reminder" }, // this option is conditional and shows up only if Zane's quest was accepted
                        { "node_id": "end" }
                    ]
                },
                // nexus_story_1 and nexus_story_2 tell the story. Then open a gate to a quest sub-graph
                "nexus_story_1": {
                    "prompt": "Tell me about this place.",
                    "response": "This? This is the heart of the sector. Built from the bones of an old subway. We've got power, trade, and relative safety. What more could you want?",
                    "destination_nodes": [
                        { "node_id": "nexus_story_2" }
                    ]
                },
                "nexus_story_2": {
                    "prompt": "How do you keep the power on?",
                    "response": "That's my department. Scavenged geothermal regulators. Tricky to maintain, but they keep the lights on and the mutants out. It's a constant battle, though. Parts are scarce.",
                    "destination_nodes": [
                        { "node_id": "quest_intro" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "trade": {
                    "prompt": "Let's see what you've got.",
                    "response": "Always happy to barter. My gear is top-notch, you won't find better.",
                    "destination_nodes": [
                        // { "node_id": "start", "prompt_replacement": "Anything else I can help with?"}
                        { "node_id": "end"}
                    ]
                },
                "quest_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 0 },
                    "prompt": "You seem like you have a problem.",
                    "response": "Astute observation. One of my critical regulators is failing. The diagnostic signature is... corrupted. I need someone to plant a data scrambler on the main junction box to force a reset. The problem is, it's deep in the old service tunnels.",
                    "outcomes": [],
                    "destination_nodes": [
                        { "node_id": "quest_accept" },
                        { "node_id": "quest_details" },
                        { "node_id": "quest_reject" }
                    ]
                },
                "quest_details": {
                    "prompt": "Tell me more about these tunnels.",
                    "response": "Dark, tight, and full of... well, let's just say the original maintenance crews aren't around anymore. But you look like you can handle yourself. The junction box is in the main control room. You can't miss it.",
                    "destination_nodes": [
                        { "node_id": "quest_accept" },
                        { "node_id": "quest_reject" }
                    ]
                },
                "quest_accept": {
                    "prompt": "I'll do it. Where's this scrambler?",
                    "response": "That's the spirit! Here, take it. Just place it on the junction box. It'll do the rest. Be careful down there.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "data_scrambler" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_reject": {
                    "prompt": "Sounds too dangerous. I'm out.",
                    "response": "Your loss. Don't come crying to me when the lights go out for good.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                    "prompt": "About that regulator...",
                    "response": "The clock is ticking. Get that scrambler on the junction box before the whole grid goes dark.",
                    "destination_nodes": [
                        { "node_id": "quest_completion" }, // conditional, if player has the required item
                        { "node_id": "end" }
                    ]
                },
                "quest_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "adaptive_circuit" },
                    "prompt": "I found this adaptive circuit near the junction after the reset.",
                    "response": "An adaptive circuit? And it's intact! This... this is incredible. This is the missing piece I needed! You didn't just reset the system, you've given me a way to upgrade it. I'm in your debt. Here, take this for your trouble. You've earned it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "adaptive_circuit" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 300 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 250 },
                        { "type": "REPUTATION_CHANGE", "value": 10 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "Happy to help!" }
                    ]
                },
                "end": {
                    "prompt": "See you around.",
                    "response": "Stay sharp out there."
                }
            }
        },
        "mara": {
            "name": "Mara",
            "description": "A stoic scavenger with a haunted look in her eyes. She carries a well-maintained rifle and watches the market crowds with suspicion.",
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "What do you want? I'm busy.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1" },
                        { "node_id": "mara_zane_story_1" },
                        { "node_id": "zane_quest" }, // conditional, if Zane's quest has started
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You again. State your business.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1", "prompt_replacement": "My memory serves me poor, could you please remind me what do you do here?" },
                        { "node_id": "mara_zane_story_1" },
                        { "node_id": "zane_quest" }, // conditional, if Zane's quest has started
                        { "node_id": "end" }
                    ]
                },
                "mara_story_1": {
                    "prompt": "What's your story?",
                    "response": "My story is written in scrap and survival. I was part of a scavenger crew out of the Rust Canyons. We were good. Too good.",
                    "destination_nodes": [
                        { "node_id": "mara_story_2" }
                    ]
                },
                "mara_story_2": {
                    "prompt": "What happened to your crew?",
                    "response": "We hit an old-world tech depot. Alarms, automated defenses... a slaughter. I was the only one who made it out. I carry their tags to remember them.",
                    "destination_nodes": [
                        { "node_id": "mara_story_3" }
                    ]
                },
                "mara_story_3": {
                    "prompt": "That's rough. What are you doing here?",
                    "response": "Lying low. Trading what I can find. The Nexus is safer than the wastes, but nowhere is truly safe. You learn that fast.",
                    "destination_nodes": [
                        { "node_id": "mara_zane_story_1" }, // allows to transit from mara_story sub-graph to mara_zane_story
                        { "node_id": "end" }
                    ]
                },
                "mara_zane_story_1": {
                    "prompt": "What do you know about Zane?",
                    "response": "The tech-head? He keeps the lights on, so people tolerate his... eccentricities. He's obsessed with the old tech. Thinks it holds all the answers.",
                    "destination_nodes": [
                        { "node_id": "mara_zane_story_2" }
                    ]
                },
                "mara_zane_story_2": {
                    "prompt": "You don't trust him?",
                    "response": "I don't trust anyone who thinks machines are more reliable than people. He sent my last partner on a 'simple' salvage run into the tunnels. He never came back.",
                    "destination_nodes": [
                        { "node_id": "mara_zane_story_3" }
                    ]
                },
                "mara_zane_story_3": {
                    "prompt": "He sent me into those tunnels.",
                    "response": "Did he now? Then be careful. His 'simple' runs have a way of getting complicated. My partner was looking for an 'adaptive circuit'. Never even knew what it was for. Just a prize for Zane to play with.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1" }, // allows to transit from mara_zane_story sub-graph to mara_story
                        { "node_id": "zane_quest" }, // conditional, if Zane's quest has started
                        { "node_id": "end" }
                    ]
                },
                "zane_quest": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                    "prompt": "Zane asks for help with his regulator. Do you know what is that?",
                    "response": "Ah, yes, I have adaptaive cicuit.",
                    "outcomes": [],
                    "destination_nodes": [
                        { "node_id": "zane_quest_barter" }, // conditional if user has
                        { "node_id": "zane_quest_get_for_free" }, // conditional if LCK gre 7
                        { "node_id": "end", "prompt_replacement": "Ah, nothing. Forget it."} // fallback if any of the conditions above are met
                    ]
                },
                "zane_quest_get_for_free": {
                    "condition": { "type": "STAT_CHECK", "stat": "lck", "min": 7  },
                    "prompt": "Can I get it for free? Pleeease",
                    "response": "Sure, why not?! Power supply is crutial for Neon Nexus, we all will benefit form properly working power generator.",
                    "outcomes": [
                        { "type": "ITEM_GAIN", "item_id": "adaptive_circuit" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "You are so kind! You made my day!" }
                    ]
                },
                "zane_quest_barter": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "data_scrambler" },
                    "prompt": "Is there a way to get it?",
                    "response": "Sure, why not?! You give me data scrambler, I'll give you adaptive_circuit. Deal?",
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "data_scrambler" },
                        { "type": "ITEM_GAIN", "item_id": "adaptive_circuit" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "It seems there was any other way. Thanks." }
                    ]
                },
                "end": {
                    "prompt": "I'll leave you to it.",
                    "response": "Good."
                }
            }
        },
        "rex": {
            "name": "Rex",
            "description": "A broad-shouldered man in patchwork armor, leaning against a support pillar. His gaze sweeps over the market, missing nothing.",
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "Keep your hands where I can see them. I'm Rex. I handle security. Don't cause trouble, and we'll get along fine.",
                    "destination_nodes": [
                        { "node_id": "rex_story_1" },
                        { "node_id": "quest_pest_control_intro" },
                        { "node_id": "selene_story_reaction" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You again. Still keeping out of trouble?",
                    "destination_nodes": [
                        { "node_id": "quest_pest_control_intro", "prompt_replacement": "About that pest problem..." },
                        { "node_id": "selene_story_reaction" },
                        { "node_id": "quest_pest_control_reminder" },
                        { "node_id": "quest_selene_intro_reaction" },
                        { "node_id": "end" }
                    ]
                },
                "rex_story_1": {
                    "prompt": "You're in charge here?",
                    "response": "Someone has to be. The Nexus is a beacon, and beacons attract everything, good and bad. I make sure the bad doesn't stick around.",
                    "destination_nodes": [ { "node_id": "rex_story_2" } ]
                },
                "rex_story_2": {
                    "prompt": "Sounds like a tough job.",
                    "response": "It's a necessary one. This place is one of the few things left that works. I aim to keep it that way.",
                    "destination_nodes": [ { "node_id": "quest_pest_control_intro" }, { "node_id": "end" } ]
                },
                "quest_pest_control_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 0 },
                    "prompt": "Need any help with security?",
                    "response": "Maybe. We've got Glow-Rats nesting in the lower tunnels. Getting bolder. Chewing on things they shouldn't. I need them cleared out before they cause a real problem.",
                    "destination_nodes": [ { "node_id": "quest_pest_control_accept" }, { "node_id": "quest_pest_control_reject" }]
                },
                "quest_pest_control_accept": {
                    "prompt": "I can handle some rats.",
                    "response": "Good. Don't get cocky. They're fast and there's more than a few. Take care of them and I'll make it worth your while.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 1 }],
                    "destination_nodes": [ 
                        { "node_id": "quest_pest_control_down_to_the_tunnels" },
                    ]
                },
                "quest_pest_control_down_to_the_tunnels": {
                    "prompt": "[ Stepping to the lower tunnels]",
                    "response": "Oh, damn! There were hordes of this.. disgusting creates. There were not peacful at all! But you did it! Also almost at the end, you spotted something odd in a junk...",
                    "outcomes": [
                        { "type": "ITEM_GAIN", "item_id": "glowing_pendant" },
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -10 }
                    ],
                    "destination_nodes": [ { "node_id": "quest_pest_control_completion" } ]
                },
                "quest_pest_control_reject": {
                    "prompt": "Not my problem.",
                    "response": "Fine. More for the rest of us to deal with.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_pest_control_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 1 },
                    "prompt": "Update on the Glow-Rats.",
                    "response": "Update? Either they're gone or they're not. Get it done.",
                    "destination_nodes": [ { "node_id": "quest_pest_control_completion" }, { "node_id": "end" } ]
                },
                "quest_pest_control_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "glowing_pendant" },
                    "prompt": "The Glow-Rats are gone. I found this on the alpha.",
                    "response": "Good work. Let me see that... a pendant? Glowing? I've seen symbols like this before. The mystic, Selene, she's into this sort of junk. Maybe show it to her. Here's your payment. You earned it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 100 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 1 },
                        // { "type": "ITEM_LOSE", "item_id": "glowing_pendant" },
                        // { "type": "ITEM_GAIN", "item_id": "glowing_pendant" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 300 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 150 },
                        { "type": "REPUTATION_CHANGE", "value": 5 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "selene_story_reaction": {
                    "prompt": "What do you know about Selene?",
                    "response": "The 'mystic'? She keeps to herself. Says the neon speaks to her. As long as she doesn't spook the traders, I leave her be.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_selene_intro_reaction": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "echoes_of_the_past", "stage": 2 },
                    "prompt": "Selene sent me. We need to open a maintenance hatch.",
                    "response": "She did, huh? That hatch hasn't been opened in years. Fine. But if you break anything, you answer to me. Stand back.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 3 }],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { "prompt": "Stay safe.", "response": "You too." }
            }
        },
        "selene": {
            "name": "Selene",
            "description": "A woman with unnervingly bright eyes sits cross-legged on a worn rug, surrounded by strange trinkets and humming softly to the neon glow.",
            "is_merchant": false,
            "dialogue_graph": {
                "start": {
                    "response": "The light brings another seeker. Welcome. Do you listen to the hum, or are you just passing through the noise?",
                    "destination_nodes": [
                        { "node_id": "selene_story_1" },
                        { "node_id": "quest_echoes_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "The pattern repeats. You are here again. What does the light wish you to know?",
                    "destination_nodes": [
                        { "node_id": "selene_story_1", "prompt_replacement": "What do you mean?" },
                        { "node_id": "quest_echoes_intro" },
                        { "node_id": "quest_echoes_reminder" },
                        { "node_id": "quest_echoes_completion" },
                        { "node_id": "end" }
                    ]
                },
                "selene_story_1": {
                    "prompt": "What do you mean 'the hum'?",
                    "response": "The voice of the old world. The stories trapped in the glass and gas. Most people just see light. I hear the echoes.",
                    "destination_nodes": [ { "node_id": "selene_story_2" } ]
                },
                "selene_story_2": {
                    "prompt": "So you're a mystic?",
                    "response": "A label for those who cannot hear. I am a listener. The station remembers everything. The fear, the hope... the day the trains stopped.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_echoes_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "echoes_of_the_past", "stage": 1 },
                    "prompt": "Rex said to show you this pendant.",
                    "response": "Ah, the light returns to its source. This was... a key. An amplifier for the station's voice. A great beast holds it now, but the true echo is locked away. Will you help me find it?",
                    "destination_nodes": [ { "node_id": "quest_echoes_accept" }, { "node_id": "quest_echoes_reject" } ]
                },
                "quest_echoes_accept": {
                    "prompt": "I'll help you find this 'echo'.",
                    "response": "Good. The pendant is a key, but the lock is rusted shut. A maintenance hatch in the western corridor. Rex, the guardian, is the only one strong enough to open it. Show him you are worthy.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 2 }],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_echoes_reject": {
                    "prompt": "This is too weird for me.",
                    "response": "The hum is not for everyone. Go back to the noise. The light will wait.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_echoes_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "echoes_of_the_past", "stage": 2 },
                    "prompt": "About that rusted lock...",
                    "response": "The guardian, Rex, must be convinced. His strength is the key to the next path. The light will not be denied.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_echoes_completion": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "echoes_of_the_past", "stage": 3 },
                    "prompt": "The hatch is open.",
                    "response": "You have done it! The echo is clear now... a memory. Not of the fall, but of the beginning. This was a shelter. A promise of safety. This knowledge must be protected. Thank you, seeker. The hum is stronger because of you.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "glowing_pendant" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 400 },
                        { "type": "REPUTATION_CHANGE", "value": 5 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { "prompt": "I should go.", "response": "The light fades, but is never gone." }
            }
        }
    }
};

const QUEST_DATA = {
    "glitch_in_the_system": {
        "title": "Glitch in the System",
        "description": "Zane, the technician in Neon Nexus, needs help resetting a failing power regulator by planting a data scrambler in the old service tunnels.",
        "location": "neon_nexus",
        "giver": "zane",
        "stages": {
            "0": "Not started",
            "1": "Plant the data scrambler on the junction box in the service tunnels.",
            "100": "Completed"
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 300 },
                { "stat": "caps", "value": 250 },
                { "stat": "reputation", "value": 10 }
            ]
        }
    },
    "pest_control": {
        "title": "Pest Control",
        "description": "Rex, the head of security, needs someone to clear out an infestation of Glow-Rats from the lower tunnels before they damage critical systems.",
        "location": "neon_nexus",
        "giver": "rex",
        "stages": { "0": "Not started", "1": "Clear out the Glow-Rat nest.", "100": "Completed" },
        "rewards": { "items": [], "stat_change": [ { "stat": "xp", "value": 200 }, { "stat": "caps", "value": 150 } ] }
    },
    "echoes_of_the_past": {
        "title": "Echoes of the Past",
        "description": "Selene, the mystic, believes a pendant found in the tunnels is the key to unlocking a memory of the station. She needs help accessing a sealed area.",
        "location": "neon_nexus",
        "giver": "selene",
        "stages": {
            "0": "Not started",
            "1": "A strange pendant was found on the alpha Glow-Rat. Rex suggested showing it to Selene.",
            "2": "Selene believes the pendant is a key. Convince Rex to open the sealed maintenance hatch in the western corridor.",
            "3": "The hatch is open. Return to Selene with the news.",
            "100": "Completed"
        },
        "rewards": { "items": [], "stat_change": [ { "stat": "xp", "value": 400 }, { "stat": "reputation", "value": 5 } ] }
    }
};

const ITEMS_DATA = {
    "data_scrambler": {
        "name": "Data Scrambler",
        "tradeable": false,
        "type": "quest",
        "price": 0
    },
    "adaptive_circuit": {
        "name": "Adaptive Circuit",
        "tradeable": false,
        "type": "quest",
        "price": 0
    },
    "stimpack": {
        "name": "Stimpack",
        "tradeable": true,
        "type": "consumable",
        "stat_change": [
            { "stat": "hp", "value": 10 }
        ],
        "price": 20
    },
    "military_goggles": {
        "name": "Military Goggles",
        "tradeable": true,
        "type": "gear",
        "stat_change": [
            { "stat": "int", "value": 1 }
        ],
        "price": 100
    },
    "energy_cell": { "name": "Energy Cell", "tradeable": true, "type": "junk", "price": 25 },
    "glowing_pendant": { "name": "Glowing Pendant", "tradeable": false, "type": "quest", "price": 0 }

};

console.log('game.js: LOCATION_DATA', LOCATION_DATA);
console.log('game.js: NPC_DATA', NPC_DATA);
console.log('game.js: QUEST_DATA', QUEST_DATA);
console.log('game.js: ITEMS_DATA', ITEMS_DATA);