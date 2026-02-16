const LOCATION_DATA = {
    "still_quarter": {
        "name": "The Still Quarter",
        "description": "A small, well-kept settlement built around local sufficiency.<br>Home. Your home.",
        "npcs": ["caretaker_mira", "warden_cole", "keeper_lin", "relay_box", "signal_terminal"]
    },
    "neon_nexus": {
        "name": "Neon Nexus",
        "description": "A tired knot of old-world infrastructure kept alive by habit and patchwork. Neon signage flickers like a heartbeat that refuses to stop, throwing washed-out color over tarp-stalls and salvaged wiring. ",
        "npcs": ["station_noticeboard", "zane", "mara", "rex", "selene"]
    },
    "nexus_old_tunnel": {
        "name": "Nexus - Maintenance Tunnels",
        "description": "Service corridors beneath the station. Tight, labeled, and meant for people who used to work here. Relay bundles hang like veins, chewed and re-spliced. Maintenance marks still cling to the walls. Something nests in the warmth where the signal spine still pulses.",
        "npcs": ["power_generator", "tunnel_passage", "north_service_door"]
    },
    "nexus_calm_initiative_wing": {
        "name": "Nexus - Calm Initiative Wing",
        "description": "A sealed office-clinic wing with softened lighting panels and dead white-noise emitters. Posters promise emotional stability, compliance, and peace. Project timelines end mid-sentence. Biometric kiosks sit like polite threats, waiting for someone to remember why they were built.",
        "npcs": ["biometric_kiosk", "project_board", "archive_terminal" ]
    },
    "the_forgotten_outpost": {
        "name": "The Forgotten Outpost",
        "description": "WIP. To be contibued. Save the game, subscribe for the news and get back the continuation will arrive",
        //"description": "An old, fortified communications outpost perched precariously on a rocky spire. Its main antenna twitches, broadcasting a faint, looping signal into the wastes.",
        //"npcs": ["elder_kian", "silas", "lena", "fixer_finn"]
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
        "npcs": ["boss_valeria", "ratchet", "doc_eris", "whisper", "corvus"]
    },
    "tech_depot": {
        "name": "Old-World Tech Depot",
        "description": "A massive, reinforced structure from the old world. Warning signs cover the exterior, and the air hums with the low thrum of active security systems. The main gates loom ahead, imposing and deadly.",
        "npcs": ["depot_gates", "tech_scavenger_alpha", "tech_scavenger_beta", "tech_scavenger_gamma"]
    }
};

