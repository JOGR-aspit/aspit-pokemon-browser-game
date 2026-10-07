# AspIT Pokémon browser game

This repository contains the instructor's working example for the Pokémon Browser Game Guided Build. Each numbered folder is a standalone snapshot of the website at one article stage.

| Stage | Guided Build article | Status |
| --- | --- | --- |
| [`01-landing-page-first-draft/`](01-landing-page-first-draft/) | Build the first landing-page draft | Complete |
| [`02-landing-page-refinement/`](02-landing-page-refinement/) | Landing page refinement | Complete |
| [`03-pokedex-catalog/`](03-pokedex-catalog/) | Build the Pokédex catalog | Complete |
| [`04-pokedex-filter/`](04-pokedex-filter/) | Filter the Pokédex with JavaScript | Complete |
| [`05-trainer-setup/`](05-trainer-setup/) | Start the game from trainer setup | Complete |
| [`06-overworld-map/`](06-overworld-map/) | Render the overworld map | Complete |
| [`07-trainer-position/`](07-trainer-position/) | Render the trainer position | Complete |
| [`08-map-movement/`](08-map-movement/) | Move one step | Complete |
| [`09-wild-encounters/`](09-wild-encounters/) | Enter a wild encounter | Complete |
| [`10-battle-loop/`](10-battle-loop/) | Build the battle loop | Complete |
| [`11-caught-collection/`](11-caught-collection/) | Complete the caught collection | Complete |

Open the `index.html` file inside the stage you want to inspect. A stage does not depend on files from another stage.

To begin a later stage, copy the complete preceding folder. Make new changes only in the new folder so earlier article checkpoints remain available.

## Stage 09 encounter tests

`09-wild-encounters/game.js` keeps the normal encounter chance at `25%`. Its `encounterTestMode` setting accepts `"normal"`, `"no-encounter"`, or `"known-encounter"`. The known mode uses Pokédex number `179` (Mareep, 30 starting hit points). Save a mode change, reload `game.html`, start a trainer, and move North once from the Center to test it. Start the trainer again for a second run. Restore `"normal"` and reload before leaving the stage. The percentage and species list stay unchanged in every mode.

## Stage 10 battle checks

`10-battle-loop/game.js` keeps the same encounter modes and species. Each Attack removes 8 wild hit points. A surviving wild Pokémon then removes 6 starter hit points. A Poké Ball succeeds at 12 wild hit points or fewer. Use known-encounter mode with Bounsweet (`761`) for an exact-zero defeat, Mareep (`179`) for a below-zero defeat, and Misdreavus (`200`) for a capture at exactly 12 hit points after two attacks. A Bounsweet capture after two attacks checks the below-threshold result. To check fainting, start a known Mareep encounter, set the starter's current hit points to `6` in DevTools, render, and Attack once. Restore normal encounter mode after testing.

A successful capture saves one `pendingCapture` identity before the encounter ends. A later capture replaces this interim record. The caught collection and its count remain unchanged in this stage. The next Guided Build stage will update and render the collection.

## Stage 11 collection checks

`11-caught-collection/game.js` records a caught species by Pokédex number and name. A first catch adds one record; a catch of another number adds a second; a repeated number ends the encounter with an already-recorded status but does not add an entry. The visible list and total render from `state.caughtPokemon`. The temporary `pendingCapture` state from Stage 10 is removed.

For a repeatable multi-species route, set `encounterTestMode` to `"known-encounter"`, save, and reload. `knownEncounterNumber` is a `let` setting in this stage so the DevTools Console can assign another allowed number without reloading or losing the current collection. Assign `knownEncounterNumber = 200` in DevTools Console before the first grass move, catch Misdreavus after two Attacks, return South to the Center, assign `knownEncounterNumber = 761`, enter grass North, and catch Bounsweet after two Attacks. Return South, assign `knownEncounterNumber = 200`, and catch Misdreavus again to verify the duplicate result. Restore `encounterTestMode` to `"normal"` and the known number to `179` in source, then reload. The normal encounter chance remains `25%`.

The complete in-page Reset control is not part of this stage. A valid new trainer submission clears the collection through the existing setup route.
