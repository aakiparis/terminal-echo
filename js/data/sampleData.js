const LOCATION_DATA = {
    "neon_nexus": {
        "name": "Neon Nexus",
        "description": "A bustling marketplace cobbled together in the ruins of an old subway station. The air hums with the glow of repurposed neon signs and the chatter of traders.",
        "npcs": ["zane", "mara", "rex", "selene"]
    },
    "nexus_old_tunnel": {
        "name": "Nexus Old Tunnel",
        "description": "The service tunnels are a dark, cramped maze of pipes and forgotten machinery. The air is thick with the smell of ozone and decay.",
        "npcs": ["power_generator", "tunnel_passage"]
    },
    "the_forgotten_outpost": {
        "name": "The Forgotten Outpost",
        "description": "An old, fortified communications outpost perched precariously on a rocky spire. Its main antenna twitches, broadcasting a faint, looping signal into the wastes.",
        "npcs": ["elder_kian", "silas", "lena", "fixer_finn"]
    },
    "global_seed_vault": {
        "name": "Global Seed Vault",
        "description": "A massive blast door is set into the side of a mountain, bearing the faded logo of an old-world agricultural corporation. A single, weathered terminal screen glows nearby.",
        "npcs": ["vault_terminal"]
    },
    "hound_den": {
        "name": "The Hound's Den",
        "description": "A sheltered cave system littered with scavenged technology and animal bones. The air hums with the low thrum of power cores and the scent of ozone.",
        "npcs": ["dog_guard_alpha", "dog_leader_rex"]
    },
    "rust_pit": {
        "name": "The Rust Pit",
        "description": "A grimy, open-air workshop built in the hollowed-out chassis of a colossal mining machine. The air smells of ozone and hot metal, and the clang of hammers is constant.",
        "npcs": ["boss_valeria", "ratchet", "doc_eris", "whisper"]
    }
};

