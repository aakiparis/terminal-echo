// ===============================
// LOCATION
// ===============================
const LOCATION_DATA = {
  "the_forgotten_outpost": {
    "name": "The Forgotten Outpost",
    "description": "A settlement built on pure willpower—an attempt to pull scattered villages into a shared centre.<br><br>Half-finished trade standards hang beside a dead comms mast. Instead of seeing a crowded place, you spot just a few people around.",
    "npcs": ["elder_kian", "silas", "lena", "charter_wall"]
  }
};

// ===============================
// NPCs
// ===============================
const NPC_DATA = {
  "the_forgotten_outpost": {
    // -----------------------------------
    // KIAN — Story A: archive of a failed future
    // -----------------------------------
    "elder_kian": {
      "name": "Elder Kian",
      "type": "npc",
      "is_available": true,
      "description": "An old tinker with calm eyes and a posture that says he once carried heavier things. He speaks like a historian who learned to stop persuading.",
      "is_merchant": false,
      "inventory": [],
      "dialogue_graph": {
        "start": {
          "response": "You have that look. The one that doesn’t stop connecting dots. I used to have it all the time. Now I have it only when my joints let me.",
          "destination_nodes": [
            { "node_id": "kian_story_look_1" },
            { "node_id": "kian_story_three_1" },
            { "node_id": "kian_story_cgi_1" },
            { "node_id": "kian_story_failure_1" },
            { "node_id": "kian_story_rustpit_1" },
            { "node_id": "kian_story_techdepot_1" },
            { "node_id": "end" }
          ]
        },

        "return": {
          "response": "....",
          "destination_nodes": [
            // Guardrail #1: perpetual story access
            { "node_id": "kian_story_look_1", "prompt_replacement": "Tell me what this place was meant to be." },
            { "node_id": "kian_story_three_1", "prompt_replacement": "You said there were three of you. Who were they?" },

            // Explicit attenuation truth line
            { "node_id": "kian_story_cgi_1", "prompt_replacement": "Tell me the real story of CGI and the medicine." },

            // Failure as opt-out
            { "node_id": "kian_story_failure_1", "prompt_replacement": "Why did the federation attempt fail?" },

            // Forward pointers
            { "node_id": "kian_story_rustpit_1", "prompt_replacement": "You mentioned Rust Pit." },
            { "node_id": "kian_story_techdepot_1", "prompt_replacement": "You mentioned a Tech Depot." },

            { "node_id": "end" }
          ]
        },

        "kian_story_look_1": {
          "prompt": "What is this place?",
          "response": "A junction that tried to become a centre. It wasn’t self-sufficient. It existed because people chose to carry something bigger than themselves—trade routes, standards, comms. Then they got tired.",
          "destination_nodes": [
            { "node_id": "kian_story_look_2" }
          ]
        },
        "kian_story_look_2": {
          "prompt": "Why would they get tired of something that important?",
          "response": "Because importance doesn’t feed you by itself. Systems are hungry. They require attendance. And attendance is the first thing the world learned to stop offering.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Alright. Another question." }
          ]
        },

        // --- The three-tinker triangle
        "kian_story_three_1": {
          "prompt": "How this place was established",
          "response": "There were three of us. Three minds that could hold a system without panicking.",
          "destination_nodes": [
            { "node_id": "kian_story_three_2" }
          ]
        },
        "kian_story_three_2": {
          "prompt": "Who were they?",
          "response": "I was the historian—evidence, timelines, cause and effect. I explained what happened when everyone else said ‘it doesn’t matter.’",
          "destination_nodes": [
            { "node_id": "kian_story_three_3" }
          ]
        },
        "kian_story_three_3": {
          "prompt": "And the other two?",
          "response": "One was an organizer—pure logistics. Could turn ten people into a schedule, and schedules into a machine.<br><br>The third wanted refuge. Not for everyone. Just for those who could still carry complexity without needing applause.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Go on." }
          ]
        },

        // --- CGI / drug explanation
        "kian_story_cgi_1": {
          "prompt": "What exactly happened to people?",
          "response": "Roughly a century ago, CGI—the Global Calm Initiative—released a medicine. A good one. A merciful one.",
          "destination_nodes": [
            { "node_id": "kian_story_cgi_2" }
          ]
        },
        "kian_story_cgi_2": {
          "prompt": "What was it called?",
          "response": "In the records: <b>Aequiline</b>. The public name was <b>Calmine</b>. Calm as a service.",
          "destination_nodes": [
            { "node_id": "kian_story_cgi_3" }
          ]
        },
        "kian_story_cgi_3": {
          "prompt": "And the side effect?",
          "response": "Subtle at first. People stopped volunteering for anything that didn’t touch them directly. Then we realized it wasn’t a side effect. It was the mechanism.",
          "destination_nodes": [
            { "node_id": "kian_story_cgi_4" }
          ]
        },
        "kian_story_cgi_4": {
          "prompt": "How did it spread?",
          "response": "Aequiline didn’t just settle nerves. It altered expression. Then it mutated. Then it spread—beyond clinics, beyond dosing, beyond consent.<br><br>It took it <b>four years</b> to go global and sink into the DNA layer deep enough that it became inheritance.",
          "destination_nodes": [
            { "node_id": "kian_story_cgi_5" }
          ]
        },
        "kian_story_cgi_5": {
          "prompt": "So we’re changed… on purpose?",
          "response": "On purpose—noble intent. Uncontrolled outcome. Since then, almost three generations have lived in the softened world.<br><br>And yes—there were always resistants. People who stayed sharp. We weren’t heroes. We were friction.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "That’s… a lot." }
          ]
        },

        // --- Failure as opt-out + critical mass
        "kian_story_failure_1": {
          "prompt": "Why did this federation fail?",
          "response": "Thirty years ago, this was the moment. Route maps. Standards. The beginning of a federation.",
          "destination_nodes": [
            { "node_id": "kian_story_failure_2" }
          ]
        },
        "kian_story_failure_2": {
          "prompt": "So what went wrong?",
          "response": "We did not reach critical mass. Too few tinkers. Too few minds willing to keep showing up when it got boring.<br><br>No sabotage. No betrayal. Just opt-out.",
          "destination_nodes": [
            { "node_id": "kian_story_manual_1" }
          ]
        },

        // --- Manual CGI entries reveal
        "kian_story_manual_1": {
          "prompt": "The CGI records… those manual entries. Who wrote them?",
          "response": "Ah,.. that is how you came across The Forgotten Outpost. That was me. I found CGI Central. It was sealed, but sealing is only a wall if someone cares to keep it a wall.<br><br>I wrote those records so a mind like yours might find the thread again.",
          "destination_nodes": [
            { "node_id": "kian_story_moral_1" }
          ]
        },

        // --- His moral stance now
        "kian_story_moral_1": {
          "prompt": "And you still believe the world should reunify?",
          "response": "You’re young, so you’ll treat calm like theft. I did too. But I’ve watched people live gentler lives because they stopped chasing horizons.<br><br>Progress isn’t a moral good. It’s a cost. The question is who pays it.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "I need to think." }
          ]
        },

        // --- Rust Pit pointer
        "kian_story_rustpit_1": {
          "prompt": "What happened to the organizer?",
          "response": "He left. Went to a place called <b>Rust Pit</b>. At first he built order. Then order became control. Control became authority.",
          "destination_nodes": [
            { "node_id": "kian_story_rustpit_2" }
          ]
        },
        "kian_story_rustpit_2": {
          "prompt": "Why would he change?",
          "response": "Because if you can’t get voluntary maintenance, you start dreaming of mandatory maintenance. Surrounded by weak will, even good math grows teeth.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "That explains a lot." }
          ]
        },

        // --- Tech Depot pointer
        "kian_story_techdepot_1": {
          "prompt": "And the one who wanted refuge?",
          "response": "He left too. People call it the <b>Tech Depot</b> now. They only let in people like us. There’s an entry test, I’m told.",
          "destination_nodes": [
            { "node_id": "kian_story_techdepot_2" }
          ]
        },
        "kian_story_techdepot_2": {
          "prompt": "Do you know where it is?",
          "response": "No. That was the point. Privacy as stability. A gated calm for the capable.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Alright." }
          ]
        },

        "end": {
          "prompt": "I’ll let you rest.",
          "response": "Rest is what’s left when you stop trying to move the world."
        }
      }
    },

    // -----------------------------------
    // SILAS — Story B: order as mercy
    // -----------------------------------
    "silas": {
      "name": "Silas",
      "type": "npc",
      "is_available": true,
      "description": "A hard-eyed guard with an air of permanent authority. He treats uncertainty like a threat he can arrest.",
      "is_merchant": false,
      "inventory": [],
      "dialogue_graph": {
        "start": {
          "response": "State your business. This outpost stays quiet because I keep it quiet.",
          "destination_nodes": [
            { "node_id": "silas_story_1" },
            { "node_id": "quest_scout_intro" },
            { "node_id": "end" }
          ]
        },

        "return": {
          "response": "You again. Don’t bring me theories. Bring results.",
          "destination_nodes": [
            { "node_id": "silas_story_1", "prompt_replacement": "Tell me what you’re protecting here." },
            { "node_id": "silas_philosophy_1" },

            // Keep hound den quest as-is
            { "node_id": "quest_scout_intro" },
            { "node_id": "quest_scout_reminder" },
            { "node_id": "quest_scout_completion" },
            { "node_id": "quest_scout_dogs_side" },

            { "node_id": "end" }
          ]
        },

        "silas_story_1": {
          "prompt": "What are you guarding against?",
          "response": "Everything. Raiders, beasts, panic. Curiosity. People forget panic is contagious. I don’t.",
          "destination_nodes": [
            { "node_id": "silas_philosophy_1" }
          ]
        },

        "silas_philosophy_1": {
          "prompt": "You talk like change is the enemy.",
          "response": "Change is how problems get invited. People want calm. I give it to them. They don’t need to understand the machinery of the world—just whether it keeps them safe.",
          "destination_nodes": [
            { "node_id": "silas_philosophy_2" }
          ]
        },

        "silas_philosophy_2": {
          "prompt": "What if calm is just slow failure?",
          "response": "Failure is preferable to chaos. If everyone plans, no one agrees. If one person plans, at least something gets done.",
          "destination_nodes": [
            { "node_id": "silas_lineage_hint" },
            { "node_id": "return", "prompt_replacement": "Let’s talk about the hounds." }
          ]
        },

        "silas_lineage_hint": {
          "prompt": "Where did you learn to talk like that?",
          "response": "My father believed discipline is mercy. People hate it, then they survive because of it.<br><br>He used to say: ‘If you can’t get voluntary maintenance, you get mandatory maintenance.’",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Alright." }
          ]
        },

        // -------------------------------
        // HOUND DEN QUEST — unchanged (copied from your current data)
        // -------------------------------
        "quest_scout_intro": {
          "conditions": {
            "condition": [
              { "type": "QUEST_STAGE", "quest_id": "clearing_the_path", "stage": 0 }
            ]
          },
          "prompt": "Looks like you could use an extra gun.",
          "response": "Maybe. There's a pack of mutated hounds that have gotten too close to the spire. They're getting bold. I need someone to clear their den to the east. Make them think twice about coming back.",
          "destination_nodes": [
            { "node_id": "quest_scout_accept" },
            { "node_id": "quest_scout_reject" }
          ]
        },

        "quest_scout_accept": {
          "prompt": "I'll take care of it.",
          "response": "Good. Less work for me. Don't die.",
          "outcomes": [
            { "type": "LOCATION_UNLOCK", "location_id": "hound_den" },
            { "type": "QUEST_SET_STAGE", "quest_id": "clearing_the_path", "stage": 1 }
          ],
          "destination_nodes": [
            { "node_id": "end" }
          ]
        },

        "quest_scout_reject": {
          "prompt": "Not my fight.",
          "response": "Figures. More work for me, then.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Another time." }
          ]
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
            { "node_id": "end", "prompt_replacement": "Give me a little more time." }
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
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Done." }
          ]
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
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Alright." }
          ]
        },

        "end": {
          "prompt": "I’m done here.",
          "response": "Keep it that way."
        }
      }
    },

    // -----------------------------------
    // LENA — Story C: small futures
    // -----------------------------------
    "lena": {
      "name": "Lena",
      "type": "npc",
      "is_available": true,
      "description": "A doctor with grease-stained sleeves and steady hands. She practices a kind of future that fits in a room.",
      "is_merchant": true,
      "inventory": [
        { "item_id": "stimpack", "quantity": 2 },
        { "item_id": "purified_water", "quantity": 2 },
        { "item_id": "mutfruit", "quantity": 1 }
      ],
      "dialogue_graph": {
        "start": {
          "response": "If you’re bleeding, sit. If you’re not, don’t waste my antiseptic.",
          "destination_nodes": [
            { "node_id": "lena_story_outpost_1" },
            { "node_id": "lena_story_kian_1" },
            { "node_id": "quest_seed_intro" },
            { "node_id": "trade" },
            { "node_id": "end" }
          ]
        },

        "return": {
          "response": "Back again? Don’t tell me you found a new way to get hurt.",
          "destination_nodes": [
            { "node_id": "lena_story_outpost_1", "prompt_replacement": "What was the Outpost supposed to be?" },
            { "node_id": "lena_story_kian_1", "prompt_replacement": "What do you think about Kian?" },

            // Keep Seeds quest as-is
            { "node_id": "quest_seed_intro" },
            { "node_id": "quest_seed_failed" },
            { "node_id": "quest_seed_completion" },

            { "node_id": "trade" },
            { "node_id": "end" }
          ]
        },

        "trade": {
          "prompt": "Show me what you have.",
          "response": "Fresh and clean. That’s the closest thing to a miracle we still manufacture.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "About something else…" }
          ]
        },

        "lena_story_outpost_1": {
          "prompt": "This place feels… unfinished.",
          "response": "It tried to be a junction again. It almost worked. Then people stopped coming to meetings.",
          "destination_nodes": [
            { "node_id": "lena_story_outpost_2" }
          ]
        },
        "lena_story_outpost_2": {
          "prompt": "And you stayed.",
          "response": "Because winter still comes. Keeping people alive is a future you can actually maintain. A federation is a beautiful idea. But you can’t eat an idea.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Fair." }
          ]
        },

        "lena_story_kian_1": {
          "prompt": "What do you think about Kian?",
          "response": "Kian remembers everything. That’s his gift and his wound. He thinks in decades. Most people here think in weeks. That mismatch breaks hearts.",
          "destination_nodes": [
            { "node_id": "lena_story_kian_2" }
          ]
        },
        "lena_story_kian_2": {
          "prompt": "He thinks progress isn’t always good.",
          "response": "He’s just exhausted old man.<br><br>If you want big systems, show me the maintenance plan that survives boredom. Don’t sell people a future you can’t personally keep alive.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Point taken." }
          ]
        },

        // -------------------------------
        // SEED VAULT QUEST — unchanged (copied from your current data)
        // -------------------------------
        "quest_seed_intro": {
          "conditions": {
            "condition": [
              { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 0 }
            ]
          },
          "prompt": "Is there anything I can help with?",
          "response": "Actually, yes! Our seed bank is almost depleted. I've heard stories of a pre-war 'Global Seed Vault' not far from here. If you could find a 'Heirloom Seed Packet' from there, it could secure our future for generations!",
          "destination_nodes": [
            // You plan for generations! You are not the same as all other, right?
            { "node_id": "quest_seed_accept" },
            { "node_id": "quest_seed_reject" }
          ]
        },

        "quest_seed_accept": {
          "prompt": "I'll look for this seed vault.",
          "response": "Oh, thank you! That's wonderful! Be careful, those old vaults are often automated and... grumpy.",
          "outcomes": [
            { "type": "LOCATION_UNLOCK", "location_id": "global_seed_vault" },
            { "type": "QUEST_SET_STAGE", "quest_id": "seeds_of_hope", "stage": 1 }
          ],
          "destination_nodes": [
            { "node_id": "end" }
          ]
        },

        "quest_seed_reject": {
          "prompt": "I'm not a farmer.",
          "response": "Oh. Okay. I understand. Well, the offer stands if you change your mind.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Maybe later." }
          ]
        },

        "quest_seed_failed": {
          "conditions": {
            "condition": [
              { "type": "QUEST_STAGE", "quest_id": "seeds_of_hope", "stage": 99 }
            ]
          },
          "prompt": "I got to the vault, but haven't managed to get in.",
          "response": "Ah, what a shame. I knew it is not a easy task. Anyway, thanks for trying.",
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Alright." }
          ]
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
          "destination_nodes": [
            { "node_id": "return", "prompt_replacement": "Glad I could help." }
          ]
        },

        "end": {
          "prompt": "I’ll go.",
          "response": "Try not to bleed."
        }
      }
    },

    // -----------------------------------
    // Environmental devices (set pieces)
    // -----------------------------------
    "charter_wall": {
      "name": "Charter Wall",
      "type": "device",
      "is_available": true,
      "description": "A wall layered with drafts of federation rules, simplified again and again.",
      "is_merchant": false,
      "inventory": [],
      "dialogue_graph": {
        "start": {
          "response": "[ Papers and stenciled boards overlap like geology. Early drafts are dense: rotas, measures, dispute protocols, shared repair obligations.<br><br>Later drafts get shorter. Softer. More optional.<br><br>The last sheet is almost blank:<br><i>\"Be kind.\"</i><br><i>\"Trade fairly.\"</i><br><i>\"Don’t ask too much.\"</i> ]",
          "destination_nodes": [
            { "node_id": "end" }
          ]
        },
        "return": {
          "response": "[ The wall is what a system looks like when the will to maintain it evaporates. ]",
          "destination_nodes": [
            { "node_id": "end" }
          ]
        },
        "end": {
          "prompt": "[Step away]",
          "response": "[ The Outpost wind flutters the dead future. ]"
        }
      }
    }
  }
};