const NPC_DATA = {
    "still_quarter": {
        "caretaker_mira": {
            "name": "Caretaker Mira",
            "type": "npc",
            "is_available": true,
            "description": "A woman with calm eyes and work-worn hands. She tends the generators and speaks in even, measured tones.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "Hey. You look like you're chewing on something. What's up?",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        //{ "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Back again. Still thinking about it?",
                    "destination_nodes": [
                        { "node_id": "story_1", "prompt_replacement": "Run it by me again — the stuff you always said about the Quarter." },
                        { "node_id": "end" }
                    ]
                },
                "story_1": {
                    "prompt": "You used to say we keep things simple. Tell me that again.",
                    "response": "You know this. Hand-maintained generators, clear rules. No big hierarchy — just caretakers. Everyone knows their part. We don't overreach. Same as I've always said.",
                    "destination_nodes": [
                        { "node_id": "story_2" }
                    ]
                },
                "story_2": {
                    "prompt": "How long's it been like that?",
                    "response": "As long as anyone remembers. We adapt. We don't build for tomorrow in ways we can't touch today. The old world tried the other way. Didn't end well. You've heard it a hundred times.",
                    "destination_nodes": [
                        { "node_id": "story_3" }
                    ]
                },
                "story_3": {
                    "prompt": "I keep wondering though — why is 'good enough' enough? What if we could do better?",
                    "response": "More complexity, more that can break. We've learned that. What we have here is what we can see and what we can fix. That's enough.",
                    "destination_nodes": [
                        { "node_id": "story_4" }
                    ]
                },
                "story_4": {
                    "prompt": "What if something breaks that's connected to other places? Not just us?",
                    "response": "Other places? Coordinating with the rest? That's too much. Safer to depend on what we can see and touch. Last time people relied on systems they couldn't hold in their hands, everything came down. We don't do that again.",
                    "destination_nodes": [
                        { "node_id": "story_5" }
                    ]
                },
                "story_5": {
                    "prompt": "So we're just okay with things failing?",
                    "response": "We're okay that not everything gets fixed. Some things go quiet and we get by anyway. It's not that we don't care. It's balanced. You'll get it eventually.",
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "I'll sit with that." }
                    ]
                },
                "end": {
                    "prompt": "I'll let you get back to it.",
                    "response": "Go on. Think it over."
                }
            }
        },
        "warden_cole": {
            "name": "Warden Cole",
            "type": "npc",
            "is_available": true,
            "description": "A steady man with a clipboard and a tired smile. He watches the relay and the loads.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "Hey. Relay's still on my mind. You've got that look — something up?",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        // { "node_id": "quest_intro" },
                        // { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Back. What do you need?",
                    "destination_nodes": [
                        { "node_id": "story_1", "prompt_replacement": "Remind me — the relay, how we're dealing with it." },
                        //{ "node_id": "quest_intro", "prompt_replacement": "Anything I can do for the relay?" },
                        { "node_id": "quest_reminder" },
                        { "node_id": "quest_completion" },
                        { "node_id": "end" }
                    ]
                },
                "story_1": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "headroom", "stage": 100, "op": "neq" }
                        ]
                    },
                    "prompt": "You always watched the relay. Run me through what's going on — I want to hear it again.",
                    "response": "You know the drill. I watch the relay. Or I did. Went offline last week. Nothing huge — we're managing. Rationing, shifting loads. East block's a bit dimmer, mill queue's a bit longer. Not ideal but we get by.",
                    "destination_nodes": [
                        { "node_id": "quest_intro" },
                        { "node_id": "end", "prompt_replacement": "I'll think about it." }
                    ]
                },
                "quest_intro": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "headroom", "stage": 0 }
                        ]
                    },
                    "prompt": "I could help. What do you need?",
                    "response": "Relay's down. We're adapting. If you want to pitch in, take this spare spool to the relay box by the old generator shed and slot it in. Might give us a bit more headroom. Nothing fancy — you know the box.",
                    "destination_nodes": [
                        { "node_id": "quest_accept" },
                        { "node_id": "quest_reject" }
                    ]
                },
                "quest_accept": {
                    "prompt": "I'll take the spool. Where's the box again?",
                    "response": "Good. Here. Box is by the generator shed — you can't miss it. Slot it in when you're ready. Thanks.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "headroom", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "relay_spool" },
                        { "type": "NPC_UNLOCK", "location_id": "still_quarter", "npc_id": "relay_box" }
                    ],
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "I'll get it done." }
                    ]
                },
                "quest_reject": {
                    "prompt": "Maybe not this time.",
                    "response": "No problem. We'll get by either way.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Maybe another time." }
                    ]
                },
                "quest_reminder": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "headroom", "stage": 1 }
                        ]
                    },
                    "prompt": "I still have the spool. Where did you say the box was?",
                    "response": "By the generator shed. Slot it in when you're ready. No rush — we're managing.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "I'll do it soon." }
                    ]
                },
                "quest_completion": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "headroom", "stage": 2 }
                        ]
                    },
                    "prompt": "Done. Spool's in. Relay's humming.",
                    "response": "You did? Good. That's a bit more headroom for everyone. Here — a little something. We look after our own.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "headroom", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 },
                        { "type": "ITEM_GAIN", "item_id": "purified_water" },
                        { "type": "REPUTATION_CHANGE", "value": 5 }
                    ],
                    "destination_nodes": [
                        { "node_id": "the_question" }
                    ]
                },
                "the_question": {
                    "prompt": "Just before I go... I am curious. Why don't we just fix it properly? Get parts, run diagnostics, the whole thing?",
                    "response": "Fix it how? We'd need parts from the old depot, coordination with the shed crew, someone willing to run the diagnostics. That's a lot of moving parts. Easier to adapt. We've got a spare spool — someone slots it in, we get a bit more headroom. That's as far as we go.",
                    "destination_nodes": [
                        // { "node_id": "quest_intro" },
                        { "node_id": "return", "prompt_replacement": "It sounds... odd. Do things used to happen that way always?" }
                    ]
                },
                "end": {
                    "prompt": "See you...",
                    "response": "Take care."
                }
            }
        },
        "keeper_lin": {
            "name": "Keeper Lin",
            "type": "npc",
            "is_available": true,
            "description": "An older figure who sits near the edge of the quarter, where the old signal post gathers dust.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "You again. What brings you out here? You know there's nothing to see.",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        // { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Back. Still curious about the post?",
                    "destination_nodes": [
                        { "node_id": "story_1", "prompt_replacement": "The stuff about the old post — run it by me again." },
                        // { "node_id": "story_3", "prompt_replacement": "I want to go look at the signal post." },
                        { "node_id": "end" }
                    ]
                },
                "story_1": {
                    "prompt": "You used to say the old post used to talk to other places. Tell me that again.",
                    "response": "You've heard it. The signal post. Old world — terminal, dish, a lot of wiring. Used to talk to other places. Now it just hums. Nobody uses it. If it mattered, it would still be working. We leave it alone.",
                    "destination_nodes": [
                        { "node_id": "story_2" }
                    ]
                },
                "story_2": {
                    "prompt": "What was the signal supposed to be? I never really asked.",
                    "response": "I don't know. A heartbeat, maybe. Something that was part of a bigger system. Doesn't matter now, it is just a noise.",
                    "destination_nodes": [
                        { "node_id": "story_3" }
                    ]
                },
                "story_3": {
                    "prompt": "Can I just go look? I've never really looked. Not properly.",
                    "response": "Why? There's nothing there. Dead screen and a hum. Nobody's cared in years. But if you want, it's not forbidden. Go look if it bothers you. Post is past the shed. You'll see the terminal. Don't expect answers.",
                    "outcomes": [
                        { "type": "NPC_UNLOCK", "location_id": "still_quarter", "npc_id": "signal_terminal" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "Thanks. I'll take a look." }
                    ]
                },
                "end": {
                    "prompt": "I'll leave you to it.",
                    "response": "Go on."
                }
            }
        },
        "relay_box": {
            "name": "Relay Box",
            "type": "device",
            "is_available": false,
            "description": "A metal box covered in dials and a single slot.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ It's quiet now, waiting for a spare spool. ]",
                    "destination_nodes": [
                        { "node_id": "install_spool" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The relay box stands by the shed. You can slot in a spool if you have one. ]",
                    "destination_nodes": [
                        { "node_id": "install_spool" },
                        { "node_id": "end" }
                    ]
                },
                "install_spool": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "headroom", "stage": 1 },
                            { "type": "HAVE_ITEM", "item_id": "relay_spool" }
                        ]
                    },
                    "prompt": "[ Slot in the spare spool ]",
                    "response": "[ You slot the spool into the port. The relay clicks, then hums. Lights on the dials flicker up a notch. A bit more headroom. Done. ]",
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "relay_spool" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "headroom", "stage": 2 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "[ Step back. ]" }
                    ]
                },
                "end": {
                    "prompt": "[ Leave the relay box ]",
                    "response": "[ You step away. ]"
                }
            }
        },
        "signal_terminal": {
            "name": "Signal Terminal",
            "type": "device",
            "is_available": false,
            "description": "An old terminal and a dish, dust-covered. It hums faintly. The screen is dark.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ The terminal appears to be completely off. However, upon closer inspection, through the thick layer of dust on the screen, you notice that the cathode ray tube is still working, and you can see faint, barely distinguishable phosphorescent symbols.",
                    "destination_nodes": [
                        { "node_id": "signal_0" },
                        // { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The terminal still shows the same pulse. A heartbeat from somewhere else. ]",
                    "destination_nodes": [
                        // { "node_id": "signal_1", "prompt_replacement": "[ Listen again ]" },
                        { "node_id": "signal_3", "prompt_replacement": "[ Record the coordinates and go ]" },
                        { "node_id": "end" }
                    ]
                },
                "signal_0": {
                    "prompt": "[ Randomly push some buttons ]",
                    "response": "[ The screen flickers to life. Something appers on the screen. Not a welcome message — a pulse. <br> Accidentaly, a few bats fly out of the shed's roof and bites you up. ]",
                    "destination_nodes": [
                        { "node_id": "the_bats_attack" }
                    ]
                },
                "the_bats_attack": {
                    "mode": "battle",
                    "enemy": "bat",
                    "prompt": "[Fight the bats]",
                    "response": "[ One bat hits the ground and other are flying away. No one else is around. ]",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 50 }
                    ],
                    "destination_nodes": [
                        { "node_id": "signal_1" }
                    ]
                },
                "signal_1": {
                    "prompt": "[Look into the terminal's screen]",
                    "response": "[ It's not a distress call. No voice. Just a system heartbeat. Something that was built to talk to other places. Still trying. Still there. ]",
                    "destination_nodes": [
                        { "node_id": "signal_2" }
                    ]
                },
                "signal_2": {
                    "prompt": "[ Search for the source ]",
                    "response": "[ The display scrolls fragments. Coordinates. Network IDs. All of it points outward. Away from here. To a place that used to be a junction. A nexus. Where the old world lingered a little longer. ]",
                    "destination_nodes": [
                        { "node_id": "signal_3" }
                    ]
                },
                "signal_3": {
                    "once": true,
                    "prompt": "[ Record the coordinates ]",
                    "response": "[ You commit the data to memory. You know where to go. You could ignore it. Everyone else does. But you can't. An unfinished system. A thread. You need to see where it leads to. The way to the Nexus is clear. ]",
                    "outcomes": [
                        { "type": "LOCATION_UNLOCK", "location_id": "neon_nexus" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "end": {
                    "prompt": "[ Step away ]",
                    "response": "[ You leave the terminal ]"
                }
            }
        }
    },
    "neon_nexus": {
        "station_noticeboard": {
            "name": "Station Noticeboard",
            "type": "device",
            "is_available": true,
            "description": "",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "You see a warped bulletin board, tacked with printed notices, yellowed and faded with age, mixed with handwritten flyers. The notices overlap, like sediment.",
                    "destination_nodes": [
                        { "node_id": "read_more_1" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The board looks like a compromise that hardened into law. ]",
                    "destination_nodes": [
                        { "node_id": "read_more_1", "prompt_replacement": "[Read the older layers again]" },
                        { "node_id": "end" }
                    ]
                },
                "read_more_1": {
                    "prompt": "[ Look at the notices more closely ]",
                    "response": "[ Beneath notes and flyers, you see 'Network Maintenance Schedule - Quarter 4' diagram. It has tasks and rota,.. but the dates have been crossed out and replaced with handwritten 'When this is important' ]",
                    "destination_nodes": [
                        { "node_id": "read_more_2" }
                    ]
                },
                "read_more_2": {
                    "prompt": "[ Keep scanning the board ]",
                    "response": "[ You see an old pinned flyers advertising 'G.C.I. - your way to get calm. Pop by at our local office to know more'. Someone circled it and wrote: 'DO NOT' ]",
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": " That's enough for now." }
                    ]
                },
                "end": {
                    "prompt": "[Step away]",
                    "response": "[ The neon hum swallows the paper-thin authority of the board. ]"
                }
            }
        },
        "zane": {
            "name": "Zane",
            "type": "npc",
            "is_available": true,
            "description": "A twitchy station custodian-technician with a cybernetic eye that never stops refocusing.",
            "is_merchant": true,
            "inventory": [
                { "item_id": "stimpack", "quantity": 1 },
                { "item_id": "military_goggles", "quantity": 1 },
                { "item_id": "purified_water", "quantity": 2 }
            ],
            "dialogue_graph": {
                "start": {
                    "response": "Hold up—don’t touch the cables. I'm Zane. I keep the Nexus breathing.<br>Trade, questions, or are you one of those types who looks at a system and feels the itch to <i>improve</i> it?",
                    "destination_nodes": [
                        { "node_id": "zane_story_1" },
                        //{ "node_id": "quest_gits_offer" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },

                "return": {
                    "response": "Back again. The hum didn’t scare you off. Good. Most people prefer places that don't remind them the world used to be bigger.",
                    "destination_nodes": [
                        { "node_id": "zane_story_1", "prompt_replacement": "Remind me what keeps this place running." },
                        { "node_id": "quest_gits_offer" },
                        { "node_id": "quest_gits_reminder" },
                        { "node_id": "quest_gits_completion" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "zane_story_1": {
                    "prompt": "What is this place, really?",
                    "response": "It's an old transit junction that refused to die. Power. Water recycling. Some comms. A skeleton of coordination. People come here because it still works but nobody wants it to become a promise.",
                    "destination_nodes": [
                        { "node_id": "zane_story_2" }
                    ]
                },
                "zane_story_2": {
                    "prompt": "Why not make it a promise?",
                    "response": "Because promises become projects. Projects become dependencies. Dependencies become grief when they fail.<br>So we do local-loop trade. Walking distance. No routes. No invisible obligations.",
                    "destination_nodes": [
                        { "node_id": "zane_story_3" },
                        { "node_id": "return", "prompt_replacement": "I want to ask about something else." }
                    ]
                },
                "zane_story_3": {
                    "prompt": "What's behind you? Looks as a plan or a book of work.",
                    "response": "Come here. See that board? That used to be a schedule. Not for tomorrow. For quarters. For years.<br>Then one season, the dates just… stopped feeling real to people.",
                    "destination_nodes": [
                        { "node_id": "zane_story_4" }
                    ]
                },
                "zane_story_4": {
                    "prompt": "Why would that happen?",
                    "response": "Nobody sabotaged it. Nobody rebelled. They just stopped volunteering their attention for things they'd never personally touch.<br>Maintenance became 'good enough'. Planning became 'indulgent'.",
                    "destination_nodes": [
                        { "node_id": "zane_story_5" }
                    ]
                },
                "zane_story_5": {
                    "prompt": "And you? You still plan.",
                    "response": "I triage. I patch. I keep the machine from noticing it's dying.<br>Planning beyond the week makes people look at you like you’re asking them to hold a ghost.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "I want to ask about something else." }
                    ]
                },
                "trade": {
                    "prompt": "Let’s trade.",
                    "response": "Good. Buy what you can carry. Depend on what you can repair. That’s the rule nobody writes down.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Done. About something else…" }
                    ]
                },

                // -------------------------
                // Quest: Glitch in the System (maintenance + clue)
                // -------------------------
                "quest_gits_offer": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 0 }
                        ]
                    },
                    "prompt": "Any maintenance emergencies?",
                    "response": "The main regulator’s diagnostic signature is corrupted. I need you to plant a data scrambler on the generator service port in the maintenance tunnels. It'll force a clean reset.",
                    "destination_nodes": [
                        { "node_id": "quest_gits_details" },
                        { "node_id": "quest_gits_accept" },
                        { "node_id": "return", "prompt_replacement": "Not this time." }
                    ]
                },
                "quest_gits_details": {
                    "prompt": "What am I walking into down there?",
                    "response": "A corridor that used to be boring. Now it's warm, damp, and full of improvised life.<br>Relays are chewed. Insulation is missing. The signal spine is… exposed. You'll know the generator room by the hum that makes your teeth itch.",
                    "destination_nodes": [
                        { "node_id": "quest_gits_accept" },
                        { "node_id": "return", "prompt_replacement": "Not this time." }
                    ]
                },
                "quest_gits_accept": {
                    "prompt": "Alright. Give me the scrambler.",
                    "response": "Good. Plant it in the service port and get out. If the system calms down, come back. And if you find anything... hmm,.. interesintg... Bring it to me.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 },
                        { "type": "ITEM_GAIN", "item_id": "data_scrambler" },
                        { "type": "LOCATION_UNLOCK", "location_id": "nexus_old_tunnel" },
                        { "type": "NPC_UNLOCK", "location_id": "nexus_old_tunnel", "npc_id": "power_generator" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_gits_reminder": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 1 }
                        ]
                    },
                    "prompt": "About that regulator reset...",
                    "response": "Clock’s ticking. Every hour the signature stays corrupted, more subsystems drop into local fallback. That's how networks die: politely.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "I’m on it." },
                    ]
                },
                "quest_gits_completion": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 2 }
                        ]
                    },
                    "prompt": "Reset’s done. The generator stabilized.",
                    "response": "You did it?...Let me check... Oh yes! It works. Good!<br>Here’s your pay—caps for the body, not for the mind.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 250 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 200 },
                        { "type": "REPUTATION_CHANGE", "value": 5 },
                    ],
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "I’ll be careful." }
                    ]
                },
                "end": {
                    "prompt": "I should go.",
                    "response": "Keep your hands off the wrong cables."
                }
            }
        },
        "mara": {
            "name": "Mara",
            "type": "npc",
            "is_available": true,
            "description": "A scavenger with a stillness that reads like restraint. She watches the crowd the way people watch a fire—ready for it to change shape.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "What do you want? I'm busy.",
                    "destination_nodes": [
                        { "node_id": "mara_story_1" },
                        // { "node_id": "mara_react_gci" },
                        { "node_id": "partner_item_story" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You again. What is it?",
                    "destination_nodes": [
                        { "node_id": "partner_item_story" },
                        { "node_id": "mara_story_1", "prompt_replacement": "Tell me about yourself again." },
                        // { "node_id": "mara_react_gci" },
                        { "node_id": "end" }
                    ]
                },
                "mara_story_1": {
                    "prompt": "What's your story?",
                    "response": "Rust routes. Short hops. Never long ones. Long ones make you believe in maps.<br>I ran with a crew once. We thought the old world still had gifts.",
                    "destination_nodes": [
                        { "node_id": "mara_story_2" }
                    ]
                },
                "mara_story_2": {
                    "prompt": "What happened?",
                    "response": "We found a depot that still listened to rules nobody remembered. Alarms. Automated defenses. A system doing its job long after the job stopped mattering. I walked out. The rest... stayed.",
                    "destination_nodes": [
                        { "node_id": "mara_story_3" }
                    ]
                },
                "mara_story_3": {
                    "prompt": "Why stay here in the Nexus?",
                    "response": "Because it’s stable. Not safe—stable. People here like stable. They don't ask you what you want next year. They ask what you can carry today. And you know, that's fits me quite well. I even have managed to date a guy here, but then... he just vanished.",
                    "destination_nodes": [
                        { "node_id": "mara_story_4" },
                        { "node_id": "return", "prompt_replacement": "Let’s talk about something else." }
                    ]
                },
                "mara_story_4": {
                    "prompt": "That’s what happened to your partner?",
                    "response": "He went into the tunnels on a 'simple' run. For Zane. Don't know what he actually looked for there. But he never came back. And nobody chased the why. They chased the next meal.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "maras_partner_fate", "stage": 1 }
                    ],
                    "destination_nodes": [
                        { "node_id": "partner_item_story" },
                        { "node_id": "return", "prompt_replacement": "I hear you." }
                    ]
                },

                // to tell the story...
                "mara_react_gci": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "glitch_in_the_system", "stage": 3, "op": "gte" }
                        ]
                    },
                    "prompt": "I found references to a 'Calm Initiative'.",
                    "response": "People always want a reason. A label to pin blame on.<br>Here’s what I care about: whatever happened, it made people stop wanting to go back for the missing. Stop wanting to finish things.<br>If you find proof… don’t expect gratitude. Proof makes responsibilities. People hate responsibilities.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Fair." },
                        { "node_id": "end", "prompt_replacement": "Thanks for the warning." }
                    ]
                },
                "partner_item_story": {
                    "conditions": {
                        "op": "AND",
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "bone_charm" },
                            { "type": "QUEST_STAGE", "quest_id": "maras_partner_fate", "stage": 1, "op": "gte" },
                            { "type": "QUEST_STAGE", "quest_id": "maras_partner_fate", "stage": 100, "op": "neq" }
                        ]
                    },
                    "prompt": "Zane send me to old Maintenance tunnels. I found something there.",
                    "response": "What?",
                    "destination_nodes": [
                        { "node_id": "partner_item_show" },
                        { "node_id": "partner_item_keep" },
                        //{ "node_id": "return", "prompt_replacement": "Not now." }
                    ]
                },
                "partner_item_show": {
                    "prompt": "It was by bones. A charm.",
                    "response": "...That’s my partner's work. He carved it from junk bone and superstition. So that’s where the tunnel paid him.<br>Keep it. Not as luck. As a receipt. Systems always send receipts—eventually.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "maras_partner_fate", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 150 },
                        { "type": "REPUTATION_CHANGE", "value": 10 }
                    ],
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "I’m sorry." }
                    ]
                },
                "partner_item_keep": {
                    "prompt": "I just wanted you to know... I saw bones near the generator.",
                    "response": "Taking into account, that my partner was sent by Zane there... Well. Knowing is... something. More than most people offer.<br>Thanks.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "maras_partner_fate", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 150 },
                        { "type": "REPUTATION_CHANGE", "value": 5 }
                    ],
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "He won’t be forgotten." }
                    ]
                },
                "end": {
                    "prompt": "I’ll go.",
                    "response": "Stay alive."
                }
            }
        },
        "rex": {
            "name": "Rex",
            "type": "npc",
            "is_available": true,
            "description": "Security without ceremony. He doesn't posture—he audits. The kind of man who learned to fear promises more than threats.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "Don’t start anything. Don’t sell anyone a dream. This place stays standing because we keep it small.",
                    "destination_nodes": [
                        { "node_id": "rex_story_1" },
                        // { "node_id": "quest_pest_offer" },
                        // { "node_id": "selene_reaction" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You keeping your footprint light?",
                    "destination_nodes": [
                        { "node_id": "rex_story_1", "prompt_replacement": "Why are you so strict about 'keeping it small'?" },
                        { "node_id": "quest_pest_offer" },
                        { "node_id": "quest_pest_reminder" },
                        // { "node_id": "quest_pest_completion" },
                        { "node_id": "selene_reaction" }, //?
                        { "node_id": "end" }
                    ]
                },

                "rex_story_1": {
                    "prompt": "Why keep it small?",
                    "response": "Because expansions become networks. Networks become dependencies. Dependencies become panic when they fail.",
                    "destination_nodes": [
                        { "node_id": "rex_story_2" }
                    ]
                },
                "rex_story_2": {
                    "prompt": "Sounds like trauma.",
                    "response": "Call it experience. The old world died because people trusted black boxes they couldn’t maintain.<br>We don’t do black boxes anymore.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Alright." }
                    ]
                },

                // Quest: Pest Control reframed as relay integrity
                "quest_pest_offer": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 0 }
                        ]
                    },
                    "prompt": "Need help keeping the Nexus standing?",
                    "response": "Maybe. Something’s chewing the relay insulation in the maintenance tunnels. Not just pests—system decay with teeth.<br>Clear the infestation pressure point. If the signal spine drops, half the station collapses into local fallback. That’s how places become villages.",
                    "destination_nodes": [
                        { "node_id": "quest_pest_accept" },
                        { "node_id": "quest_pest_details" },
                        { "node_id": "return", "prompt_replacement": "I’ll consider it later" }
                    ]
                },

                "quest_pest_details": {
                    "prompt": "What am I looking for?",
                    "response": "Chewed cabling. Warm nests near junction heat. Follow the stench and the scratch marks.",
                    "destination_nodes": [
                        { "node_id": "quest_pest_accept" },
                        { "node_id": "return", "prompt_replacement": "I’ll consider it later" }
                    ]
                },

                "quest_pest_accept": {
                    "prompt": "I’ll clear it.",
                    "response": "Good. Don’t make it heroic. Make it finished.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 1 },
                        { "type": "LOCATION_UNLOCK", "location_id": "nexus_old_tunnel" },
                        { "type": "NPC_UNLOCK", "location_id": "nexus_old_tunnel", "npc_id": "tunnel_passage" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },

                "quest_pest_reminder": {
                    "conditions": {
                        "op": "AND",
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 1, "op": "gte" },
                            { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 100, "op": "neq" }
                        ]
                    },
                    "prompt": "About the chewed relays…",
                    "response": "Either you stop it, or the station adapts. Adaptation looks calm. It's just slow failure with manners.",
                    "destination_nodes": [
                        { "node_id": "quest_pest_completion" },
                        { "node_id": "return", "prompt_replacement": "I’ll finish it." }
                    ]
                },

                "quest_pest_completion": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 3 }
                        ]
                    },
                    "prompt": "Infestation’s pressure point is gone.",
                    "response": "Good. Now we shouldn't be bothered by annoying pests. Thank you.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 220 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 150 },
                        { "type": "REPUTATION_CHANGE", "value": 5 },
                    ],
                    "destination_nodes": [
                        { "node_id": "amplifier" }
                    ]
                },
                "amplifier": {
                    // "conditions": {
                    //     "condition": [
                    //         { "type": "HAVE_ITEM", "item_id": "amplifier_token" }
                    //     ]
                    // },
                    "prompt": "I pulled this out of the relay bundle near the nest.",
                    "response": "Hm... It’s not jewelry. It’s station hardware—an old signal amplifier token.<br><br>Selene collects old meanings. If anyone can tell you what it interfaces with… it’s her.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 1 }
                    ],
                    "destination_nodes": [
                        { "node_id": "selene_reaction" },
                        { "node_id": "return", "prompt_replacement": "I’ll talk to Selene." }
                    ]
                }, 
                "selene_reaction": {
                    "prompt": "What do you think of Selene?",
                    "response": "She keeps people from turning fear into violence. I don’t care how she does it. Just… don’t let her talk you into starting a movement.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Fair." }
                    ]
                },

                "end": {
                    "prompt": "I’ll go.",
                    "response": "Keep it small."
                }
            }
        },
        "selene": {
            "name": "Selene",
            "type": "npc",
            "is_available": true,
            "description": "A listener more than a prophet. Her mysticism is a coping language for patterns others refuse to see.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
              "start": {
                "response": "Most people come here to rest from wanting. You look like you came here because you can’t stop.",
                "destination_nodes": [
                  { "node_id": "story_small_1" },
                  { "node_id": "story_calm_1" },
                  { "node_id": "provocation_grow_1" },
                  { "node_id": "gci_1" },
                  { "node_id": "quest_token_1" },
                  { "node_id": "end" }
                ]
              },
              "return": {
                "response": "You again. Tell me—are you still looking for a reason, or have you started looking for a pattern?",
                "destination_nodes": [
                    { "node_id": "quest_token_1" },
                    { "node_id": "quest_fo_1" },
                    { "node_id": "story_small_1" },
                    { "node_id": "story_calm_1" },
                    { "node_id": "provocation_grow_1" },
                    { "node_id": "gci_1" },
                    { "node_id": "end" }
                ]
              },
              "end": {
                "prompt": "I should go.",
                "response": "Go softly. Don’t carry your questions like a weapon."
              },

              "story_small_1": {
                "prompt": "Zane and Rex both talk about keeping things small. Why?",
                "response": "Because they’re saying the same prayer, just in different uniforms. Rex fears panic. Zane fears breakdown. Both fear the moment people remember they could ask for more.",
                "destination_nodes": [
                  { "node_id": "story_small_2" }
                ]
              },
              "story_small_2": {
                "prompt": "So you agree with them?",
                "response": "I understand them. Agreement is too clean a word.",
                "destination_nodes": [
                  { "node_id": "story_calm_1" },
                  { "node_id": "return", "prompt_replacement": "Let’s talk about something else." }
                ]
              },

              "story_calm_1": {
                "prompt": "Rex said you keep people calm. How?",
                "response": "I give them a place to put the feeling. When the lights flicker, people don’t want an explanation—they want a target. I make the target the history instead of a person.",
                "destination_nodes": [
                  { "node_id": "story_calm_2" }
                ]
              },
              "story_calm_2": {
                "prompt": "That sounds manipulative.",
                "response": "It is. So is law. So is leadership. So is any attempt to keep hands from reaching for knives.",
                "destination_nodes": [
                  { "node_id": "story_calm_3" }
                ]
              },
              "story_calm_3": {
                "prompt": "What do you actually do when people get scared?",
                "response": "I slow the room down. I name what’s happening out loud—so no one has to invent a name in the dark. I redirect the need to act into something harmless: a vigil, a chant, a circuit-check ritual, a trade of small offerings.",
                "destination_nodes": [
                  { "node_id": "story_calm_4" }
                ]
              },
              "story_calm_4": {
                "prompt": "Do you ever get it wrong?",
                "response": "Often. I just try to get it wrong quietly.",
                "destination_nodes": [
                  { "node_id": "provocation_grow_1" },
                  { "node_id": "return", "prompt_replacement": "I get it. Another question." }
                ]
              },

              "provocation_grow_1": {
                "once": true,
                "prompt": "Do you want the Nexus to grow?",
                "response": "Want is a dangerous verb here. Growth is not a moral good. It’s a liability you must maintain.",
                "destination_nodes": [
                  { "node_id": "provocation_grow_2" }
                ]
              },
              "provocation_grow_2": {
                "prompt": "Then what do you want?",
                "response": "I want people to keep their kindness when the lights betray them.",
                "destination_nodes": [
                  { "node_id": "gci_1" },
                  { "node_id": "return", "prompt_replacement": "Alright. About something else…" }
                ]
              },

              "gci_1": {
                "prompt": "What is G.C.I.?",
                "response": "A clinic that tried to treat the world’s panic like a disease. It didn’t fail.",
                "destination_nodes": [
                  { "node_id": "gci_2" }
                ]
              },
              "gci_2": {
                "prompt": "What did they do?",
                "response": "They didn’t build a weapon. They built a mood. They taught bodies how to settle. How to stop reaching for the far horizon. Imagine taking the ache of ‘not enough’ out of a person. You’d save them… and you’d erase the engine that builds bridges.",
                "destination_nodes": [
                  { "node_id": "gci_3" }
                ]
              },
              "gci_3": {
                "prompt": "So you believe the Calm Initiative caused the collapse?",
                "response": "I believe it left fingerprints. That’s different. You don’t need a villain to end a civilisation. You only need everyone to stop caring about what they can’t immediately feel.",
                "destination_nodes": [
                  { "node_id": "gci_4" }
                ]
              },
              "gci_4": {
                "prompt": "How can I fing that clinic?",
                "response": "It's not a secret where it's located, it's hearby. However, the clinic is sealed. The machines there will only speak to certain signatures.",
                "destination_nodes": [
                  { "node_id": "gci_5" },
                  { "node_id": "gci_6" }
                ]
              },
              "gci_5": {
                "prompt": "Why is the wing sealed?",
                "response": "Because it’s a mirror. People don’t like mirrors that show them choices they didn’t know they made. Because the records don’t say ‘we were attacked.’ They say ‘we decided.’ And that makes the room dangerous.",
                "destination_nodes": [
                    { "node_id": "gci_6" },
                    { "node_id": "return", "prompt_replacement": "That’s...a lot. Let’s shift." }
                ]
              },
              "gci_6": {
                "prompt": "What do you mean, “speak to certain signatures”?",
                "response": "Some doors were built for caretakers. Some for auditors. Some for the rare ones who can hold a system in their head without flinching. If you can make the wing answer, you’ll see a trace—coordinates, routing labels, unfinished charters. Proof with edges.",
                "destination_nodes": [
                    { "node_id": "gci_5" },
                    { "node_id": "return", "prompt_replacement": "That’s...a lot. Let’s shift." }
                ]
              },
              "quest_token_1": {
                // "once": true,
                "conditions": {
                  "op": "AND",
                  "condition": [
                    { "type": "HAVE_ITEM", "item_id": "amplifier_token" },
                    { "type": "QUEST_STAGE", "quest_id": "echoes_of_the_past", "stage": 1, "op": "gte" },
                    { "type": "QUEST_STAGE", "quest_id": "echoes_of_the_past", "stage": 100, "op": "neq" },
                  ]
                },
                "prompt": "I’ve found a token in old maintenance tunnels. Rex said you’d know what this is.",
                "response": "[Selena takes the amplifier token and looks at it closely]<br> Hmm, a saw similar glyphs once... The G.C.I. Clinic, a place where calm was manufactured into policy. Considering you are the one who have found it and that you keep asking, it looks you are the right person to get there.",
                "outcomes": [
                  { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 2 },
                  { "type": "LOCATION_UNLOCK", "location_id": "nexus_calm_initiative_wing" },
                ],
                "destination_nodes": [
                  { "node_id": "quest_token_2" },
                  //{ "node_id": "return", "prompt_replacement": "I need to think." }
                ]
              },

              "quest_token_2": {
                "prompt": "What do you want me to do?",
                "response": "If that amplifier is a key... Go, if you must. Look. Extract what’s real. Then decide what kind of person you are when you return to the community that chose not to know.",
                "destination_nodes": [
                  { "node_id": "quest_token_3" },
                ]
              },
              "quest_token_3": {
                "prompt": "Are you telling me to keep it secret?",
                "response": "I can’t stop you. But I bet you not taking anything from there back to Neon Nexus. Anything you find there – your choice. We have made ours.",
                "destination_nodes": [
                  // { "node_id": "return", "prompt_replacement": "I’ll decide when I see it." },
                  { "node_id": "end", "prompt_replacement": "I’m going." }
                ]
              },
              "quest_fo_1": {
                "conditions": {
                  "condition": [
                    { "type": "QUEST_STAGE", "quest_id": "echoes_of_the_past", "stage": 3 },
                  ]
                },
                "prompt": "I have found a fragment about the Forgotten Outpost in the archive terminal.",
                "response": "The Forgotthen Outpost... Hmm... I recall someone coming from there a few times when I was just a kid. They traded with us, we weren't quite open to them, as we didn't get why they traded with someone outside their comminuty. I completly forgot about them. But now, as you just questestioned me about them, I see how similar your talkings with theirs speeches. They disappeared. I wonder if they are still alive. I know where that place is. It's in the north-west of the station, near the old junction of trade routes. I'll show you the way.", 
                "outcomes": [
                  { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 100 },
                  { "type": "STAT_CHANGE", "stat": "xp", "value": 500 },
                  { "type": "LOCATION_UNLOCK", "location_id": "the_forgotten_outpost" },
                ],
                "destination_nodes": [
                  { "node_id": "end", "prompt_replacement": "Farewell." }
                ]
              }
            }
        }
    },
    "nexus_old_tunnel": {
        "power_generator": {
            "name": "Generator Control Room",
            "type": "device",
            "is_available": false,
            //"description": "A humming generator assembly with a flickering panel. Labels are still legible if you look too closely.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ The room is cramped with equipment racks. The generator’s hum is steady-but-strained, like a tired throat holding a note. Relay bundles run along the walls—some gnawed, some re-wrapped with scavenged tape. ]",
                    "destination_nodes": [
                        { "node_id": "install_scrambler" },
                        { "node_id": "check_history" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The panel flickers. ]",
                    "destination_nodes": [
                        { "node_id": "install_scrambler", "prompt_replacement": "[Work the service port]" },
                        { "node_id": "check_history", "prompt_replacement": "[Try the maintenance index again]" },
                        { "node_id": "investigate_aftermath" },
                        { "node_id": "end" }
                    ]
                },

                "install_scrambler": {
                    "conditions": {
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "data_scrambler" }
                        ]
                    },
                    "prompt": "[Access the service port and insert the scrambler]",
                    "response": "[ As you open the service port, the heat draws movement—small bodies skittering in the cable trays. ]",
                    "destination_nodes": [
                        { "node_id": "rat_pressure_1" }
                    ]
                },

                "rat_pressure_1": {
                    "mode": "battle",
                    "enemy": "rat",
                    "prompt": "[Hold your ground]",
                    "response": "[ A burst of glow-rats spills from a warm duct, panicked by the power fluctuation. You drive them back, but not before teeth find skin. ]",
                    "outcomes": [
                        // { "type": "STAT_CHANGE", "stat": "hp", "value": -10 }
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 },
                    ],
                    "destination_nodes": [
                        { "node_id": "install_scrambler_2" }
                    ]
                },
                "install_scrambler_2": {
                    "prompt": "[Seat the scrambler and close the port]",
                    "response": "[ The scrambler clicks into place. The panel strobes, then settles into a calm pulse. A hidden maintenance index blinks briefly—like it noticed you noticing it. ]",
                    "outcomes": [
                        { "type": "ITEM_LOSE", "item_id": "data_scrambler" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "glitch_in_the_system", "stage": 2 },
                        //{ "type": "ITEM_GAIN", "item_id": "gci_archive_fragment" }
                    ],
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "[Step back from the panel]" }
                    ]
                },

                "investigate_aftermath": {
                    "conditions": {
                        "condition": [
                            { "type": "NO_ITEM", "item_id": "bone_charm" }
                        ]
                    },
                    "prompt": "[Look around the relay bundles]",
                    "response": "[ With the generator stabilized, the room feels less hostile. In the dust near a rack, you spot brittle bones tangled in old cable ties—someone used to work here. Something small rests among them. ]",
                    "destination_nodes": [
                        { "node_id": "find_item" },
                        { "node_id": "return", "prompt_replacement": "Leave it." }
                    ]
                },

                "find_item": {
                    "prompt": "[Pick up the small object]",
                    "response": "[ A crude bone charm. Not valuable—personal. The kind of thing someone makes when the world stops making sense. ]",
                    "outcomes": [
                        { "type": "ITEM_GAIN", "item_id": "bone_charm" }
                    ],
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Put it away." }
                    ]
                },
                "check_history": {
                    "once": true,
                    "conditions": {
                        "condition": [
                            { "type": "STAT_CHECK", "stat": "int", "min": 5 }
                        ]
                    },
                    "prompt": "Try the maintenance index sequence",
                    "response": "[ Your fingers move like you’ve done this before. A hidden menu opens: <i>\"G.C.I. ACCESS — BIOMETRIC GATE\"</i>. GCI Personnel only.  and a route label: <i>\"CALM WING: NORTH SERVICE DOOR\"</i>.]",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 150 },
                        { "type": "NPC_UNLOCK", "location_id": "nexus_old_tunnel", "npc_id": "north_service_door" },
                    ],
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "[Close the menu]" }
                    ]
                },

                "end": {
                    "prompt": "[Leave the control room]",
                    "response": "[ You follow the maintenance markings back toward the neon glow. ]"
                }
            },
        },
        "north_service_door": {
            "name": "Calm Wing: North Service Room",
            "type": "advanture",
            "is_available": false,
            "description": "",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ You almost miss it. Between a support column and a bundle of dead conduit, a narrow service door sits half-shadowed—unmarked except for a faded strip of tape and a maintenance stencil so old it looks like grime. No sealant. No lock. Just neglect as camouflage. The handle gives with a quiet, well-oiled refusal to make a scene. ]",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "[Enter the room]" },
                        { "node_id": "end" }
                    ]
                },

                "return": {
                    "response": "[ The service door is still there in the corner of your eye—easy to ignore, easier to forget. ]",
                    "destination_nodes": [
                        { "node_id": "inspect_emitters" },
                        { "node_id": "inspect_filters" },
                        { "node_id": "inspect_notes" },
                        { "node_id": "terminal_intro" },
                        { "node_id": "end" }
                    ]
                },

                "inspect_emitters": {
                    "prompt": "[Look at the emitter row]",
                    "response": "[ Small units sit in a neat line, each with a tiny status window that used to glow. Their labels are technical and unsettlingly gentle:<i>\"WHITE NOISE — COMPLIANCE\"</i>, <i>\"PHOTON SOFTENING\"</i>, <i>\"AGITATION DAMPING\"</i> ]",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Look elsewhere." }
                    ]
                },

                "inspect_filters": {
                    "prompt": "[Inspect the cartridge bays]",
                    "response": "[ Filter housings, removable cartridges—most of them empty. One bay still holds a cracked capsule marked with a simple icon: a steady heart line. The inventory tag isn’t chemical. It’s procedural:<br><i>\"STABILIZATION MEDIUM — DO NOT DISCLOSE\"</i> ]",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Step back." }
                    ]
                },

                "inspect_notes": {
                    "prompt": "[Read the taped maintenance notes]",
                    "response": "[ A checklist is taped above the workbench. The print is clean, the handwriting less so.<br><i>\"Shift start: verify output.\"</i><br><i>\"If agitation persists: escalate.\"</i><br>Beneath, in darker ink: <i>\"Escalation works. But they stop asking.\"</i> ]",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "That’s enough." }
                    ]
                },

                "terminal_intro": {
                "prompt": "[Approach the terminal]",
                    "response": "[ A service terminal is bolted into a cabinet, screen dark under a film of dust. You brush it clean and the display wakes slowly, as if surprised anyone still knows it exists. Many entries are flagged <i>CORRUPT</i>. ]",
                    "destination_nodes": [
                        { "node_id": "terminal_index" },
                        { "node_id": "return", "prompt_replacement": "[Step away from terminal back to the room]" }
                    ]
                },

                "terminal_index": {
                    "prompt": "[Open the directory listing]",
                    "response": "[ The cursor blinks like it’s waiting for the next bad decision. ]",
                    "destination_nodes": [
                        { "node_id": "rec_ops_log_14" },
                        { "node_id": "rec_incident_north_hall" },
                        { "node_id": "rec_staff_note" },
                        { "node_id": "rec_access_change" },
                        { "node_id": "return", "prompt_replacement": "[Close the directory. Step away from terminal back to the room]" }
                    ]
                },

                "rec_ops_log_14": {
                    "prompt": "[Open: OPS_LOG_14]",
                    "response": "[ TEXT RECOVERY: 31% ]<br><br><i>\"…public compliance improving.\"</i><br><i>\"…panic incidents down 22%.\"</i><br><i>\"…violent altercations down 41%.\"</i><br><i>\"…unintended side effect: reduced participation in long-horizon maintenance.\"</i><br><br><i>\"…staff note: 'They smile more. They plan less.'\"</i><br><br>[ The last sentence repeats until the terminal gives up. ]",
                    "destination_nodes": [
                        { "node_id": "terminal_index", "prompt_replacement": "Back." }
                    ]
                },

                "rec_incident_north_hall": {
                    "prompt": "[Open: INCIDENT_NORTH_HALL]",
                    "response": "[ TEXT RECOVERY: 19% ]<br><br><i>\"…agitation spike following rumor of corridor charter…\"</i><br><i>\"…recommend suppression of 'network expansion' language; triggers hostility.\"</i><br><i>\"…escalated stabilization output.\"</i><br><i>\"…Outcome: hostility subsided. Curiosity subsided.\"</i><br><br>[ The report ends with an error code that looks almost embarrassed. ]",
                    "destination_nodes": [
                        { "node_id": "terminal_index", "prompt_replacement": "Back." }
                    ]
                },

                "rec_staff_note": {
                    "prompt": "[Open: STAFF_NOTE__\"PLAN LESS\"]",
                    "response": "[ TEXT RECOVERY: 23% ]<br><br><i>\"We reduced panic. It worked.\"</i><br><i>\"They don’t fight.\"</i><br><i>\"They don’t volunteer.\"</i><br><i>\"They don't ask for routes.\"</i><br><br><i>\"Maybe that’s the point.\"</i><br><br>[ The last line is cut off mid-word. ]",
                    "destination_nodes": [
                        { "node_id": "terminal_index", "prompt_replacement": "Back." }
                    ]
                },

                "rec_access_change": {
                    "prompt": "[Open: ACCESS_CHANGE_RECORD]",
                    "response": "[ TEXT RECOVERY: 5% ]<br><br><i>\"…moved wing operations to RESTRICTED ACCESS MODE.\"</i><br><i>\"…directive: do not discuss incident narrative; provide comfort framing only.\"</i> ]",
                    "destination_nodes": [
                        { "node_id": "terminal_index", "prompt_replacement": "Back." }
                    ]
                },

                "end": {
                    "prompt": "[Leave the service room]",
                    "response": "[ You step back into the neon spill. The door remains where it was—unlocked, unadvertised, and easy to pretend you never noticed. ]"
                }
            }
        },
        "tunnel_passage": {
            "name": "Relay Crawlspace",
            "type": "advanture",
            "is_available": false,
            //"description": "A narrow service branch where relay lines converge. The air is warm with power leakage and animal breath.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ A narrow service branch where relay lines converge. The air is warm with power leakage and animal breath. The crawlspace is labeled in faded stencil: <i>\"SIGNAL SPINE — DO NOT OBSTRUCT\"</i>.]",
                    "destination_nodes": [
                        { "node_id": "enter_nest" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ Warmth, scratch marks, and the quiet certainty that entropy is patient. ]",
                    "destination_nodes": [
                        { "node_id": "enter_nest", "prompt_replacement": "[Follow the chewed relay line]" },
                        { "node_id": "story_3" },
                        { "node_id": "end" }
                    ]
                },

                "enter_nest": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 1 }
                        ]
                    },
                    "prompt": "[Enter the crawlspace]",
                    "response": "[ You push deeper. Relay bundles hang like nerves. Some are gnawed clean. Someone patched them once with care—then stopped returning. ]",
                    "destination_nodes": [
                        { "node_id": "story_2" }
                    ]
                },
                "story_2": {
                    "prompt": "[Keep going]",
                    "response": "[ You find old chalk marks: dates, initials, a maintenance rota—then nothing. The last date ends mid-line, like the writer got bored of the future. The scratching grows louder. ]",
                    "destination_nodes": [
                        { "node_id": "ambush_1" }
                    ]
                },
                "ambush_1": {
                    "prompt": "[Press on]",
                    "response": "[ Glow-rats surge from a heat pocket in the wall. ]",
                    "destination_nodes": [
                        { "node_id": "ambush_2" }
                    ]
                },
                "ambush_2": {
                    "prompt": "[Defend yourself]",
                    "mode": "battle",
                    "enemy": "rat",
                    "response": "[ You fight through them, breathing insulation dust and animal panic. This is what happens when maintenance becomes reaction. ]",
                    "outcomes": [
                        //{ "type": "STAT_CHANGE", "stat": "hp", "value": -10 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 100 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 2 }
                    ],
                    "destination_nodes": [
                        { "node_id": "story_3" },
                        { "node_id": "end", "prompt_replacement": "[Back out and regroup]" }
                    ]
                },
                "story_3": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "pest_control", "stage": 2 }
                        ]
                    },
                    "prompt": "[Follow the warmth to the source]",
                    "response": "[ The space opens into a relay junction cavern. In the center: a nest built from wire, tags, and bone—wrapped around an old signal coupler like it’s an altar. Atop it sits the queen, eyes bright with borrowed electricity. ]",
                    "destination_nodes": [
                        { "node_id": "fight_queen" },
                        { "node_id": "end" , "prompt_replacement": "[Back out and regroup]" }
                    ]
                },
                "fight_queen": {
                    "mode": "battle",
                    "enemy": "queen_rat",
                    "prompt": "[Destroy the pressure point]",
                    "response": "[ You end it. Not heroic—mechanical. When the queen falls, the relay junction exhales. Something heavy clinks free from the nest: a token stamped with station glyphs. ]",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "pest_control", "stage": 3 },
                        //{ "type": "STAT_CHANGE", "stat": "hp", "value": -15 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 200 },
                        { "type": "ITEM_GAIN", "item_id": "amplifier_token" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", "prompt_replacement": "[Leave the now-quiet junction]" }
                    ]
                },

                "end": {
                    "prompt": "[Back away]",
                    "response": "[ You retreat toward the wider tunnel, leaving the relay lines to their fragile hum. ]"
                }
            }
        }
    },
    "nexus_calm_initiative_wing": {
        "biometric_kiosk": {
            "name": "Biometric Kiosk",
            "type": "device",
            "is_available": true,
            "description": "A waist-high kiosk with a palm reader and a soft glow that feels like a smile you didn't ask for.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ The kiosk wakes as you approach. A polite chime. A prompt: <i>\"PLACE HAND — CALM ACCESS\"</i>. ]",
                    "destination_nodes": [
                        { "node_id": "use_token" },
                        // { "node_id": "try_without_token" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The kiosk waits. Patient. Certain. ]",
                    "destination_nodes": [
                        { "node_id": "use_token" },
                        // { "node_id": "try_without_token" },
                        { "node_id": "end" }
                    ]
                },

                "use_token": {
                    // "once": true,
                    "conditions": {
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "amplifier_token" }
                        ]
                    },
                    "prompt": "[Place hand and present the token]",
                    "response": "[ The token’s glyphs align with the kiosk’s light. A tone like relief.<br>The screen flashes: <i>\"RESONANCE MATCH — USER VARIANT DETECTED\"</i>.<br>A door control icon appears: <i>\"ARCHIVE LAYER: UNLOCK\"</i>. ]",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 3 },
                        { "type": "NPC_UNLOCK", "location_id": "nexus_calm_initiative_wing", "npc_id": "project_board" },
                        { "type": "NPC_UNLOCK", "location_id": "nexus_calm_initiative_wing", "npc_id": "archive_terminal" },
                        { "type": "ITEM_LOSE", "item_id": "amplifier_token" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end", }
                    ]
                },
                // "try_without_token": {
                //     "conditions": {
                //         "condition": [
                //             { "type": "NO_ITEM", "item_id": "amplifier_token" }
                //         ]
                //     },
                //     "prompt": "[Place hand]",
                //     "response": "[ The kiosk reads you. Pauses. Then displays: <i>\"INSUFFICIENT AUTHORIZATION\"</i>.<br>A softer line follows: <i>\"COMPLIANCE IMPROVES WELLBEING\"</i>. ]",
                //     "destination_nodes": [
                //         { "node_id": "return", "prompt_replacement": "Right." }
                //     ]
                // },
                "end": {
                    "prompt": "[Leave the kiosk]",
                    "response": "[ The glow dims, as if disappointed. ]"
                }
            }
        },
        "archive_terminal": {
            "name": "Archive Terminal",
            "type": "device",
            "is_available": false,
            "description": "",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ The clinic terminal wakes with a gentle chime, as if calm can be enforced through user experience. A header fades in:<br><br><b>GCI CLINIC NODE: NN-04 // NEON NEXUS TRANSIT WING</b><br><b>PROGRAM:</b> CALM INITIATIVE (C.I.)<br><b>STATUS:</b> ARCHIVED / PARTIAL CORRUPTION ]",
                    "destination_nodes": [
                        { "node_id": "directory" },
                        { "node_id": "end" }
                    ]
                },

                "return": {
                  "response": "[ The terminal idles in a muted palette. Calm as a default. ]",
                  "destination_nodes": [
                    { "node_id": "directory" },
                    { "node_id": "end" }
                  ]
                },

                "directory": {
                  "prompt": "[Open record index]",
                  "response": "[ The cursor blinks like it expects you to stop caring. ]",
                  "destination_nodes": [
                    { "node_id": "rec_branch_identity" },

                    { "node_id": "rec_distribution_w1" },
                    // { "node_id": "rec_metrics_m1" },
                    // { "node_id": "rec_clinical_m3" },
                    // { "node_id": "rec_pharm_m6" },
                    { "node_id": "rec_pediatric_y2" },
                    // { "node_id": "rec_epid_y3" },
                    // { "node_id": "rec_ethics_emerg" },
                    { "node_id": "rec_ops_y4" },
                    // { "node_id": "rec_ops_y5" },
                    { "node_id": "rec_facility_auto" },
                    { "node_id": "rec_manual_override" },
                    // { "node_id": "rec_variant_cohort" },
                    // { "node_id": "rec_fo_postmortem" },

                    { "node_id": "end", "prompt_replacement": "[Close the terminal]" }
                  ]
                },

                // 0) Local branch identity
                "rec_branch_identity": {
                  "prompt": "[Open: BRANCH_IDENTITY.txt]",
                  "response": "[ BRANCH IDENTITY — INTACT ]<br><br><b>Branch:</b> Neon Nexus Clinic Node (NN-04)<br><b>Affiliation:</b> GCI — <i>Global Calm Initiative</i><br><b>Mandate:</b> Reduce panic events, lower cognitive overload, stabilize civic cohesion in high-density transit shelters.<br><b>Distribution Type:</b> Voluntary enrollment + emergency stabilization protocol.<br><b>Staffing:</b> 12 clinical, 4 technical, 2 security liaison.<br><br><i>Addendum:</i> \"Do not describe the program as social engineering. Use 'public health stabilization'.\" ]",
                  "destination_nodes": [
                    { "node_id": "directory", "prompt_replacement": "Back to records." }
                  ]
                },

                // 1) Early distribution + success
                "rec_distribution_w1": {
                  "prompt": "[LOGS: MONTH 0-6]",
                  "response": "[ DISTRIBUTION LOG — WEEK 1 (PARTIAL) ]<br>Enrollment exceeded projections. Residents describe the intervention as 'quiet' and 'finally breathable.'<br>Panic episodes decreased within 72 hours. Market disputes de-escalate faster; fewer retaliatory cycles. Self-harm incidence down. Sleep quality up.<br>No observed impairment to empathy or cooperation. ]",
                  "destination_nodes": [
                    { "node_id": "rec_metrics_m1", "prompt_replacement": "[Next page]" },
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },
                "rec_metrics_m1": {
                  "prompt": "[Open: METRICS_SUMMARY - M1 rollout]",
                  "response": "[ METRICS SUMMARY — MONTH 1 (INTACT) ]<br><br><b>Panic events:</b> -38%<br><b>Interpersonal violence:</b> -41%<br><b>Hoarding behavior:</b> -17%<br><b>Volunteer turnout (sanitation):</b> +12%<br><br>Clinician note: \"It works. People are kinder when they’re not flooded.\" ]",
                  "destination_nodes": [
                    { "node_id": "rec_clinical_m3", "prompt_replacement": "[Next page]" },
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },
                "rec_clinical_m3": {
                  "prompt": "[Open: CLINICAL_OBS - M3 Side-effects]",
                  "response": "[ CLINICAL OBSERVATION — MONTH 3 (PARTIAL) ]<br> We observe unexpected behavioral shift: reduced engagement with long-horizon planning. Patients decline participation in multi-week maintenance schedules. We hear language trend: fewer conditional futures ('if we… next season…'). They report contentment. They also report diminished 'restlessness.'<br><br>Clinician comment: \"We are treating distress, not ambition. But the boundary is… less clear than our grant proposal implied.\" ]",
                  "destination_nodes": [
                    { "node_id": "rec_pharm_m6", "prompt_replacement": "[Next page]" },
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },
                "rec_pharm_m6": {
                  "prompt": "[Open: PHARM_NOTE - M6 Persistence]",
                  "response": "[ PHARMACOKINETICS NOTE — MONTH 6 (PARTIAL) ]<br><br>Retention curve abnormal: effect persists beyond expected half-life. Follow-up dosing not required for many participants. Protocol adjustment recommended: reduce distribution volume; monitor long-term persistence.<br><br>Technician note: \"This is... revenue-ineffective.\"<br>Clinician note: \"We designed an intervention. We may have created a baseline.\" ]",
                  "destination_nodes": [
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },

                // 2) Spread
                "rec_pediatric_y2": {
                  "prompt": "[LOGS: YEAR 2-3]",
                  "response": "[ PEDIATRIC OBSERVATION — MONTH 18 (PARTIAL) ]<br><br>\"Infants born to enrolled participants show attenuated startle response and rapid autonomic recovery without direct administration. Crying episodes shorter; self-soothing latency reduced.<br><br>Clinician note: \"This is presenting as baseline temperament, not a transient effect.\" ]",
                  "destination_nodes": [
                    { "node_id": "rec_epid_y3", "prompt_replacement": "[Next page]" },
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },
                "rec_epid_y3": {
                  "prompt": "[Open: EPID_ALERT - Y2 Spread]",
                  "response": "[ EPIDEMIOLOGY ALERT — YEAR 2 (FRAGMENT) ]<br><br>Effect markers appearing in non-enrolled cohorts. No evidence of clandestine dosing. Distribution pathways unknown. Hypothesis: expression shift / horizontal spread.<br><br>Recovered sentence: \"We didn’t distribute it fast enough to explain this.\" ]",
                  "destination_nodes": [
                    { "node_id": "rec_ethics_emerg", "prompt_replacement": "[Next page]" },
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },
                "rec_ethics_emerg": {
                  "prompt": "[Open: ETHICS_MINUTES_EMERG]",
                  "response": "[ EMERGENCY ETHICS MINUTES (DAMAGED) ]<br><br>We initiated a global intervention.... public narrative must remain: 'temporary stabilization.', do not use the term 'genetic'...<br>Recovered line: \"The world will not tolerate learning it was softened.\" ]",
                  "destination_nodes": [
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },

                // 3) Y4+
                "rec_ops_y4": {
                  "prompt": "[LOGS: YEAR 4-10]",
                  "response": "[ OPS LOG — YEAR 4 (INTACT) ]<br><br>All metrics stable. No incidents. Supplies adequate. Staff rotation unchanged. Community calm. ]",
                  "destination_nodes": [
                    { "node_id": "rec_ops_y5", "prompt_replacement": "[Next page]" },
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },
                "rec_ops_y5": {
                  "prompt": "[Open: OPS_LOG_Y5]",
                  "response": "[ OPS LOG — YEAR 5 (INTACT) ]<br><br> Calm. Calm. Calm.",
                  "destination_nodes": [
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },

                // 4) Automated sealing (no staff present)
                "rec_facility_auto": {
                  "prompt": "[Open: AUTO LOG: FACILITY_STATUS]",
                  "response": "[ FACILITY STATUS — AUTO (INTACT) ]<br><br>Personnel presence: 0. Clinic operations: unattended<br>Safety protocol: INITIATE SEALING. Action: lock research archives / lock distribution stores / lock central comms.<br><br>\"CENTRAL GCI RESEARCH CENTER: SEALED\"<br>\"ALL LOCAL NODES: ARCHIVE AND SHUTDOWN\"<br>\"Reason code: 'Public Stability Preservation' ]",
                  "destination_nodes": [
                    { "node_id": "directory", "prompt_replacement": "Back." }
                  ]
                },

                // 5) Late manual access: Forgotten Outpost union attempt
                "rec_manual_override": {
                  "prompt": "[Open: ACCESS OVERRIDE: MANUAL_ENTRY]",
                  "response": "[ MANUAL ENTRY — ACCESS OVERRIDE (INTACT) ]<br><br>If you’re reading this, you’re not like the others. Some of us can still think in scaffolds. We can plan beyond our sightline. We can trust a black box if we can rebuild it. We are not saviors. We are irritants in a culture that learned peace through simplification. ]",
                  "outcomes": [
                    {"type": "QUEST_SET_STAGE", "quest_id": "echoes_of_the_past", "stage": 3 }
                  ],
                  "destination_nodes": [
                    { "node_id": "rec_variant_cohort" }
                  ]
                },
                "rec_variant_cohort": {
                  "prompt": "[next page]",
                  "response": "[ I got into CENTRAL. It wasn’t hard—just... nobody cared enough to keep it locked properly. We tried to union settlements again. We called it the Forgotten Outpost because nobody could hold it in their head long enough to keep returning. If you can tolerate the weight of a system, find out a way to go there. ]",
                  "destination_nodes": [
                    { "node_id": "rec_fo_postmortem" }
                  ]
                },
                "rec_fo_postmortem": {
                  "prompt": "[next page]",
                  "response": "We built scaffolding that could have held: schedules, shared rules, maintenance loops—real systems, not slogans. But we never hit critical mass. Too few tinkers. Too few minds willing to carry abstraction long enough to keep showing up when it got boring. Maintenance rosters didn’t collapse—they thinned. One name missed a shift, then two. No sabotage.No betrayal. Just opt-out. ]",
                  "destination_nodes": [
                    { "node_id": "directory", "prompt_replacement": "[Back to the directory]" }
                  ]
                },

                "end": {
                  "prompt": "[Step away from the terminal]",
                  "response": "[ The screen fades back to its curated calm. The kind that asks nothing of you. ]"
                }

            }
        },
        "project_board": {
            "name": "Project Board",
            "type": "advanture",
            "is_available": false,
            "description": "A wall of timelines and milestones. Many lines terminate without explanation.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ Project rows run across the board in clean print. Then, abruptly, the ink changes to handwriting.\"DEFER.\", \"NO LONG-TERM.\", \"LOCAL SATISFACTION THRESHOLD MET.\"]",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "[ The board looks like a society deciding to stop wanting. ]",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "end": {
                    "prompt": "[Leave it]",
                    "response": "[ You feel the strange weight of a future cancelled by consensus. ]"
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "the_whispering_signal", "stage": 0 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "the_whispering_signal", "stage": 1 }
                        ]
                    },
                    "prompt": "About the resonators...",
                    "response": "The signal fades. Time is not on our side. Have you spoken to Finn?",
                    "destination_nodes": [ { "node_id": "quest_signal_boost_completion" }, { "node_id": "end" } ]
                },
                "quest_signal_boost_completion": {
                    "conditions": {
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "harmonic_resonator", "quantity": 3 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 0 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 1 }
                        ]
                    },
                    "prompt": "About those hounds...",
                    "response": "Are they gone or not? Stop wasting my time.",
                    "destination_nodes": [
                        { "node_id": "quest_scout_completion" },
                        //{ "node_id": "quest_scout_completion" },
                        { "node_id": "end", "prompt_replacement": "Give me few more time to sort it out" }
                    ]
                },
                "quest_scout_completion": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 3 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 99 }
                        ]
                    },
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
            "inventory": [{"item_id": "purified_water", "quantity": 1 }, { "item_id": "mutfruit", "quantity": 1 }],
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 0 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 99 }
                        ]
                    },
                    "prompt": "I got to the vault, but haven't managed to get in. The doors locked right in front of my nose.",
                    "response": "Ah, what a shame. I knew it is not a easy task. Anywait, thanks for trying.",
                    "outcomes": [],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "quest_seed_completion": {
                    "conditions": {
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "heirloom_seed_packet" }
                        ]
                    },
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
            "inventory": [{"item_id": "signal_jammer", "quantity": 1 }],
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "the_whispering_signal", "stage": 1 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 1 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 1 }
                        ]
                    },
                    "prompt": "I'm here to do what Silas couldn't.",
                    "response": "Affirmative. Hostile intent confirmed. Engaging termination protocols.",
                    "destination_nodes": [
                        { "node_id": "fight_all" }
                    ]
                },
                "intent_talk": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 1 }
                        ]
                    },
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
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 52 }
                        ]
                    },
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
                        { "node_id": "bring_jammer" },
                        { "node_id": "offer_jammer" },
                        { "node_id": "choice_kill" }
                    ]
                },
                "bring_jammer": {
                    "conditions": {
                        "condition": [
                            { "type": "NO_ITEM", "item_id": "signal_jammer" }
                        ]
                    },
                    "prompt": "Okay, let me see what can I do",
                    "response": "Ack. Get back with the jammer and not with a reinforcement",
                    "outcomes": [],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "offer_jammer": {
                    "conditions": {
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "signal_jammer" }
                        ]
                    },
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
                "choice_kill": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 52 }
                        ]
                    },
                    "prompt": "You're too dangerous to live. I'm finishing the job.",
                    "response": "A predictable outcome. You have chosen the path of ignorance and death. So be it. Pack! Defend your home!",
                    "destination_nodes": [{ "node_id": "fight_leader" }]
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
                    "prompt": "[Leave Rex]",
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
                        { "node_id": "report_whisper" }, 
                        { "node_id": "punishment_node" }, 
                        { "node_id": "end" } 
                    ]
                },
                "return": {
                    "response": "You're back. Don't waste my time.",
                    "destination_nodes": [ 
                        { "node_id": "story_1" }, 
                        { "node_id": "report_whisper" }, 
                        { "node_id": "punishment_node" }, 
                        { "node_id": "house_cleaning_stage_2" }, 
                        { "node_id": "house_cleaning_stage_3" }, 
                        { "node_id": "house_cleaning_stage_final" }, 
                        { "node_id": "house_cleaning_respect" }, 
                        { "node_id": "end" } 
                    ]
                },
                "story_1": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100, "op": "neq"}
                        ]
                    },
                    "prompt": "What is this place?",
                    "response": "The Rust Pit. We reclaim, we rebuild. Best scrap operation this side of the Ash Fields. We keep the gears of the world turning.",
                    "destination_nodes": [ 
                        { "node_id": "return" , "prompt_replacement": "Tell me about the something else."} 
                    ]
                },
                "report_whisper": {
                    "conditions": { 
                        "op": "AND",
                        "condition": [ 
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 0 },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 2, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 3, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 51, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100, "op": "neq" },
                        ]
                    },
                    "prompt": "Whisper sent me to steal a ledger from Corvus.",
                    "response": "Did he now? That rat is always stirring up trouble. Corvus is also a snake. I'm tired of both of them. I want you to clean house. Get the ledger from Corvus, bring it to me. I did a copy of the Corvus's desk key. Take it and use it to open the safe. Then, we'll deal with Whisper.",
                    "outcomes": [ 
                        { "type": "QUEST_SET_STAGE", "quest_id": "house_cleaning", "stage": 1 }, 
                        { "type": "ITEM_GAIN", "item_id": "corvus_key" }
                    ],
                    "destination_nodes": [ 
                        // decline house cleaning
                        { "node_id": "end" } 
                    ]
                },
                "house_cleaning_stage_2": {
                    "conditions": { 
                        "op": "AND",
                        "condition": [ 
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 2 }, 
                            { "type": "HAVE_ITEM", "item_id": "corvus_ledger" } ,
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 3, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 51, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100, "op": "neq" },
                        ]
                    },
                    "prompt": "I have the ledger.",
                    "response": "Good. Let me see... just as I thought. Corvus has been skimming profits. He's a liability. Take care of him. Then come back, and we'll finish this with Whisper.",
                    "outcomes": [ 
                        { "type": "QUEST_SET_STAGE", "quest_id": "house_cleaning", "stage": 3 }, 
                        { "type": "ITEM_LOSE", "item_id": "corvus_ledger" },
                    ],
                    "destination_nodes": [ 
                        // there are other nodes to go to
                        { "node_id": "end" } 
                    ]
                },
                "house_cleaning_stage_3": {
                    "conditions": { 
                        "op": "AND",
                        "condition": [ 
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 4 },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 3, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 51, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100, "op": "neq" },
                        ] 
                    },
                    "prompt": "Corvus is dealt with. What about Whisper?",
                    "response": "One loose end remains. Go tell Whisper the job is done, but Corvus fought back. Lure him out. Then, silence him for good. I want a clean pit.",
                    "outcomes": [ 
                        { "type": "QUEST_SET_STAGE", "quest_id": "house_cleaning", "stage": 5 },
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "house_cleaning_stage_final": {
                    "conditions": { 
                        "op": "AND",
                        "condition": [ 
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 6 },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 3, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 51, "op": "neq" },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 10, "op": "neq" },
                        ]
                    },
                    "prompt": "Whisper is out of the game too.",
                    "response": "Whisper is dead. The pit is clean. People of the pit and I will never forget what you did.",
                    "outcomes": [ 
                        { "type": "QUEST_SET_STAGE", "quest_id": "house_cleaning", "stage": 100 },
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 101 },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 2000 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 1000 },
                        { "type": "REPUTATION_CHANGE", "value": 50 }
                    ],
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "punishment_node": {
                    "conditions": { 
                        "condition": [ 
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 }
                        ]
                    },
                    "prompt": "About what happened...",
                    "response": "You thought you could play games in my pit? You killed Corvus, a valuable asset, because a rat told you to. You're a fool and a liability. This is your only warning. Valeria gets out the gun and shoots you in the head.",
                    "destination_nodes": [ { "node_id": "punishment_node_2"}]
                },
                "punishment_node_2": {
                    "prompt": "[ Defend yourself ]",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -60 },
                        { "type": "NPC_LOCK", "location_id": "rust_pit", "npc_id": "boss_valeria" },
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 101 },
                        { "type": "REPUTATION_CHANGE", "value": -50 }
                    ],
                    "response": "...",
                    "destination_nodes": [ { "node_id": "end" , "prompt_replacement": "..."}]
                },
                "house_cleaning_respect": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 100 }
                        ]
                    },
                    "prompt": "How things are going?",
                    "response": "The pit is clean. People of the pit and I will never forget what you did.",
                    "destination_nodes": [ { "node_id": "end" } ]
                },
                "end": { 
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 , "op": "neq"}
                        ]
                    },
                    "prompt": "I'll get to it.", 
                    "response": "Don't disappoint me." 
                }
            }
        },
        "ratchet": {
            "name": "Ratchet",
            "type": "npc",
            "is_available": true,
            "description": "A young, energetic technician, constantly wiping grime from a pair of antique glasses. He's surrounded by piles of disassembled machinery.",
            "is_merchant": true,
            "inventory": [{"item_id": "leather_armor", "quantity": 1 }],
            "dialogue_graph": {
                "start": {
                    "response": "Hey! Watch your step! This stuff is delicate. Mostly. I'm Ratchet. You need something fixed, or just browsing the mechanical graveyard?",
                    "destination_nodes": [
                        { "node_id": "trade" }, 
                        { "node_id": "story_1" }, 
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Oh, hey! Back again. Did you break something already?",
                    "destination_nodes": [
                        { "node_id": "trade" }, 
                        { "node_id": "story_1" }, 
                        // { "node_id": "valeria_quest_reaction" }, 
                        { "node_id": "end" }]
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
                // "valeria_quest_reaction": {
                //     "conditions": {
                //         "condition": [
                //             { "type": "QUEST_STAGE", "quest_id": "scrappers_union", "stage": 1 }
                //         ]
                //     },
                //     "prompt": "[INT 5] Valeria sent me for a cryo-coupler.",
                //     "response": "She did? Whoa. Be careful, the old pumping station's security is no joke. But if you find it, that press will run smoother than ever. It's the key to our whole operation.",
                //     "destination_nodes": [{ "node_id": "end" }]
                // },
                // "end": { "prompt": "See you.", "response": "Keep your circuits clean!" }
            }
        },
        "doc_eris": {
            "name": "Doc Eris",
            "type": "npc",
            "is_available": true,
            "description": "A grim-faced woman with a cybernetic arm, tending to an injured scrapper in a makeshift infirmary. The scent of antiseptic hangs heavy in the air.",
            "is_merchant": true,
            "inventory": [{"item_id": "stimpack", "quantity": 1 }],
            "dialogue_graph": {
                "start": { 
                    "response": "Unless you're bleeding, wait your turn. I'm Doc Eris. What's the damage?", 
                    "destination_nodes": [
                        { "node_id": "story_1" }, 
                        { "node_id": "trade" }, 
                        // { "node_id": "quest_tainted_metal_intro" }, 
                        { "node_id": "end" }
                    ]
                },
                "return": { 
                    "response": "You again. Don't tell me you're hurt already.", 
                    "destination_nodes": [
                        { "node_id": "story_1" }, 
                        { "node_id": "trade" }, 
                        // { "node_id": "quest_tainted_metal_intro" }, 
                        // { "node_id": "quest_tainted_metal_reminder" }, 
                        { "node_id": "end" }
                    ] 
                },
                "trade": { "prompt": "I need medical supplies.", "response": "I've got the basics. It'll cost you. Good health isn't free.", "destination_nodes": [{ "node_id": "return", "prompt_replacement": "Something else." }] },
                "story_1": { "prompt": "You're the doctor here?", "response": "I'm the only thing between these fools and a tetanus infection. I patch them up so Valeria can send them back out to get new holes. It's a living.", "destination_nodes": [{ "node_id": "quest_tainted_metal_intro" }, { "node_id": "end" }] },
                // "quest_tainted_metal_intro": {
                //     "conditions": {
                //         "condition": [
                //             { "type": "QUEST_STAGE", "quest_id": "tainted_metal", "stage": 0 }
                //         ]
                //     },
                //     "prompt": "You seem busy.",
                //     "response": "Always. Lately, more than usual. Scrappers are coming back with a weird sickness. A 'metal rot'. They handle some junk, and days later, their skin starts... flaking. I need a sample of the source metal to synthesize an antidote. Someone mentioned a strange, shimmering ore in the quarry nearby.",
                //     "destination_nodes": [{ "node_id": "quest_tainted_metal_accept" }, { "node_id": "quest_tainted_metal_reject" }]
                // },
                // "quest_tainted_metal_accept": {
                //     "prompt": "I'll get your sample.",
                //     "response": "You will? Don't touch it with your bare hands. Use these geo-tongs. Bring it straight back to me. The lives of my patients depend on it.",
                //     "outcomes": [{ "type": "QUEST_SET_STAGE", "quest_id": "tainted_metal", "stage": 1 }, { "type": "ITEM_GAIN", "item_id": "geo_tongs" }],
                //     "destination_nodes": [{ "node_id": "end" }]
                // },
                // "quest_tainted_metal_reject": { "prompt": "Sounds contagious. I'll pass.", "response": "Your funeral. Just don't come crawling to me when your fingers fall off.", "destination_nodes": [{ "node_id": "end" }] },
                // "quest_tainted_metal_reminder": {
                //     "conditions": {
                //         "condition": [
                //             { "type": "QUEST_STAGE", "quest_id": "tainted_metal", "stage": 1 }
                //         ]
                //     },
                //     "prompt": "About that metal sample...",
                //     "response": "Do you have it? People are getting worse. I can't hold this infection back forever.",
                //     "destination_nodes": [{ "node_id": "quest_tainted_metal_completion" }, { "node_id": "end" }]
                // },
                // "quest_tainted_metal_completion": {
                //     "conditions": {
                //         "condition": [
                //             { "type": "HAVE_ITEM", "item_id": "shimmering_ore" }
                //         ]
                //     },
                //     "prompt": "I have the shimmering ore.",
                //     "response": "Finally! Let me see... yes, the radiation signature is off the charts. I can work with this. You've saved lives today. Take this. You've more than earned it.",
                //     "outcomes": [
                //         { "type": "QUEST_SET_STAGE", "quest_id": "tainted_metal", "stage": 100 },
                //         { "type": "ITEM_LOSE", "item_id": "shimmering_ore" },
                //         { "type": "ITEM_LOSE", "item_id": "geo_tongs" },
                //         { "type": "STAT_CHANGE", "stat": "xp", "value": 450 },
                //         { "type": "STAT_CHANGE", "stat": "caps", "value": 300 },
                //         { "type": "REPUTATION_CHANGE", "value": 10 }
                //     ],
                //     "destination_nodes": [{ "node_id": "end" }]
                // },
                "end": { "prompt": "Stay healthy.", "response": "I'll try." }
            }
        },
        "whisper": {
            "name": "Whisper",
            "type": "npc",
            "is_available": true,
            "description": "A shadowy figure lurking near a stack of rusted containers. They seem to be a source of information.",
            "is_merchant": false,
            "dialogue_graph": {
                "start": { 
                    "response": "Psst. Over here. You look like someone who seeks... opportunities. I'm Whisper. I hear things. For a price.", 
                    "destination_nodes": [
                        { "node_id": "story_1" }, 
                        { "node_id": "quest_intro" }, 
                        { "node_id": "end" }
                    ] 
                },
                "return": { 
                    "response": "You're back.", 
                    "destination_nodes": [ 
                        { "node_id": "story_1" }, 
                        { "node_id": "quest_intro" }, 
                        { "node_id": "quest_completion_stolen" }, 
                        { "node_id": "quest_completion_killed_corvus" }, 
                        { "node_id": "quest_betrayal" }, 
                        { "node_id": "house_cleaning_lure" }, 
                        { "node_id": "end" } 
                    ] 
                },
                "story_1": {
                    // "conditions":
                    "prompt": "What kind of things do you hear?", 
                    "response": "Secrets. Who's cheating who. Where the good scrap is hidden. Information is the real currency.", 
                    "destination_nodes": [
                        { "node_id": "quest_intro" },
                        { "node_id": "end" }
                    ] 
                },
                "quest_intro": {
                    "conditions": { 
                        "condition": [
                             { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 0 } 
                            ]
                        },
                    "prompt": "I'm looking for a lucrative opportunity.",
                    "response": "I might have one. A man named Corvus has a ledger. Details all her smuggling routes, and his own side deals. That ledger would be very valuable. It's in a locked safe in his corner of the pit. I need it.",
                    "destination_nodes": [
                        { "node_id": "quest_accept" }, 
                        { "node_id": "quest_reject" }
                    ]
                },
                "quest_accept": {
                    "prompt": "Sounds risky. What's my cut?",
                    "response": "Smart. You get me the ledger, I'll pay you well. Our secret.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 1 },
                        { "type": "NPC_UNLOCK", "location_id": "rust_pit", "npc_id": "corvus" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_reject": { 
                    "prompt": "I'm not a thief.", 
                    "response": "Suit yourself. More for the next enterprising soul.", 
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "quest_completion_stolen": {
                    "conditions": { 
                        "op": "AND",
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "corvus_ledger" }, 
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 2 } 
                        ] 
                    },
                    "prompt": "I have the ledger. Stole it clean.",
                    "response": "Excellent! You're a true professional. This is perfect. Here's your payment. A pleasure doing business with you.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "corvus_ledger" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 1000 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 1000 },
                        { "type": "REPUTATION_CHANGE", "value": -20 }
                    ],
                    "destination_nodes": [
                        { "node_id": "final_reward" }
                    ]
                },
                "quest_completion_killed_corvus": {
                    "conditions": { 
                        "op": "AND",
                        "condition": [
                            { "type": "HAVE_ITEM", "item_id": "corvus_ledger" }, 
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 3 } 
                        ]
                    },
                    "prompt": "Corvus is dead. I have the ledger.",
                    "response": "Dead? Messy... but effective. He was a snake anyway. This will do. Here is your payment. Pity about Corvus, he was useful sometimes.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 },
                        { "type": "ITEM_LOSE", "item_id": "corvus_ledger" },
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 1000 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 1000 },
                        { "type": "REPUTATION_CHANGE", "value": -20 }
                    ],
                    "destination_nodes": [
                        { "node_id": "final_reward" }
                    ]
                },
                "final_reward": {
                    "prompt": "Working with you was a pleasure. ",
                    "response": "Hold on. Not as quick. I have one more thing for you. As you now know too much about my business, I can't let you go. You will stay silent. Forever.",
                    "destination_nodes": [ { "node_id": "final_reward_2", } ]
                },
                "final_reward_2": {
                    "prompt": "[ Defend yourself ]",
                    "response": "Whisper suddenly pulls out a penknife and stabs you in the ribs.",
                    "outcomes": [ 
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -50 } ,
                        { "type": "NPC_LOCK", "location_id": "rust_pit", "npc_id": "whisper" }
                    ],
                    "destination_nodes": [ { "node_id": "end", "prompt_replacement": "..." } ]
                },
                "quest_betrayal": {
                    "conditions": { 
                        "condition": [ 
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 50 } 
                        ]
                    },
                    "prompt": "Corvus sends his regards.",
                    "response": "What? That snake! He thinks he can cross me? You made a mistake, outsider. Whisper suddenly pulls out a penknife and stabs you in the ribs.",
                    "destination_nodes": [
                        { "node_id": "betrayal_2"}
                    ]
                },
                "betrayal_2": {
                    "prompt": "[ defend yourself ]",
                    "response": "...",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 51},
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -30 },
                        { "type": "ITEM_GAIN", "item_id": "whisper_ring" }, 
                        { "type": "NPC_LOCK", "location_id": "rust_pit", "npc_id": "whisper" },
                        { "type": "REPUTATION_CHANGE", "value": -30 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" , "prompt_replacement": "..."}
                    ]
                },
                "house_cleaning_lure": {
                    "conditions": { 
                        "condition": [ 
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 5 }
                        ]
                    },
                    "prompt": "The job is done. Corvus fought back.",
                    "response": "He did, eh? Good. Let's go collect my prize. Meet me by the old smelter.",
                    "destination_nodes": [
                        { "node_id": "house_cleaning_5" }
                    ]
                },
                "house_cleaning_5": {
                    "prompt": "[ Off to the old smelter.]",
                    "response": "You and Whisper head to the old smelter, where you meet Valeria. Valeria says she is enough of slippery snakes around here and that she's not happy with Whisper.",
                    "destination_nodes": [
                        { "node_id": "house_cleaning_6" }
                    ]
                },
                "house_cleaning_6": {
                    "prompt": "[ Valeria shoots Whisper down]",
                    "response": "Valeria tells you to meet her at the her office for the reward.",
                    "outcomes": [ 
                        { "type": "QUEST_SET_STAGE", "quest_id": "house_cleaning", "stage": 6 },
                        { "type": "NPC_LOCK", "location_id": "rust_pit", "npc_id": "whisper" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" , "prompt_replacement": "..."}
                    ]
                },
                "end": { "prompt": "I'm gone.", "response": "Stay in the shadows." }
            }
        },
        "corvus": {
            "name": "Corvus",
            "type": "npc",
            "is_available": false,
            "description": "A man with sharp eyes and even sharper clothes, standing by a reinforced container. He looks dangerously out of place.",
            "is_merchant": false,
            "dialogue_graph": {
                "start": {
                    "response": "You're not one of the usual grease monkeys. Whisper sent you, didn't he? That little rat wants my ledger.",
                    "destination_nodes": [ 
                        { "node_id": "steal" }, 
                        { "node_id": "house_cleaning_1" }, 
                        { "node_id": "counter_offer" }, 
                        { "node_id": "attack" } 
                    ]
                },
                "return": { 
                    "response": "Still here?", 
                    "destination_nodes": [ 
                        { "node_id": "steal" }, 
                        { "node_id": "house_cleaning_1" }, 
                        { "node_id": "house_cleaning_2" }, 
                        { "node_id": "counter_offer" },  // FIX: on return prompt of counter_offer doesn't sound coherent
                        { "node_id": "attack" },
                        { "node_id": "reward" },
                        { "node_id": "fallback" }
                    ] 
                },
                "steal": {
                    "conditions": { 
                        "op": "AND",
                        "condition": [ 
                            { "type": "STAT_CHECK", "stat": "lck", "min": 8 } ,
                            { "type": "NO_ITEM", "item_id": "corvus_ledger"},
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 , "op": "neq"} 
                        ] 
                    },
                    "prompt": "Whisper? Never heard of him. Just looking around.",
                    "response": "He plays dumb... Accidenlty, he's distracted by someone outside shouting his name aloud. You immediately spot the ledger and quickly snatch it. Corvus turns around and doesn't see the miss",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 2 },
                        { "type": "ITEM_GAIN", "item_id": "corvus_ledger" }
                    ],
                    "destination_nodes": [ { "node_id": "end" , "prompt_replacement": "Nevermind, see you later."} ]
                },
                "house_cleaning_1": {
                    "conditions": {
                        "op": "AND",
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 1 },
                            { "type": "NO_ITEM", "item_id": "corvus_ledger" }
                        ]
                    },
                    "prompt": "Valeria sent me to get you to the Eris to check how her accounts are doing.",
                    "response": "Looks at you suspiciously. Why would she send you? But I'm curious too. Corvus leaves his office and heads off to the Eris's clinic.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "house_cleaning", "stage": 2 },
                        { "type": "ITEM_GAIN", "item_id": "corvus_ledger" },
                        // { "type": "ITEM_LOSE", "item_id": "corvus_key" }
                    ],
                    "destination_nodes": [ { "node_id": "end" , "prompt_replacement": "You open the Corvus's safe and find the ledger."} ]
                },
                "house_cleaning_2": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 3 }
                        ]
                    },
                    "prompt": "Valeria and you passes the Corvus's office in. Valeria says she has seen the ledger and that she's not happy. Valeria pulls out a gun and points it at Corvus.",
                    "response": "Ah, I knew the dirty trick with Eris was to steal my ledger.", // complete the sentence
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "house_cleaning", "stage": 4 },
                        { "type": "NPC_LOCK", "location_id": "rust_pit", "npc_id": "corvus" }
                    ],
                    "destination_nodes": [ { "node_id": "end", "prompt_replacement": "Valeria shoots Corvus in the chest." } ]
                },
                "counter_offer": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 1 },
                        ]
                    },
                    "prompt": "Maybe he did. What's it to you?",
                    "response": "It's a nuisance. That ledger is my business insurance. But Whisper... he's a pest. I'll make you a better offer. Forget the ledger. Eliminate Whisper for me, and I'll make you rich.",
                    "destination_nodes": [ 
                        { "node_id": "counter_offer_accepte_1" },
                        { "node_id": "attack" } 
                    ]
                },
                "counter_offer_accepte_1": {
                    "prompt": "Hmm.. sounds attractive. What's the catch?",
                    "response": "No catch. Whisper has been trying to take my business for years. You eliminate him, I'll give you 5,000 caps.",
                    "destination_nodes": [ 
                        { "node_id": "counter_offer_accepte_2" },
                        { "node_id": "attack" } 
                    ]
                },
                "counter_offer_accepte_2": {
                    "prompt": "5,000 caps? I'm in.",
                    "response": "Brave. Bring the ring from Whisper's index finger to me. With the finger, I'll give you the caps.",
                    "outcomes": [ 
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 50 } 
                    ],
                    "destination_nodes": [ 
                        { "node_id": "end", "prompt_replacement": "That's a good deal." }
                    ]
                },
                "attack": {
                    "conditions": {
                        "op": "AND",
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 1 },
                            // { "type": "NO_ITEM", "item_id": "corvus_ledger" },
                        ]
                    },
                    "prompt": "[ATTACK] Give me the ledger now!",
                    "response": "You fool. You think you're the first to try?",
                    "destination_nodes": [ { "node_id": "attack_2" } ]
                },
                "attack_2": {
                    // "conditions": {
                    //     "condition": [
                    //         { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 51 },
                    //     ]
                    // },
                    "prompt": "[DEFEND YOURSELF]",
                    "response": "Corvus gets out his shoutgun and shoots you in the chest.",
                    "outcomes": [
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 3 },
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -30 },
                        { "type": "ITEM_GAIN", "item_id": "corvus_ledger" },
                        { "type": "NPC_LOCK", "location_id": "rust_pit", "npc_id": "corvus" },
                        { "type": "REPUTATION_CHANGE", "value": -30 }
                    ],
                    "destination_nodes": [ { "node_id": "end", "prompt_replacement": "..." } ]
                },
                "reward": {
                    "conditions": {
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 51 },
                        ]
                    },
                    "prompt": "There is no such a man as Whisper anymore. Just a memory.",
                    "response": "Ah, sound to my ears. I was dreaming about this day for years. Here, take your reward.",
                    "outcomes": [ 
                        { "type": "QUEST_SET_STAGE", "quest_id": "whispers_in_the_dark", "stage": 100 },
                        { "type": "STAT_CHANGE", "stat": "caps", "value": 5000 } ,
                        { "type": "ITEM_LOSE", "item_id": "whisper_ring" }, 
                        { "type": "STAT_CHANGE", "stat": "xp", "value": 1000 },
                        { "type": "REPUTATION_CHANGE", "value": -20 }
                    ],
                    "destination_nodes": [ { "node_id": "final_reward" } ]
                },
                "final_reward": {
                    "prompt": "Working with you was a pleasure. ",
                    "response": "Hold on. Not as quick. I have one more thing for you. As you now know too much about my business, I can't let you go. You will stay silent. Forever. Corvus gets out his shoutgun and shoots you in the chest.",
                    "destination_nodes": [ { "node_id": "final_reward_2" } ]
                },
                "final_reward_2": {
                    "prompt": "[ Defend yourself ]",
                    "response": "...",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -50 },
                        { "type": "NPC_LOCK", "location_id": "rust_pit", "npc_id": "corvus" }
                    ],
                    "destination_nodes": [ { "node_id": "end" , "prompt_replacement": "..."}]
                },
                "fallback": {
                    "conditions": {
                        "op": "OR",
                        "condition": [
                            { "type": "QUEST_STAGE", "quest_id": "house_cleaning", "stage": 2 },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 2 },
                            { "type": "QUEST_STAGE", "quest_id": "whispers_in_the_dark", "stage": 50 },
                        ]
                    },
                    "prompt": "Oh, a wrong door",
                    "response": "...",
                    "destination_nodes": [ { "node_id": "end", "prompt_replacement": "..." } ]
                },
                "end": { "prompt": "See you later.", "response": "Don't beat around the bush too long." }
            }
        }
    },
    "tech_depot": {
        "depot_gates": {
            "name": "Depot Gates",
            "type": "device",
            "is_available": true,
            "description": "Massive reinforced gates covered in warning signs. A control panel glows ominously, and you can hear the faint whir of automated security systems beyond.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "start": {
                    "response": "[ The gates loom before you, massive and imposing. Warning lights pulse rhythmically. A control panel is set into the wall beside the gates. ]",
                    "destination_nodes": [
                        { "node_id": "attempt_open_luck" },
                        { "node_id": "attempt_open_str" },
                        { "node_id": "attempt_force" },
                        { "node_id": "leave" }
                    ]
                },
                "return": {
                    "response": "[ The gates remain closed, the security systems still active. ]",
                    "destination_nodes": [
                        { "node_id": "attempt_open_luck" },
                        { "node_id": "attempt_open_str" },
                        { "node_id": "attempt_force" },
                        { "node_id": "leave" }
                    ]
                },
                "attempt_open_luck": {
                    "conditions": {
                        "condition": [
                            { "type": "STAT_CHECK", "stat": "lck", "min": 8 }
                        ]
                    },
                    "prompt": "Try to use the manual override with precision and luck.",
                    "response": "[ Your fingers dance across the control panel with uncanny precision. The gates slide open with a low rumble, revealing the depot interior. ]",
                    "outcomes": [
                        { "type": "NPC_UNLOCK", "location_id": "tech_depot", "npc_id": "tech_scavenger_alpha" },
                        { "type": "NPC_UNLOCK", "location_id": "tech_depot", "npc_id": "tech_scavenger_beta" },
                        { "type": "NPC_UNLOCK", "location_id": "tech_depot", "npc_id": "tech_scavenger_gamma" },
                        { "type": "NPC_LOCK", "location_id": "tech_depot", "npc_id": "depot_gates" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "attempt_open_str": {
                    "conditions": {
                        "condition": [
                            { "type": "STAT_CHECK", "stat": "str", "min": 8 }
                        ]
                    },
                    "prompt": "Force the gates open with brute strength.",
                    "response": "[ You plant your feet and heave against the massive gates. Your strength is more than enough - the manual override mechanism yields to your brute force. The gates grind open, revealing the depot interior. ]",
                    "outcomes": [
                        { "type": "NPC_UNLOCK", "location_id": "tech_depot", "npc_id": "tech_scavenger_alpha" },
                        { "type": "NPC_UNLOCK", "location_id": "tech_depot", "npc_id": "tech_scavenger_beta" },
                        { "type": "NPC_UNLOCK", "location_id": "tech_depot", "npc_id": "tech_scavenger_gamma" },
                        { "type": "NPC_LOCK", "location_id": "tech_depot", "npc_id": "depot_gates" }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "attempt_force": {
                    "prompt": "[ Try to force the gates open anyway. ]",
                    "response": "[ You attempt to force the gates, but without the required luck or strength, the security system activates. Alarms blare, automated turrets deploy, and gas fills the area! You take 30 damage from the security system before managing to retreat. ]",
                    "outcomes": [
                        { "type": "STAT_CHANGE", "stat": "hp", "value": -30 }
                    ],
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "leave": {
                    "prompt": "[ Leave the depot gates. ]",
                    "response": "[ You decide against attempting to breach the gates. Better to come back when you're stronger or luckier. ]",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "end": {
                    "prompt": "[ Step back. ]",
                    "response": "[ The gates remain as they were. ]"
                }
            }
        },
        "tech_scavenger_alpha": {
            "name": "Alpha",
            "type": "npc",
            "is_available": false,
            "description": "A wiry scavenger hunched over a workbench covered in disassembled electronics. His fingers move with practiced precision as he tinkers with old-world tech.",
            "is_merchant": true,
            "inventory": [{"item_id": "military_goggles", "quantity": 1 }, { "item_id": "harmonic_resonator", "quantity": 1 }],
            "dialogue_graph": {
                "start": {
                    "response": "Well, well. Someone actually made it past the gates. Impressive. I'm Alpha. I deal in old-world electronics and precision tools. What brings you to this death trap?",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Back again? Still alive, I see.",
                    "destination_nodes": [
                        { "node_id": "story_1", "prompt_replacement": "Tell me about this place." },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "story_1": {
                    "prompt": "How did you get in here?",
                    "response": "Same way you did - luck or strength. The gates are the only way in, and not many can bypass that security system. Those of us who made it through set up shop inside. It's dangerous, but the tech here is worth the risk.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "trade": {
                    "prompt": "Let's trade.",
                    "response": "Always happy to do business with someone who can get past those gates.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Anything else?" }
                    ]
                },
                "end": {
                    "prompt": "I'll be going.",
                    "response": "Stay safe out there. The depot doesn't forgive mistakes."
                }
            }
        },
        "tech_scavenger_beta": {
            "name": "Beta",
            "type": "npc",
            "is_available": false,
            "description": "A sharp-eyed woman sorting through a pile of salvaged components. She moves with the confidence of someone who's survived the depot's dangers many times.",
            "is_merchant": true,
            "inventory": [{"item_id": "stimpack", "quantity": 1 }, { "item_id": "leather_armor", "quantity": 1 }],
            "dialogue_graph": {
                "start": {
                    "response": "Another survivor. Good. I'm Beta. I deal in survival gear and medical supplies. You'll need both if you plan on staying here long.",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "You're still here. Smart.",
                    "destination_nodes": [
                        { "node_id": "story_1", "prompt_replacement": "Tell me about the depot." },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "story_1": {
                    "prompt": "What's it like living here?",
                    "response": "Dangerous, but profitable. The old-world tech here is pristine - better than anything you'll find in the settlements. We've learned to work around the security systems. Just don't trigger the alarms.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "trade": {
                    "prompt": "Show me what you have.",
                    "response": "Take your pick. Everything here is top quality.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Anything else?" }
                    ]
                },
                "end": {
                    "prompt": "See you around.",
                    "response": "Watch your step. The depot has a way of surprising the unwary."
                }
            }
        },
        "tech_scavenger_gamma": {
            "name": "Gamma",
            "type": "npc",
            "is_available": false,
            "description": "A burly scavenger with cybernetic enhancements visible on his arms. He's examining a large piece of old-world machinery with intense focus.",
            "is_merchant": true,
            "inventory": [{"item_id": "military_goggles", "quantity": 1 }, { "item_id": "stimpack", "quantity": 1 }, { "item_id": "purified_water", "quantity": 1 }],
            "dialogue_graph": {
                "start": {
                    "response": "Huh. Made it past the gates. Not many do. I'm Gamma. I deal in high-end tech and enhancements. If you're looking for the good stuff, you've come to the right place.",
                    "destination_nodes": [
                        { "node_id": "story_1" },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "return": {
                    "response": "Back for more?",
                    "destination_nodes": [
                        { "node_id": "story_1", "prompt_replacement": "Tell me about yourself." },
                        { "node_id": "trade" },
                        { "node_id": "end" }
                    ]
                },
                "story_1": {
                    "prompt": "How long have you been here?",
                    "response": "Long enough to know every corner of this place. The depot's full of old-world wonders - power cores, cybernetic components, advanced electronics. Worth the risk if you know what you're doing.",
                    "destination_nodes": [
                        { "node_id": "end" }
                    ]
                },
                "trade": {
                    "prompt": "What do you have?",
                    "response": "The best tech the old world had to offer. Take a look.",
                    "destination_nodes": [
                        { "node_id": "return", "prompt_replacement": "Anything else?" }
                    ]
                },
                "end": {
                    "prompt": "I'll be on my way.",
                    "response": "Don't let the gates catch you off guard on the way out."
                }
            }
        }
    }
};

const QUEST_DATA = {
    "headroom": {
        "title": "Headroom",
        "description": "Warden Cole's relay node is offline. Slot a spare spool into the relay box by the generator shed to give the Quarter a bit more power headroom.",
        "location": "still_quarter",
        "giver": "warden_cole",
        "stages": {
            "0": "Not started",
            "1": "Take the spare spool to the relay box by the generator shed and slot it in.",
            "2": "Get back to Warden Cole",
            "100": "Completed"
        },
        "rewards": {
            "items": [],
            "stat_change": [
                { "stat": "xp", "value": 100 },
                { "stat": "caps", "value": 25 },
                { "stat": "reputation", "value": 5 }
            ]
        }
    },
    "glitch_in_the_system": {
        "title": "Glitch in the System",
        "description": "Zane, the technician in Neon Nexus, needs help resetting a failing power regulator by planting a data scrambler in the old service tunnels.",
        "location": "neon_nexus",
        "giver": "zane",
        "stages": {
            "0": "Not started",
            "1": "Go to the Nexus Old Tunnel and plant the data scrambler on the main power generator.",
            "2": "Return to Zane in the Neon Nexus.",
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
            "1": "Figure out what has happened",
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
            "1": "Clear out the lower tunnels.",
            "2": "Coninue the tunnels clearing",
            "3": "Get back to Rex",
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
            "1": "Show A strange amplifier token to Selene",
            "2": "Inspect Calm Initiative Wing",
            "3": "Ask Selene about The Forgotten Outpost",
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
        "description": "Whisper wants you to steal a ledger from Corvus.",
        "location": "rust_pit",
        "giver": "whisper",
        "stages": { 
            "0": "Not started", 
            "1": "Confront Corvus to get his ledger.", 
            "11": "You stole the ledger.", 
            "12": "You killed Corvus for the ledger.", 
            "13": "You sided with Corvus.", 
            "100": "Completed by giving Whisper the stolen ledger.", 
            "101": "Completed by giving Whisper the ledger from the dead Corvus.", 
            "102": "Betrayed Whisper and were attacked." 
        }
    },
    "house_cleaning": {
        "title": "House Cleaning",
        "description": "Valeria wants you to end the infighting between Whisper and Corvus, her way.",
        "location": "rust_pit",
        "giver": "boss_valeria",
        "stages": { 
            "0": "Not started", 
            "1": "Get the ledger from Corvus using the key Valeria provided.", 
            "2": "Eliminate Corvus.", 
            "3": "Lure and eliminate Whisper.", 
            "100": "Completed" 
        }
    }
};

const ITEMS_DATA = {
    // gears
    "leather_armor": { "name": "Leather Armor", "tradeable": true, "type": "gear", "stat_change": [{ "stat": "str", "value": 1 }], "price": 150 },
    "military_goggles": { "name": "Military Goggles", "tradeable": true, "type": "gear", "stat_change": [{ "stat": "int", "value": 1 }], "price": 120 },
    "bone_charm": { "name": "Bone Charm", "tradeable": false, "type": "gear", "stat_change": [{ "stat": "lck", "value": 1 }], "price": 0 },

    // consumables
    "stimpack": { "name": "Stimpack", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 25 }], "price": 50 },
    "purified_water": { "name": "Purified Water", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 10 }], "price": 20 },
    "mutfruit": { "name": "Mutfruit", "tradeable": true, "type": "consumable", "stat_change": [{ "stat": "hp", "value": 5 }], "price": 10 },
    
    // quest items
    "relay_spool": { "name": "Relay Spool", "tradeable": false, "type": "quest", "price": 0 },
    "gci_archive_fragment": { "name": "G.C.I. Archive Fragment", "tradeable": false, "type": "quest", "price": 0 },
    "amplifier_token": { "name": "Station Amplifier Token", "tradeable": false, "type": "quest", "price": 0 },
    "maintenance_route_map": { "name": "Maintenance Route Map (FO Node)", "tradeable": false, "type": "quest", "price": 0 },
    "charter_fragment": { "name": "Unfinished Charter Fragment", "tradeable": false, "type": "quest", "price": 0 },



    "signal_jammer": { "name": "Signal Jammer", "type": "quest", "tradeable": true, "price": 100 },
    "data_scrambler": { "name": "Data Scrambler", "tradeable": false, "type": "quest", "price": 0 },
    "glowing_pendant": { "name": "Glowing Pendant", "tradeable": false, "type": "quest", "price": 0 },
    "harmonic_resonator": { "name": "Harmonic Resonator", "tradeable": true, "type": "quest", "price": 100 },
    "heirloom_seed_packet": { "name": "Heirloom Seed Packet", "tradeable": false, "type": "quest", "price": 0 },
    // "cryo_coupler": { "name": "Cryo-Coupler", "tradeable": false, "type": "quest", "price": 0 },
    "geo_tongs": { "name": "Geo-Tongs", "tradeable": false, "type": "quest", "price": 0 },
    "shimmering_ore": { "name": "Shimmering Ore", "tradeable": false, "type": "quest", "price": 0 },
    "corvus_key": { "name": "Corvus's desk key", "tradeable": false, "type": "quest", "price": 0 },
    "corvus_ledger": { "name": "Corvus's Ledger", "tradeable": false, "type": "quest", "price": 0 },
    "whisper_ring": { "name": "Whisper's Ring", "tradeable": false, "type": "quest", "price": 0 },

    // junk
    // "scrap_metal": { "name": "Scrap Metal", "tradeable": true, "type": "junk", "price": 10 },
    // "energy_cell": { "name": "Energy Cell", "tradeable": true, "type": "junk", "price": 25 },

};

const ENEMIES_DATA = {
    "bat": {
        "name": "Bat",
        "lck": 4,
        "health": 4,
        "minDamage": 1,
        "maxDamage": 2,
        "xp": 50
    },
    "rat": {
        "name": "Rat",
        "lck": 3,
        "health": 10,
        "minDamage": 2,
        "maxDamage": 7,
        "xp": 100
    },
    "queen_rat": {
        "name": "Queen Rat",
        "lck": 5,
        "health": 15,
        "minDamage": 3,
        "maxDamage": 10,
        "xp": 200
    }
};

console.log('game.js: LOCATION_DATA', LOCATION_DATA);
console.log('game.js: NPC_DATA', NPC_DATA);
console.log('game.js: QUEST_DATA', QUEST_DATA);
console.log('game.js: ITEMS_DATA', ITEMS_DATA);