const NPC_DATA = {
    "neon_nexus": {
        "zane": {
            "name": "Zane",
            "type": "npc",
            "is_available": true,
            "description": "A jittery technician with a constant stream of data flowing through his cybernetic eye. He seems to be tinkering with a datapad.",
            "is_merchant": true,
            "inventory": ["stimpack", "military_goggles", "harmonic_resonator"],
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
                        { "node_id": "quest_intro", "prompt_replacement": "You were saying something about problems with power supply, weren't you?" }, // this option is conditional and allows to get to the quest if it wasn't accepted the first time
                        { "node_id": "quest_reminder" }, // this option is conditional and shows up only if Zane's quest was accepted
                        { "node_id": "quest_completion" }, // this option is conditional for quest completion
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
                        { "node_id": "return", "prompt_replacement": "Anything else I can help with?"}
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
                    "response": "That's the spirit! Here, take it. Just place it on the junction box. It'll do the rest. Be careful down there. The entrance to the tunnels is just past the market.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "data_scrambler" },
                        { "type": "LOCATION_UNLOCK", "location_id": "nexus_old_tunnel" },
                        { "type": "NPC_UNLOCK", "location_id": "nexus_old_tunnel" , "npc_id": "power_generator" },
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
                    "response": "The clock is ticking. Get that scrambler on the junction box before the whole grid goes dark. The tunnels aren't safe.",
                    "destination_nodes": [
                        { "node_id": "quest_completion" }, // conditional, if player has the required item
                        { "node_id": "end" }
                    ]
                },
                "quest_completion": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 2 },
                    "prompt": "I planted the scrambler. The system should be reset.",
                    "response": "You did it? Fantastic! The diagnostic is clearing up already. You've saved the Nexus from going dark. I'm in your debt. Here, take this for your trouble. You've earned it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 100 },
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
            "type": "npc",
            "is_available": true,
            "description": "A stoic scavenger with a haunted look in her eyes. She carries a well-maintained rifle and watches the market crowds with suspicion.",
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "What do you want? I'm busy.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1" },
                        { "node_id": "mara_zane_story_1" },
                        { "node_id": "zane_quest_reaction" }, // Reacts if player has started Zane's quest
                        // { "node_id": "partner_item_story" }, // Reacts if player has the bone charm
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You again. State your business.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1", "prompt_replacement": "Can you remind me what you do here?" },
                        { "node_id": "mara_zane_story_1" },
                        { "node_id": "zane_quest_reaction" },
                        { "node_id": "partner_item_story" },
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
                        { "node_id": "return" , "prompt_replacement": "Let's talk about something else." }
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
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "maras_partner_fate", "stage": 0 }
                    ],
                    "destination_nodes": [
                        { "node_id": "mara_zane_story_3" },
                        { "node_id": "return" , "prompt_replacement": "Let's talk about something else."},
                    ]
                },
                "mara_zane_story_3": {
                    // TODO: add condition to check if either player has started Zane's quest or make sure this node is reachable at the time of returning to Mara
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 1, "op": "gte" },
                    "prompt": "Zane sent me into those tunnels.",
                    "response": "Did he now? Then be careful. His 'simple' runs have a way of getting complicated. My partner was looking for an 'adaptive circuit' for one of Zane's projects. Never even knew what it was for. Just a prize for Zane to play with.",
                    "destination_nodes": [
                        { "node_id": "partner_item_story" },
                        { "node_id": "end" }
                    ]
                },
                "zane_quest_reaction": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 1, "op": "gte" },
                    "prompt": "About Zane's quest...",
                    "response": "You're heading into the tunnels for him, aren't you? Be smart. Don't end up like my last partner. Keep your eyes open for more than just a junction box.",
                    "outcomes": [],
                    "destination_nodes": [
                        { "node_id": "partner_item_show" },
                        { "node_id": "partner_item_keep" },
                        { "node_id": "end"}
                    ]
                },
                "partner_item_story": {
                    // TODO: compound condition AND: HAVE_ITEM("bone_charm") and QUEST_STAGE isn't finished
                    "condition": { "type": "HAVE_ITEM", "item_id": "bone_charm" },
                    "prompt": "I found something in the tunnels...",
                    "response": "What?",
                    "destination_nodes": [
                        { "node_id": "partner_item_show" },
                        { "node_id": "partner_item_keep" },
                        { "node_id": "end", "prompt_replacement": "Still nothing" }
                    ]
                },
                "partner_item_show": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "bone_charm" },
                    "prompt": "Here, look at it this tiny thing... It was... across someone's bones..",
                    "response": "Bones? Let me see what you found... this charm... it was his. He carved it himself from a rat-king's femur. So that's where he ended up. At least... at least now I know. He always said it brought him luck. Looks like it ran out. Keep it. A reminder that luck is something you make, not find. You brought me closure. That's worth more than caps. You've earned my respect.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "maras_partner_fate", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 },
                        { "type": "REPUTATION_CHANGE", "value": 15 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "I'm sorry for your loss." }
                    ]
                },
                "partner_item_keep": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "bone_charm" },
                    "prompt": "I wanted to let you know that I was in the tunnels, and... I've saw someone's bones next to the power generator.",
                    "response": "I see. Just knowing where he fell... it's enough. Thank you for telling me. It's more than anyone else has done.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "maras_partner_fate", "stage": 100 },
                        { "type": "REPUTATION_CHANGE", "value": 5 }
                    ],
                     "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "He won't be forgotten." }
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
            "type": "npc",
            "is_available": true,
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
                        { "node_id": "quest_pest_control_intro" },
                        //{ "node_id": "quest_pest_control_reminder" },
                        { "node_id": "quest_pest_control_completion" },
                        { "node_id": "selene_story_reaction" },
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
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 1 },
                        { "type": "LOCATION_UNLOCK", "location_id": "nexus_old_tunnel" },
                        { "type": "NPC_UNLOCK", "location_id": "nexus_old_tunnel" , "npc_id": "tunnel_passage" },
                    ],
                    "destination_nodes": [ 
                        { "node_id": "end" }
                    ]
                },
                "quest_pest_control_reject": {
                    "prompt": "Not my problem.",
                    "response": "Fine. More for the rest of us to deal with.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                // "quest_pest_control_reminder": {
                //     "condition": { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 1 },
                //     "prompt": "Update on the Glow-Rats.",
                //     "response": "Update? Either they're gone or they're not. Get it done.",
                //     "destination_nodes": [ { "node_id": "quest_pest_control_completion" }, { "node_id": "end" } ]
                // },
                "quest_pest_control_completion": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 3 },
                    "prompt": "The Glow-Rats are gone. I cleared the nest.",
                    "response": "Good work. That's one less problem to worry about. I found this near the nesting site, looks like the alpha was hoarding it. Here's your payment. You earned it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 100 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 1 },
                        // { "type": "ITEM_GAIN", "item_id": "glowing_pendant" },
                        // { "type": "STAT_CHANGE", "stat": "xp", "value": 200 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 150 },
                        { "type": "REPUTATION_CHANGE", "value": 10 }
                    ],
                    "destination_nodes": [ { "node_id": "quest_pest_control_completion_selene" } ]
                },
                "quest_pest_control_completion_selene": {
                    "prompt": "What's this pendant?",
                    "response": "Glowing junk. The mystic, Selene, she's into this sort of thing. Maybe show it to her. Might be worth something to her.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "selene_story_reaction": {
                    "prompt": "What do you know about Selene?",
                    "response": "The 'mystic'? She keeps to herself. Says the neon speaks to her. As long as she doesn't spook the traders, I leave her be.",
                    "destination_nodes": [ { "node_id": "return", "prompt_replacement": "One more question..." } ]
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
            "type": "npc",
            "is_available": true,
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
                        { "node_id": "selene_story_1", "prompt_replacement": "What do you mean by 'the hum'?" },
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
                    "response": "Ah, the light returns to its source. This was... a key. An amplifier for the station's voice. A great beast held it, but the true echo is locked away, in a place only the founders knew. Will you help me find it?",
                    "destination_nodes": [ { "node_id": "quest_echoes_accept" }, { "node_id": "quest_echoes_reject" } ]
                },
                "quest_echoes_accept": {
                    "prompt": "I'll help you find this 'echo'.",
                    "response": "Good. The pendant is a key, but the lock is rusted shut. A maintenance hatch in the western corridor. Rex, the guardian, is the only one strong enough to open it. Show him you are worthy, and he will listen.",
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
                    "response": "You have done it! The echo is clear now... a memory. Not of the fall, but of the beginning. This was a shelter. A promise. The founders built an outpost, a beacon of hope. Its location is inside this memory. You have unlocked The Forgotten Outpost.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 100 },
                        { "type": "LOCATION_UNLOCK", "location_id": "the_forgotten_outpost" },
                        { "type": "ITEM_LOSE", "item_id": "glowing_pendant" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 400 },
                        { "type": "REPUTATION_CHANGE", "value": 5 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { "prompt": "I should go.", "response": "The light fades, but is never gone." }
            }
        }
    },
    "nexus_old_tunnel": {
        "power_generator": {
            "name": "Power Generator",
            "type": "device",
            "is_available": false,
            "description": "A massive, humming piece of old-world machinery. A control panel flickers erratically, covered in warning glyphs. This is the junction box Zane mentioned.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ The generator hums with a low, guttural frequency. A service port is open on its side, waiting. ]",
                    "destination_nodes": [
                        { "node_id": "install_scrambler" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The generator hums with a low, guttural frequency. A service port is open on its side, waiting. ]",
                    "destination_nodes": [
                        { "node_id": "install_scrambler" },
                        { "node_id": "investigate_aftermath" },
                        { "node_id": "end" }
                    ]
                },
                "install_scrambler": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "data_scrambler" },
                    "prompt": "[ Access the service port to install the scrambler ]",
                    "response": "[ You slide the data scrambler into the port. Lights on the panel flash wildly as the device begins its work. Suddenly, you hear a frantic skittering from the darkness. ]",
                    "destination_nodes": [
                        { "node_id": "rat_attack" }
                    ]
                },
                "rat_attack": {
                    "prompt": "[ Defend yourself! ]",
                    "response": "[ A swarm of glow-rats bursts from a nearby conduit, enraged by the energy fluctuations! You fight them off, but not before one sinks its teeth into your leg. The last rat falls, and the generator emits a steady, calm hum. The scrambler has done its job. ]",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -15 },
                        { "type": "ITEM_LOSE", "item_id": "data_scrambler" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 2 }
                    ],
                    "destination_nodes": [
                        { "node_id": "investigate_aftermath" }
                    ]
                },
                "investigate_aftermath": {
                    // "condition": { "type": "QUEST_STAGE", "quest_id": "maras_partner_fate", "stage": 1},
                    "prompt": "[ Look around the area ]",
                    "response": "[ With the generator reset and the rats gone, the area is quiet. The steady hum is almost peaceful. In the dim light, you spot something lying in the dust next to the generator, entangled in what looks like old, brittle bones. ]",
                    "destination_nodes": [
                        { "node_id": "find_item" },
                        { "node_id": "check_history" },
                        { "node_id": "end" }
                    ]
                },
                "find_item": {
                    "prompt": "[ Pick up the item ]",
                    "response": "[ You pick up a small, crudely carved charm made of bone. It feels strangely lucky. ]",
                    "outcomes": [
                        { "type": "ITEM_GAIN", "item_id": "bone_charm" }
                    ],
                    "destination_nodes": [
                        { "node_id": "check_history" },
                        { "node_id": "end" }
                    ]
                },
                "check_history": {
                    "condition": { "type": "STAT_CHECK", "stat": "lck", "min": 6 },
                    "prompt": "[ Try to access the generator's logs ]",
                    "response": "[ You feel a strange intuition and press a sequence of faded buttons on the console. A hidden log file opens, detailing the station's final hours before the fall. It speaks of a 'shelter protocol' and a last-ditch effort to save a handful of personnel. A fragment of history preserved. ]",
                     "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "end": {
                    "prompt": "[ Leave the generator ]",
                    "response": "[ You head back towards the light of the Neon Nexus. ]"
                }
            }
        },
        "tunnel_passage": {
            "name": "Tunnel Passage",
            "type": "advanture",
            "is_available": false,
            "description": "A dark, narrow passage branching off from the main tunnel. Strange scratching noises echo from within.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "This passage seems to be the source of the infestation. The air is thick with a foul, musky odor.",
                    "destination_nodes": [ { "node_id": "enter_nest" }, { "node_id": "end" } ]
                },
                "return": {
                    "response": "The foul stench from the passage is a grim invitation to proceed.",
                    "destination_nodes": [
                        { "node_id": "enter_nest" },
                        { "node_id": "story_3", "prompt_replacement": "Continue disovery" },
                        { "node_id": "end" } ]
                },
                "enter_nest": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 1 },
                    "prompt": "[Enter the rat's nest.]",
                    "response": "You push deeper, the walls slick with grime. Old graffiti from the before-times tells a story. 'The trains will save us,' says one scrawl. A newer one underneath says, 'The trains are tombs.'",
                    "destination_nodes": [ { "node_id": "story_2" } ]
                },
                "story_2": {
                    "prompt": "[Continue forward.]",
                    "response": "Further in, you see hastily constructed barricades, long since torn apart. It seems people tried to make a stand here. The scratchings on the wall become more frantic.",
                    "destination_nodes": [ { "node_id": "ambush" } ]
                },
                "ambush": {
                    "prompt": "[Press on.]",
                    "response": "As you squeeze through a narrow gap, glowing rats swarm from hidden crevices in the walls! You fight them back, but they are relentless and you take a few nasty bites.",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -10 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 200 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 2},
                    ],
                    "destination_nodes": [
                        { "node_id": "story_3" },
                        { "node_id": "end", "prompt_replacement": "Get back from the tunnels to recover" },
                    ]
                },
                "story_3": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 2 },
                    "prompt": "[Push towards the source.]",
                    "response": "The passage opens into a large cavern. In the center is a massive, pulsating nest made of scrap metal, wire, and bone. Atop it sits a monstrously large Glow-Rat, its eyes burning with intelligence. The Queen.",
                    "destination_nodes": [ { "node_id": "fight_queen" } ]
                },
                "fight_queen": {
                    "prompt": "[Fight the Rat Queen!]",
                    "response": "The battle is fierce. The Queen is fast and powerful, commanding her brood. With a final, desperate lunge, you bring the beast down. As it collapses, something shiny falls from the nest it was guarding.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 3 },
                        { "type": "ITEM_GAIN", "item_id": "glowing_pendant" },
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -15 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 300 },
                    ],
                    "destination_nodes": [ { "node_id": "end", "prompt_replacement": "[Leave the now-silent nest.]" } ]
                },
                "leave": {
                    "prompt": "[ Back away from the passage ]",
                    "response": "You decide not to venture into the darkness today."
                },
                "end": {
                    "prompt": "[ Back away from the passage ]",
                    "response": "Back away from the passage."
                }
            }
        }
    },
    "the_forgotten_outpost": {
        "elder_kian": {
            "name": "Elder Kian",
            "type": "npc",
            "is_available": true,
            "description": "An old man with a calm demeanor, his face a roadmap of wrinkles. He is the leader of this small community.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "A new face. It has been a long time since the signal brought a traveler. I am Kian. Welcome to our outpost. What do you seek?",
                    "destination_nodes": [
                        { "node_id": "kian_story_1" },
                        { "node_id": "quest_signal_boost_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Welcome back, traveler. The antenna still sings its lonely song.",
                     "destination_nodes": [
                        { "node_id": "kian_story_1", "prompt_replacement":"Can you tell me about this place again?" },
                        { "node_id": "quest_signal_boost_intro" },
                        { "node_id": "quest_signal_boost_reminder" },
                        { "node_id": "end" }
                    ]
                },
                "kian_story_1": {
                    "prompt": "What is this place?",
                    "response": "This is one of the last communication relays from the old world. We are the descendants of the original staff. We keep the signal alive, a ghost crying in the dark.",
                    "destination_nodes": [ { "node_id": "kian_story_2" } ]
                },
                "kian_story_2": {
                    "prompt": "What is the signal?",
                    "response": "A simple looping message of hope. A reminder that we are still here. But the equipment is failing. The signal grows weaker every year. We are slowly becoming a memory.",
                    "destination_nodes": [ { "node_id": "quest_signal_boost_intro" }, { "node_id": "end" } ]
                },
                "quest_signal_boost_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "the_whispering_signal", "stage": 0 },
                    "prompt": "Maybe I can help with the signal.",
                    "response": "Perhaps. The main signal booster is shot. Our technician, Finn, says he needs 'harmonic resonator' to build a new one. This is old-world tech, hard to find. We've scavenged the area clean. If you could find it, you'd be saving more than just a signal.",
                    "destination_nodes": [ { "node_id": "quest_signal_boost_accept" }, { "node_id": "quest_signal_boost_reject" } ]
                },
                "quest_signal_boost_accept": {
                    "prompt": "I'll find your resonators.",
                    "response": "Your hope honors the memory of our ancestors. Finn can give you the schematics. Be wary of the wastes, traveler.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "the_whispering_signal", "stage": 1 }],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_signal_boost_reject": {
                    "prompt": "Sounds like a wild goose chase.",
                    "response": "A pity. The silence comes for us all, in the end.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                 "quest_signal_boost_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "the_whispering_signal", "stage": 1 },
                    "prompt": "About the resonators...",
                    "response": "The signal fades. Time is not on our side. Have you spoken to Finn?",
                    "destination_nodes": [ { "node_id": "quest_signal_boost_completion" }, { "node_id": "end" } ]
                },
                "quest_signal_boost_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "harmonic_resonator", "quantity": 3 },
                    "prompt": "I have the resonator!",
                    "response": "You have done it! You have given us a voice again! This is a great day. Please, take this. It is a small reward for a monumental deed.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "the_whispering_signal", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "harmonic_resonator", "quantity": 3 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 500 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 300 },
                        { "type": "REPUTATION_CHANGE", "value": 20 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { "prompt": "Farewell.", "response": "May the signal guide you." }
            }
        },
        "silas": {
            "name": "Silas",
            "type": "npc",
            "is_available": true,
            "description": "A grim-faced guard in scavenged armor, watching the horizon with a powerful rifle. He is a man of few words and much suspicion.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                 "start": {
                    "response": "State your business. This is a restricted area.",
                    "destination_nodes": [
                        { "node_id": "silas_story" },
                        { "node_id": "quest_scout_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You again. Don't get in the way.",
                     "destination_nodes": [
                        { "node_id": "silas_story" , "prompt_replacement": "What the latest threats are?"},
                        { "node_id": "quest_scout_intro" },
                        // { "node_id": "quest_scout_reminder" },
                        { "node_id": "quest_scout_completion" },
                        { "node_id": "quest_scout_dogs_side" },
                        { "node_id": "end" }
                    ]
                },
                "silas_story": {
                    "prompt": "What are you guarding against?",
                    "response": "Everything. Raiders, mutants, the silence... My job is to see trouble coming and stop it. Kian trusts the signal. I trust my rifle.",
                    "destination_nodes": [ { "node_id": "quest_scout_intro" }, { "node_id": "end" } ]
                },
                "quest_scout_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 0 },
                    "prompt": "Looks like you could use an extra gun.",
                    "response": "Maybe. There's a pack of mutated hounds that have gotten too close to the spire. They're getting bold. I need someone to clear their den to the east. Make them think twice about coming back.",
                    "destination_nodes": [ { "node_id": "quest_scout_accept" }, { "node_id": "quest_scout_reject" } ]
                },
                "quest_scout_accept": {
                    "prompt": "I'll take care of it.",
                    "response": "Good. Less work for me. Don't die.",
                    "outcomes": [
                        { "type": "LOCATION_UNLOCK", "location_id": "hound_den" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 1 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_scout_reject": {
                    "prompt": "Not my fight.",
                    "response": "Figures. More work for me, then.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_scout_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 1 },
                    "prompt": "About those hounds...",
                    "response": "Are they gone or not? Stop wasting my time.",
                    "destination_nodes": [
                        { "node_id": "quest_scout_completion" },
                        //{ "node_id": "quest_scout_completion" },
                        { "node_id": "end", "prompt_replacement": "Give me few more time to sort it out" }
                    ]
                },
                "quest_scout_completion": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 3 },
                    "prompt": "The hound den is cleared.",
                    "response": "Hmph. You're more useful than you look. Here. For the ammo you spent.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 250 },
                        { "type": "STAT_CHANGE", "stat": "reputation", "value": 20 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 100 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_scout_dogs_side": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 99 },
                    "prompt": "The hounds won't be a problem anymore.",
                    "response": "They're gone? Good. I don't see them on the scopes. Don't know what you did, don't care. A problem solved is a problem solved. Here's your pay.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 250 },
                        { "type": "STAT_CHANGE", "stat": "reputation", "value": 20 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 100 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { "prompt": "Carry on.", "response": "[grunts]" }
            }
        },
        "lena": {
            "name": "Lena",
            "type": "npc",
            "is_available": true,
            "description": "A young woman with grease-stained hands and a hopeful smile. She tends a small hydroponics garden.",
            "is_merchant": true,
            "inventory": ["purified_water", "mutfruit"],
            "dialogue_graph": {
                "start": {
                    "response": "Oh, hello! We don't get many visitors. I'm Lena. Welcome to the garden!",
                    "destination_nodes": [
                        { "node_id": "lena_story" },
                        { "node_id": "quest_seed_intro" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Welcome back! The plants are happy to see you.",
                    "destination_nodes": [
                        { "node_id": "quest_seed_intro" },
                        { "node_id": "quest_seed_failed" },
                        { "node_id": "quest_seed_completion" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "trade": {
                    "prompt": "Let's see what you're selling.",
                    "response": "It's not much, but it's fresh and clean! Take a look.",
                    "destination_nodes": [ { "node_id": "return", "prompt_replacement": "Anything else?" } ]
                },
                "lena_story": {
                    "prompt": "What are you growing here?",
                    "response": "Food! And clean water. The old world hydroponics bay still works, mostly. It's how we survive up here. It's hard work, but it's honest.",
                    "destination_nodes": [ { "node_id": "quest_seed_intro" }, { "node_id": "end" } ]
                },
                "quest_seed_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 0 },
                    "prompt": "Is there anything I can help with?",
                    "response": "Actually, yes! Our seed bank is almost depleted. I've heard stories of a pre-war 'Global Seed Vault' not far from here. If you could find a 'Heirloom Seed Packet' from there, it could secure our future for generations!",
                    "destination_nodes": [ { "node_id": "quest_seed_accept" }, { "node_id": "quest_seed_reject" } ]
                },
                "quest_seed_accept": {
                    "prompt": "I'll look for this seed vault.",
                    "response": "Oh, thank you! That's wonderful! Be careful, those old vaults are often automated and... grumpy.",
                    "outcomes": [
                        { "type": "LOCATION_UNLOCK", "location_id": "global_seed_vault" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "seeds_of_hope", "stage": 1 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_seed_reject": {
                    "prompt": "I'm not a farmer.",
                    "response": "Oh. Okay. I understand. Well, the offer stands if you change your mind.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                // "quest_seed_reminder": {
                //     "condition": { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 1 },
                //     "prompt": "Still looking for those seeds.",
                //     "response": "I have faith in you! Our future is riding on it.",
                //     "destination_nodes": [ { "node_id": "quest_seed_completion" }, { "node_id": "end" } ]
                // },
                "quest_seed_failed": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 99 },
                    "prompt": "I got to the vault, but haven't managed to get in. The doors locked right in front of my nose.",
                    "response": "Ah, what a shame. I knew it is not a easy task. Anywait, thanks for trying.",
                    "outcomes": [],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_seed_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "heirloom_seed_packet" },
                    "prompt": "I found a Heirloom Seed Packet.",
                    "response": "You found it! You really found it! Oh, this changes everything! We can grow new things, better things! Thank you, thank you! Please, take this for your efforts.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "seeds_of_hope", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "heirloom_seed_packet" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 300 },
                        { "type": "REPUTATION_CHANGE", "value": 10 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { "prompt": "Take care.", "response": "You too! Come back soon!" }
            }
        },
        "fixer_finn": {
            "name": "Fixer Finn",
            "type": "npc",
            "is_available": true,
            "description": "A man who seems held together by wires and optimism. He is constantly tinkering with the outpost's ancient technology.",
            "is_merchant": true,
            "inventory": ["signal_jammer"],
            "dialogue_graph": {
                "start": {
                    "response": "Careful where you step! Half this stuff is older than my grandfather's grandfather. I'm Finn. If it sparks, buzzes, or whirs, I'm the one who tries to keep it that way.",
                    "destination_nodes": [
                        { "node_id": "finn_story" },
                        { "node_id": "quest_signal_boost_details" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Hey there! Don't touch that! Just kidding. Mostly. What's up?",
                    "destination_nodes": [
                        { "node_id": "finn_story" },
                        { "node_id": "quest_signal_boost_details" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "finn_story": {
                    "prompt": "What are you working on?",
                    "response": "Keeping this rust bucket from falling apart! The comms array, the water purifier, the perimeter fence... it's a full-time job. Kian has the vision, I have the wrench.",
                    "destination_nodes": [ { "node_id": "quest_signal_boost_details" }, { "node_id": "end" } ]
                },
                "quest_signal_boost_details": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "the_whispering_signal", "stage": 1 },
                    "prompt": "Kian sent me about the signal booster.",
                    "response": "Ah, the new blood! Good. Okay, so, harmonic resonator. Tricky little thing. Look for old comms stations or radio shacks. They often used them. They look like a small, metallic tuning fork inside a glass tube. Bring it to me, and I can work some real magic.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "trade": {
                    "prompt": "Let's see what you have.",
                    "response": "...",
                    "destination_nodes": [ { "node_id": "return", "prompt_replacement": "..." } ]
                },
                "end": { "prompt": "I'll get to it.", "response": "Don't break anything on your way out!" }
            }
        }
    },
    "global_seed_vault": {
        "vault_terminal": {
            "name": "Vault Mainframe",
            "type": "device",
            "is_available": true,
            "description": "The terminal hums, displaying a welcome message: 'AgriCorp Global Seed Vault - Preserving Life for a Greener Tomorrow.'",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ The terminal screen flickers to life as you approach. ] > Welcome, authorized user. Please select a directory.",
                    "destination_nodes": [
                        { "node_id": "history" },
                        { "node_id": "access_seed_bay" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The terminal screen flickers to life as you approach. ] > Welcome, authorized user. Please select a directory.",
                    "destination_nodes": [
                        { "node_id": "history" },
                        { "node_id": "access_seed_bay" },
                        { "node_id": "end" }
                    ]
                },
                "history": {
                    "prompt": "[ Access Directory: 'Vault History' ]",
                    "response": "> Entry 001: Project Lifeseed initiated. Our mission: to safeguard global biodiversity against any and all cataclysmic events. This vault is humanity's promise to the future.",
                    "destination_nodes": [ { "node_id": "history_2" } ]
                },
                "history_2": {
                    "prompt": "[ Next Entry ]",
                    "response": "> Entry 247: Facility is now running on autonomous protocol. All staff evacuated. The world outside has gone dark. May these seeds one day find fertile ground.",
                    "destination_nodes": [ { "node_id": "explore_halls" } ]
                },
                "explore_halls": {
                    "prompt": "[ Access Directory: 'Facility Status' ]",
                    "response": "> Cryo-preservation halls at 98% integrity. Hydroponics test labs... offline. Specimen acquisition rooms... sealed. Central Seed Bay... SECURE.",
                    "destination_nodes": [
                        { "node_id": "access_seed_bay" },
                        { "node_id": "end" }
                    ]
                },
                "access_seed_bay": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 1 },
                    "prompt": "[ Access Directory: 'Central Seed Bay' ]",
                    "response": "> ACCESS DENIED. Security Protocol 7 activated. Please enter verbal passphrase to unlock main bay doors.",
                    "destination_nodes": [ { "node_id": "hack_terminal" } ]
                },
                "hack_terminal": {
                    "prompt": "[ Attempt to bypass security ]",
                    "response": "> Multiple passphrase signatures detected. Please select correct phrase.",
                    "destination_nodes": [
                        { "node_id": "password_fail", "prompt_replacement": "'Alpha-Gamma-Nine'" },
                        { "node_id": "password_success", "prompt_replacement": "'Let the earth be renewed'" },
                        { "node_id": "password_fail", "prompt_replacement": "'Override-Protocol-Zero'" },
                        { "node_id": "password_fail", "prompt_replacement": "'Project Mayflower'" },
                        { "node_id": "password_success", "prompt_replacement": "'From small beginnings'" },
                        { "node_id": "password_fail", "prompt_replacement": "'Winter Contingency'" },
                        { "node_id": "password_fail", "prompt_replacement": "'Admin_Password123'" }
                    ]
                },
                "password_success": {
                    // "condition": { "type": "STAT_CHECK", "stat": "lck", "min": 7 },
                    "prompt": "Guess a password.",
                    "response": "> Passphrase Accepted. 'Let the earth be renewed.' Unlocking Central Seed Bay. Welcome back, Dr. Aris.",
                    "outcomes": [
                        { "type": "ITEM_GAIN", "item_id": "heirloom_seed_packet" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "seeds_of_hope", "stage": 2 }
                    ],
                    "destination_nodes": [ { "node_id": "end_success" } ]
                },
                "password_fail": {
                    "prompt": "Guess a password.",
                    "response": "> Incorrect. Security lockout initiated.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "seeds_of_hope", "stage": 99 }
                    ],
                    "destination_nodes": [ { "node_id": "end_fail" } ]
                },
                "end_success": {
                    "prompt": "[ Enter the Seed Bay and take a packet ]",
                    "response": "[ The heavy door hisses open, revealing racks of cryo-preserved seeds from a world long gone. You take one marked 'Heirloom Cornucopia Packet'. ]",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end_fail": {
                    "prompt": "[ Step away from the terminal ]",
                    "response": "[ The terminal screen goes red, displaying a single, ominous message: 'ACCESS DENIED. PERMANENT LOCKOUT.' The vault will not open. ]",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": {
                    "prompt": "[ Go away ]",
                    "response": "..."
                }

            }
        }
    },
    "hound_den": {
        "dog_guard_alpha": {
            "name": "Alpha Guard",
            "type": "npc",
            "is_available": true,
            "description": "A large, four-legged creature made of metal and scarred flesh. A red optical sensor glows from its head as it blocks the path, emitting a low growl.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "Hostile detected. Cease your advance. You are marked by the Hunter at the Spire. State your intent or be neutralized.",
                    "destination_nodes": [
                        { "node_id": "intent_kill" }, { "node_id": "intent_talk" }
                    ]
                },
                "return": {
                    "response": "...",
                    "destination_nodes": [
                        { "node_id": "intent_kill" },
                        { "node_id": "intent_talk" },
                        // TODO: handle silas end
                        // TODO: handle dogs end
                        { "node_id": "end", "prompt_replacement": "..."}
                    ]
                },
                "intent_kill": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 1 },
                    "prompt": "I'm here to do what Silas couldn't.",
                    "response": "Affirmative. Hostile intent confirmed. Engaging termination protocols.",
                    "destination_nodes": [
                        { "node_id": "fight_all" }
                    ]
                },
                "intent_talk": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 1 },
                    "prompt": "Silas sent me, but I'm not here to fight.",
                    "response": "Unlikely variable. Your kind only follows orders. Why should we believe you?",
                    "destination_nodes": [
                        { "node_id": "convince_1" },
                        { "node_id": "convince_2" }
                    ]
                },
                "convince_1": {
                    "prompt": "Because I'm talking instead of shooting.",
                    "response": "A logical, yet insufficient argument. You have 10 seconds to provide a better one.",
                    "destination_nodes": [
                        { "node_id": "convince_2" },
                        { "node_id": "intent_kill" }
                    ]
                },
                "convince_2": {
                    "prompt": "I want to know the truth. 'Mutants' don't usually talk.",
                    "response": "...Processing... Your statement is logical. We are not 'mutants'. Your curiosity is an anomaly. The Pack-Leader will see you. Do not try anything. I will be watching.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 52 },
                        { "type": "NPC_UNLOCK", "location_id": "hound_den" , "npc_id": "dog_leader_rex"}
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "fight_all": {
                    "prompt": "[ATTACK]",
                    "response": "You raise your weapon, and the entire den erupts with metallic howls. This will be a fight to the death.",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -30 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 3 },
                        { "type": "NPC_LOCK", "location_id": "hound_den" , "npc_id": "dog_guard_alpha"}
                    ],
                    "destination_nodes": [{ "node_id": "end" }] // should lead to different content
                },
                "end": {
                    "prompt": "[Follow the guard's direction.]",
                    "response": "The guard steps aside, its red eye still fixed on you, and gestures with its head deeper into the cave."
                }
            }
        },
        "dog_leader_rex": {
            "name": "Rex, Pack-Leader",
            "type": "npc",
            "is_available": false,
            "description": "An even larger cybernetic canine sits on a makeshift throne of server racks. Its optical sensors glow a calm blue, and its voice is a synthesized baritone.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "...",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        { "node_id": "choice_kill" },
                        { "node_id": "end", "prompt_replacement": "..."},
                    ]
                },
                // "start__": {
                //     // "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 1 },
                //     "response": "So, the Hunter sends a new weapon. My guard says you are... different. That you chose words over violence. I am Rex, leader of this Pack. Now, tell me why I shouldn't tear you limb from limb.",
                //     "destination_nodes": [
                //         { "node_id": "story_1" },
                //         { "node_id": "choice_kill" }
                //     ]
                // },
                "return": {
                    "response": "...",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        { "node_id": "offer_jammer" },
                        { "node_id": "choice_kill" },
                        { "node_id": "end", "prompt_replacement": "..."}
                    ]
                },
                "story_1": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 52 },
                    "prompt": "I want to understand what you are.",
                    "response": "So, the Hunter sends a new weapon. My guard says you are... different. That you chose words over violence. I am Rex, leader of this Pack.<br>'What'. An astute question. We are the leftovers of a military experiment. Project 'Canis Cyberneticus'. We were bred for war, enhanced for slaughter. When the world fell, we were abandoned. We escaped. We only wish to survive.",
                    "destination_nodes": [{ "node_id": "story_2" }]
                },
                "story_2": {
                    "prompt": "Why is Silas hunting you?",
                    "response": "The human at the Spire fears us. He sees monsters, old-world weapons. He does not understand we have evolved beyond our programming. We seek peace, not conflict. But he sends hunters. He forces our hand.",
                    "destination_nodes": [
                        { "node_id": "choice_help" },
                        { "node_id": "choice_kill" }
                    ]
                },
                "choice_help": {
                    "prompt": "There might be a peaceful way. What do you need?",
                    "response": "Peace? An interesting concept. The Spire-dweller uses scanners to find us. If we could cloak our energy signature, we could disappear. Their technician... Finn... he builds things. He might be able to craft a 'Signal Jammer'. If you could bring us one, we would vanish from this place forever.",
                    "outcomes": [
                        // { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 2 }
                    ],
                    "destination_nodes": [
                        { "node_id": "accept_jammer_quest" },
                        { "node_id": "choice_kill" }
                    ]
                },
                "accept_jammer_quest": {
                    "prompt": "Okay, let me see what can I do",
                    "response": "Ack. Get back with the jammer and not with a reinforcement",
                    "outcomes": [],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "choice_kill": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 52 },
                    "prompt": "You're too dangerous to live. I'm finishing the job.",
                    "response": "A predictable outcome. You have chosen the path of ignorance and death. So be it. Pack! Defend your home!",
                    "destination_nodes": [{ "node_id": "fight_leader" }]
                },
                "offer_jammer": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "signal_jammer" },
                    "prompt": "I have the signal jammer.",
                    "response": "You have... succeeded. You chose peace over destruction. You are a true anomaly. We will install this and be ghosts to the Spire-dweller. Thank you, human. You have given us a future.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 99 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 300 },
                        { "type": "STAT_CHANGE", "stat": "reputation", "value": 10},
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 100},
                        { "type": "ITEM_LOSE", "item_id": "signal_jammer" }
                    ],
                    "destination_nodes": [{ "node_id": "unlock_pit" }]
                },
                "unlock_pit": {
                    "prompt": "Before you disappear, are there any places I should visit? Give me a friend advice.",
                    "response": "Friendly advice: avoid Rust Pit",
                    "outcomes": [
                        { "type": "LOCATION_UNLOCK", "location_id": "rust_pit"}
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                
                "fight_leader": {
                    "prompt": "[ATTACK]",
                    "response": "Rex lets out a deafening howl, and the den becomes a whirlwind of metal and fury. You have made your choice.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 2 },
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -30 },
                        { "type": "NPC_LOCK", "location_id": "hound_den" , "npc_id": "dog_guard_alpha" },
                        { "type": "NPC_LOCK", "location_id": "hound_den" , "npc_id": "dog_leader_rex" }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": {
                    "prompt": "[Leave the den.]",
                    "response": "You turn your back on the cyborg dogs and head back into the wasteland."
                }
            }
        }
    },
    "rust_pit": {
        "boss_valeria": {
            "name": "Boss Valeria",
            "type": "npc",
            "is_available": true,
            "description": "A woman with a steely gaze and grease-stained hands, overseeing the work from a raised platform. She is clearly in charge here.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "New face. Don't break anything you can't pay for. I'm Valeria. I run this pit. What do you want?",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        { "node_id": "quest_scrappers_union_intro" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You're back. Don't waste my time.",
                    "destination_nodes": [
                        { "node_id": "story_1", "prompt_replacement": "Remind me about this place." },
                        { "node_id": "quest_scrappers_union_intro" },
                        { "node_id": "quest_scrappers_union_reminder" },
                        { "node_id": "end" }
                    ]
                },
                "story_1": {
                    "prompt": "What is this place?",
                    "response": "The Rust Pit. We reclaim, we rebuild. Best scrap operation this side of the Ash Fields. We keep the gears of the world turning.",
                    "destination_nodes": [ { "node_id": "story_2" } ]
                },
                "story_2": {
                    "prompt": "You're the boss?",
                    "response": "That's right. Earned it. Built this place from the ground up with my crew. Everyone here pulls their weight.",
                    "destination_nodes": [ { "node_id": "quest_scrappers_union_intro" }, { "node_id": "end" } ]
                },
                "quest_scrappers_union_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "scrappers_union", "stage": 0 },
                    "prompt": "You seem to have everything under control.",
                    "response": "Not everything. Our main hydraulic press is seizing up. Needs a specific part - a 'cryo-coupler'. My best tech, Ratchet, says there might be one in the old pumping station nearby. The place is crawling with bots. I need someone tough and disposable to check it out.",
                    "destination_nodes": [ { "node_id": "quest_scrappers_union_accept" }, { "node_id": "quest_scrappers_union_reject" } ]
                },
                "quest_scrappers_union_accept": {
                    "prompt": "I can be tough and disposable. For a price.",
                    "response": "I like your style. Get me that cryo-coupler, and you'll get a handsome cut. Don't dawdle.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "scrappers_union", "stage": 1 }],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_scrappers_union_reject": {
                    "prompt": "Fighting bots isn't in my job description.",
                    "response": "Then you're useless to me. Get out of my sight.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_scrappers_union_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "scrappers_union", "stage": 1 },
                    "prompt": "About that cryo-coupler...",
                    "response": "Are you holding it? No? Then stop wasting air and go get it. That press isn't fixing itself.",
                    "destination_nodes": [ { "node_id": "quest_scrappers_union_completion" }, { "node_id": "end" } ]
                },
                "quest_scrappers_union_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "cryo_coupler" },
                    "prompt": "I have the cryo-coupler.",
                    "response": "You actually did it. I'm impressed. You've got grit. Here's your pay. Stick around, I might have more work for you.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "scrappers_union", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "cryo_coupler" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 500 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 400 },
                        { "type": "REPUTATION_CHANGE", "value": 15 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { "prompt": "I'll get out of your hair.", "response": "Good." }
            }
        },
        "ratchet": {
            "name": "Ratchet",
            "type": "npc",
            "is_available": true,
            "description": "A young, energetic technician, constantly wiping grime from a pair of antique glasses. He's surrounded by piles of disassembled machinery.",
            "is_merchant": true,
            "inventory": ["energy_cell", "scrap_metal"],
            "dialogue_graph": {
                "start": {
                    "response": "Hey! Watch your step! This stuff is delicate. Mostly. I'm Ratchet. You need something fixed, or just browsing the mechanical graveyard?",
                    "destination_nodes": [{ "node_id": "trade" }, { "node_id": "story_1" }, { "node_id": "end" }]
                },
                "return": {
                    "response": "Oh, hey! Back again. Did you break something already?",
                    "destination_nodes": [{ "node_id": "trade" }, { "node_id": "story_1" }, { "node_id": "valeria_quest_reaction" }, { "node_id": "end" }]
                },
                "trade": {
                    "prompt": "Let's trade.",
                    "response": "Sure thing! Got some choice bits and bobs. One person's junk is my inventory.",
                    "destination_nodes": [{ "node_id": "return", "prompt_replacement": "Let's talk about something else." }]
                },
                "story_1": {
                    "prompt": "You're a technician?",
                    "response": "The best! Valeria handles the muscle, I handle the brains. I can make these old machines sing again. It's like... solving a puzzle from a thousand years ago.",
                    "destination_nodes": [{ "node_id": "valeria_quest_reaction" }, { "node_id": "end" }]
                },
                "valeria_quest_reaction": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "scrappers_union", "stage": 1 },
                    "prompt": "[INT 5] Valeria sent me for a cryo-coupler.",
                    "response": "She did? Whoa. Be careful, the old pumping station's security is no joke. But if you find it, that press will run smoother than ever. It's the key to our whole operation.",
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": { "prompt": "See you.", "response": "Keep your circuits clean!" }
            }
        },
        "doc_eris": {
            "name": "Doc Eris",
            "type": "npc",
            "is_available": true,
            "description": "A grim-faced woman with a cybernetic arm, tending to an injured scrapper in a makeshift infirmary. The scent of antiseptic hangs heavy in the air.",
            "is_merchant": true,
            "inventory": ["stimpack", "rad_away"],
            "dialogue_graph": {
                "start": { "response": "Unless you're bleeding, wait your turn. I'm Doc Eris. What's the damage?", "destination_nodes": [{ "node_id": "story_1" }, { "node_id": "trade" }, { "node_id": "quest_tainted_metal_intro" }, { "node_id": "end" }] },
                "return": { "response": "You again. Don't tell me you're hurt already.", "destination_nodes": [{ "node_id": "story_1" }, { "node_id": "trade" }, { "node_id": "quest_tainted_metal_intro" }, { "node_id": "quest_tainted_metal_reminder" }, { "node_id": "end" }] },
                "trade": { "prompt": "I need medical supplies.", "response": "I've got the basics. It'll cost you. Good health isn't free.", "destination_nodes": [{ "node_id": "return", "prompt_replacement": "Something else." }] },
                "story_1": { "prompt": "You're the doctor here?", "response": "I'm the only thing between these fools and a tetanus infection. I patch them up so Valeria can send them back out to get new holes. It's a living.", "destination_nodes": [{ "node_id": "quest_tainted_metal_intro" }, { "node_id": "end" }] },
                "quest_tainted_metal_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "tainted_metal", "stage": 0 },
                    "prompt": "You seem busy.",
                    "response": "Always. Lately, more than usual. Scrappers are coming back with a weird sickness. A 'metal rot'. They handle some junk, and days later, their skin starts... flaking. I need a sample of the source metal to synthesize an antidote. Someone mentioned a strange, shimmering ore in the quarry nearby.",
                    "destination_nodes": [{ "node_id": "quest_tainted_metal_accept" }, { "node_id": "quest_tainted_metal_reject" }]
                },
                "quest_tainted_metal_accept": {
                    "prompt": "I'll get your sample.",
                    "response": "You will? Don't touch it with your bare hands. Use these geo-tongs. Bring it straight back to me. The lives of my patients depend on it.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "tainted_metal", "stage": 1 }, { "type": "ITEM_GAIN", "item_id": "geo_tongs" }],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_tainted_metal_reject": { "prompt": "Sounds contagious. I'll pass.", "response": "Your funeral. Just don't come crawling to me when your fingers fall off.", "destination_nodes": [{ "node_id": "end" }] },
                "quest_tainted_metal_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "tainted_metal", "stage": 1 },
                    "prompt": "About that metal sample...",
                    "response": "Do you have it? People are getting worse. I can't hold this infection back forever.",
                    "destination_nodes": [{ "node_id": "quest_tainted_metal_completion" }, { "node_id": "end" }]
                },
                "quest_tainted_metal_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "shimmering_ore" },
                    "prompt": "I have the shimmering ore.",
                    "response": "Finally! Let me see... yes, the radiation signature is off the charts. I can work with this. You've saved lives today. Take this. You've more than earned it.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "tainted_metal", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "shimmering_ore" },
                        { "type": "ITEM_LOSE", "item_id": "geo_tongs" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 450 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 300 },
                        { "type": "REPUTATION_CHANGE", "value": 10 }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": { "prompt": "Stay healthy.", "response": "I'll try." }
            }
        },
        "whisper": {
            "name": "Whisper",
            "type": "npc",
            "is_available": true,
            "description": "A shadowy figure lurking near a stack of rusted containers, communicating in hushed tones and quick gestures. They seem to be a source of information.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": { "response": "Psst. Over here. You've got the look of someone who seeks... opportunities. I'm Whisper. I hear things. For a price.", "destination_nodes": [{ "node_id": "story_1" }, { "node_id": "quest_whispers_in_the_dark_intro" }, { "node_id": "end" }] },
                "return": { "response": "You're back. Looking for another secret?", "destination_nodes": [{ "node_id": "story_1" }, { "node_id": "quest_whispers_in_the_dark_intro" }, { "node_id": "quest_whispers_in_the_dark_reminder" }, { "node_id": "end" }] },
                "story_1": { "prompt": "What kind of things do you hear?", "response": "Secrets. Who's cheating who. Where the good scrap is hidden. Who's about to have an... accident. Information is the real currency out here.", "destination_nodes": [{ "node_id": "end" }] },
                "quest_whispers_in_the_dark_intro": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 0 },
                    "prompt": "I'm looking for a lucrative opportunity.",
                    "response": "I might have one. A rival crew boss, Silas, has a ledger. Details all his smuggling routes. That ledger would be very valuable to Valeria. It's in a locked safe in his office at the old comms tower. I can get you the keycard, but you have to retrieve the ledger.",
                    "destination_nodes": [{ "node_id": "quest_whispers_in_the_dark_accept" }, { "node_id": "quest_whispers_in_the_dark_reject" }]
                },
                "quest_whispers_in_the_dark_accept": {
                    "prompt": "[INT 6] Sounds risky. What's my cut?",
                    "response": "Smart. I'll give you the keycard and a stealth unit. You get me the ledger, I'll pay you well. Valeria never needs to know I was involved. Our secret.",
                    "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 1 }, { "type": "ITEM_GAIN", "item_id": "silas_keycard" }],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "quest_whispers_in_the_dark_reject": { "prompt": "I'm not a thief.", "response": "Suit yourself. More for the next enterprising soul.", "destination_nodes": [{ "node_id": "end" }] },
                "quest_whispers_in_the_dark_reminder": {
                    "condition": { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 1 },
                    "prompt": "About that ledger...",
                    "response": "The clock is ticking. Silas won't keep it in one place forever. Get moving.",
                    "destination_nodes": [{ "node_id": "quest_whispers_in_the_dark_completion" }, { "node_id": "end" }]
                },
                "quest_whispers_in_the_dark_completion": {
                    "condition": { "type": "HAVE_ITEM", "item_id": "silas_ledger" },
                    "prompt": "I have the ledger.",
                    "response": "Excellent. Let's see... yes, this is perfect. Valeria will be very pleased with 'your' discovery. Here is your payment. A pleasure doing business with you.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "silas_ledger" },
                        { "type": "ITEM_LOSE", "item_id": "silas_keycard" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 600 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 500 },
                        { "type": "REPUTATION_CHANGE", "value": -5 }
                    ],
                    "destination_nodes": [{ "node_id": "end" }]
                },
                "end": { "prompt": "I'm gone.", "response": "Stay in the shadows." }
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
            "1": "Travel to the Nexus Old Tunnel and plant the data scrambler on the main power generator.",
            "2": "The data scrambler is planted. Return to Zane in the Neon Nexus.",
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
    "maras_partner_fate": {
        "title": "Mara's partner fate",
        "description": "Mara tells about the story of disappered partner in the tunnels",
        "location": "neon_nexus",
        "giver": "zane",
        "stages": {
            "0": "Not started",
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
        "stages": {
            "0": "Not started",
            "1": "Clear out the Glow-Rat nest in the lower tunnels.",
            "2": "part of the tunnels are cleared.",
            "3": "the queen of the Glow-Rats is defeated.",
            "100": "Completed"
        },
        "rewards": { "items": [], "stat_change": [ { "stat": "xp", "value": 200 }, { "stat": "caps", "value": 150 } ] }
    },
    "echoes_of_the_past": {
        "title": "Echoes of the Past",
        "description": "Selene, the mystic, believes a pendant found in the tunnels is the key to unlocking a memory of the station. She needs help accessing a sealed area.",
        "location": "neon_nexus",
        "giver": "selene",
        "stages": {
            "0": "Not started",
            "1": "A strange pendant was found. Rex suggested showing it to Selene.",
            "2": "Selene believes the pendant is a key. Convince Rex to open the sealed maintenance hatch in the western corridor.",
            "3": "The hatch is open. Return to Selene with the news.",
            "100": "Completed"
        },
        "rewards": { "items": [], "stat_change": [ { "stat": "xp", "value": 400 }, { "stat": "reputation", "value": 5 } ] }
    },
    "the_whispering_signal": {
        "title": "The Whispering Signal",
        "description": "Elder Kian of The Forgotten Outpost needs help repairing the main signal booster to keep their message of hope alive.",
        "location": "the_forgotten_outpost",
        "giver": "elder_kian",
        "stages": {
            "0": "Not started",
            "1": "Find three Harmonic Resonators for Fixer Finn to repair the signal booster.",
            "100": "Completed"
        },
        "rewards": { "items": [], "stat_change": [ { "stat": "xp", "value": 500 }, { "stat": "caps", "value": 300 }, { "stat": "reputation", "value": 20 } ] }
    },
    "clearing_the_path": {
        "title": "Clearing the Path",
        "description": "Silas, the outpost guard, needs someone to clear a nearby den of mutated hounds.",
        "location": "the_forgotten_outpost",
        "giver": "silas",
        "stages": { "0": "Not started", "1": "Eliminate the mutated hounds in their den.", "100": "Completed" },
        "rewards": { "items": [], "stat_change": [ { "stat": "xp", "value": 250 }, { "stat": "caps", "value": 100 } ] }
    },
    "seeds_of_hope": {
        "title": "Seeds of Hope",
        "description": "Lena needs help finding a packet of heirloom seeds to replenish the outpost's dwindling food supply.",
        "location": "the_forgotten_outpost",
        "giver": "lena",
        "stages": { "0": "Not started", "1": "Search the wastes for a pre-war Global Seed Vault and retrieve a Heirloom Seed Packet.", "100": "Completed" },
        "rewards": { "items": [], "stat_change": [ { "stat": "xp", "value": 300 }, { "stat": "reputation", "value": 10 } ] }
    },
    "scrappers_union": {
        "title": "Scrapper's Union",
        "description": "Boss Valeria's hydraulic press is failing. She needs a 'cryo-coupler' from the old pumping station to fix it.",
        "location": "rust_pit",
        "giver": "boss_valeria",
        "stages": {
            "0": "Not started",
            "1": "Retrieve the cryo-coupler from the pumping station.",
            "100": "Completed"
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 500 },
                { "stat": "caps", "value": 400 },
                { "stat": "reputation", "value": 15 }
            ]
        }
    },
    "tainted_metal": {
        "title": "Tainted Metal",
        "description": "Doc Eris is dealing with a mysterious 'metal rot' illness. She needs a sample of a strange shimmering ore from a nearby quarry to create an antidote.",
        "location": "rust_pit",
        "giver": "doc_eris",
        "stages": {
            "0": "Not started",
            "1": "Acquire a sample of shimmering ore using the geo-tongs.",
            "100": "Completed"
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 450 },
                { "stat": "caps", "value": 300 },
                { "stat": "reputation", "value": 10 }
            ]
        }
    },
    "whispers_in_the_dark": {
        "title": "Whispers in the Dark",
        "description": "Whisper, an information broker, wants you to steal a rival's ledger from a safe in the old comms tower.",
        "location": "rust_pit",
        "giver": "whisper",
        "stages": {
            "0": "Not started",
            "1": "Retrieve Silas's ledger from the comms tower.",
            "100": "Completed"
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 600 },
                { "stat": "caps", "value": 500 },
                { "stat": "reputation", "value": -5 }
            ]
        }
    }
};

