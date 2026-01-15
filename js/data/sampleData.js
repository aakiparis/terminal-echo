const LOCATION_DATA = {
    "aethelburg_sprawl": {
        "name": "Aethelburg Sprawl",
        "description": "A rain-slicked concrete canyon where flickering neon signs bleed into pools of rust and refuse. The air is thick with the smell of ozone and decay, a ghost city dreaming of a future that never was.",
        "npcs": ["cypher_jack", "sergeant_kail"]
    }
};

const NPC_DATA = {
    "aethelburg_sprawl": {
        "cypher_jack": {
            "name": "Cypher Jack",
            "description": "A man who seems to be in two places at once. One eye is a milky orb, the other a flickering cybernetic lens. He deals in information, the only currency that truly matters.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "nodes": {
                    "start_first_time": {
                        "text": "Another construct wandering the grid... You're either looking for a way out or a way deeper in. The code is the same for both. What do you see in the static?",
                        "options": [
                            {
                                "text": "I'm just trying to survive.",
                                "destination_node": "survival_path"
                            },
                            {
                                "text": "I'm looking for answers.",
                                "destination_node": "end_conversation"
                            }
                        ],
                        "outcomes": []
                    },
                    "survival_path": {
                        "text": "Survival is an illusion. A loop in the program. But I can show you the glitches, the backdoors. For a price, of course. Come back when you have something worth my time. Not caps. Information.",
                        "options": [
                            {
                                "text": "I'll keep that in mind.",
                                "destination_node": "end_conversation"
                            }
                        ],
                        "outcomes": []
                    }
                }
            }
        },
        "sergeant_kail": {
            "name": "Sergeant Kail",
            "description": "His face is a roadmap of scars, his armor a patchwork of pre-catastrophe riot gear and gleaming steel plates. He stands guard, a bulwark against the coming chaos.",
            "is_merchant": false,
            "inventory": [],
            "dialogue_graph": {
                "nodes": {
                    "start_first_time": {
                        "text": "Halt. This sector is under the Warden's protection. State your business or I'll make you state it to the crows. We have no time for shades and whispers here.",
                        "options": [
                            {
                                "text": "Just passing through.",
                                "destination_node": "passing_through"
                            },
                            {
                                "text": "Who is the Warden?",
                                "destination_node": "end_conversation"
                            }
                        ],
                        "outcomes": []
                    },
                    "passing_through": {
                        "text": "See that you do. The Sprawl has a way of swallowing the unwary. Stick to the lit paths. The shadows here have teeth, and they answer to powers older than this rust-heap city. Now, move along.",
                        "options": [
                            {
                                "text": "Right. Moving on.",
                                "destination_node": "end_conversation"
                            }
                        ],
                        "outcomes": []
                    }
                }
            }
        }
    }
};

const QUEST_DATA = {};
const ITEMS_DATA = {};