const ITEMS_DATA = {
    "data_scrambler": { "name": "Data Scrambler", "tradeable": false, "type": "quest", "price": 0 },
    "glowing_pendant": { "name": "Glowing Pendant", "tradeable": false, "type": "quest", "price": 0 },
    "bone_charm": {
        "name": "Bone Charm",
        "tradeable": false,
        "type": "gear",
        "stat_change": [{ "stat": "lck", "value": 1 }],
        "price": 0
    },
    "stimpack": { "name": "Stimpack", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 25 }], "price": 50 },
    "military_goggles": { "name": "Military Goggles", "tradeable": true, "type": "gear", "stat_change": [{ "stat": "int", "value": 1 }], "price": 120 },
    "energy_cell": { "name": "Energy Cell", "tradeable": true, "type": "junk", "price": 25 },
    "harmonic_resonator": { "name": "Harmonic Resonator", "tradeable": true, "type": "quest", "price": 20 },
    "heirloom_seed_packet": { "name": "Heirloom Seed Packet", "tradeable": false, "type": "quest", "price": 0 },
    "purified_water": { "name": "Purified Water", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 10 }], "price": 20 },
    "mutfruit": { "name": "Mutfruit", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 5 }], "price": 10 },
    "signal_jammer": { "name": "Signal Jammer", "type": "quest", "tradeable": true, "price": 100 },
    "cryo_coupler": { "name": "Cryo-Coupler", "tradeable": false, "type": "quest", "price": 0 },
    "geo_tongs": { "name": "Geo-Tongs", "tradeable": false, "type": "quest", "price": 0 },
    "shimmering_ore": { "name": "Shimmering Ore", "tradeable": false, "type": "quest", "price": 0 },
    "silas_keycard": { "name": "Silas's Keycard", "tradeable": false, "type": "quest", "price": 0 },
    "silas_ledger": { "name": "Silas's Ledger", "tradeable": false, "type": "quest", "price": 0 },
    "scrap_metal": { "name": "Scrap Metal", "tradeable": true, "type": "junk", "price": 10 },
    "rad_away": { "name": "Rad-Away", "tradeable": true, "type": "consumable", "price": 75 },
};

console.log('game.js: LOCATION_DATA', LOCATION_DATA);
console.log('game.js: NPC_DATA', NPC_DATA);
console.log('game.js: QUEST_DATA', QUEST_DATA);
console.log('game.js: ITEMS_DATA', ITEMS_DATA);