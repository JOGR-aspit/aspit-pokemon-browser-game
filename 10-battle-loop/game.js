"use strict";

const starterDefinitions = [
  {
    id: "snivy",
    name: "Snivy",
    type: "Grass",
    maximumHitPoints: 40,
  },
  {
    id: "fuecoco",
    name: "Fuecoco",
    type: "Fire",
    maximumHitPoints: 40,
  },
  {
    id: "totodile",
    name: "Totodile",
    type: "Water",
    maximumHitPoints: 40,
  },
];

const terrainDefinitions = [
  {
    id: "center",
    name: "Pokémon Center",
    symbol: "C",
  },
  {
    id: "path",
    name: "Path",
    symbol: "P",
  },
  {
    id: "grass",
    name: "Tall grass",
    symbol: "G",
  },
  {
    id: "blocked",
    name: "Blocked terrain",
    symbol: "X",
  },
];

const encounterChancePercent = 25;
const encounterTestMode = "normal"; // "normal", "no-encounter", or "known-encounter"
const knownEncounterNumber = 179;
const playerAttackDamage = 8;
const wildAttackDamage = 6;
const captureThreshold = 12;

const encounterDefinitions = [
  {
    number: 761,
    name: "Bounsweet",
    type: "Grass",
    maximumHitPoints: 24,
    image: "assets/bounsweet.png",
  },
  {
    number: 179,
    name: "Mareep",
    type: "Electric",
    maximumHitPoints: 30,
    image: "assets/mareep.png",
  },
  {
    number: 200,
    name: "Misdreavus",
    type: "Ghost",
    maximumHitPoints: 28,
    image: "assets/misdreavus.png",
  },
];

const startingPosition = {
  row: 2,
  column: 2,
};

const mapTiles = [
  { row: 0, column: 0, terrain: "blocked" },
  { row: 0, column: 1, terrain: "grass" },
  { row: 0, column: 2, terrain: "grass" },
  { row: 0, column: 3, terrain: "path" },
  { row: 0, column: 4, terrain: "blocked" },
  { row: 1, column: 0, terrain: "path" },
  { row: 1, column: 1, terrain: "path" },
  { row: 1, column: 2, terrain: "grass" },
  { row: 1, column: 3, terrain: "path" },
  { row: 1, column: 4, terrain: "grass" },
  { row: 2, column: 0, terrain: "grass" },
  { row: 2, column: 1, terrain: "path" },
  { row: 2, column: 2, terrain: "center" },
  { row: 2, column: 3, terrain: "path" },
  { row: 2, column: 4, terrain: "grass" },
  { row: 3, column: 0, terrain: "grass" },
  { row: 3, column: 1, terrain: "path" },
  { row: 3, column: 2, terrain: "path" },
  { row: 3, column: 3, terrain: "path" },
  { row: 3, column: 4, terrain: "grass" },
  { row: 4, column: 0, terrain: "blocked" },
  { row: 4, column: 1, terrain: "grass" },
  { row: 4, column: 2, terrain: "grass" },
  { row: 4, column: 3, terrain: "path" },
  { row: 4, column: 4, terrain: "blocked" },
];

const state = {
  trainerName: "",
  starter: null,
  mapPosition: null,
  activeEncounter: null,
  caughtPokemon: [],
  pendingCapture: null,
  statusMessage: "Enter a fictional trainer name and choose a starter.",
};

const trainerForm = document.querySelector("#trainer-form");
const trainerNameInput = document.querySelector("#trainer-name");
const trainerNameError = document.querySelector("#trainer-name-error");
const starterChoice = document.querySelector("#starter-choice");
const starterError = document.querySelector("#starter-error");
const trainerOutput = document.querySelector("#trainer-output");
const starterOutput = document.querySelector("#starter-output");
const hitPointsOutput = document.querySelector("#hit-points-output");
const positionOutput = document.querySelector("#position-output");
const encounterOutput = document.querySelector("#encounter-output");
const caughtOutput = document.querySelector("#caught-output");
const gameStatus = document.querySelector("#game-status");
const overworldMap = document.querySelector("#overworld-map");
const overworldSection = document.querySelector("#overworld-section");
const battleSection = document.querySelector("#battle-section");
const battleHeading = document.querySelector("#battle-heading");
const wildImage = document.querySelector("#wild-image");
const wildName = document.querySelector("#wild-name");
const wildHitPoints = document.querySelector("#wild-hit-points");
const battleStarter = document.querySelector("#battle-starter");
const attackButton = document.querySelector("#battle-attack");
const catchButton = document.querySelector("#battle-catch");
const runButton = document.querySelector("#battle-run");
const northButton = document.querySelector("#move-north");
const southButton = document.querySelector("#move-south");
const westButton = document.querySelector("#move-west");
const eastButton = document.querySelector("#move-east");

if (
  !trainerForm
  || !trainerNameInput
  || !trainerNameError
  || !starterChoice
  || !starterError
  || !trainerOutput
  || !starterOutput
  || !hitPointsOutput
  || !positionOutput
  || !encounterOutput
  || !caughtOutput
  || !gameStatus
  || !overworldMap
  || !overworldSection
  || !battleSection
  || !battleHeading
  || !wildImage
  || !wildName
  || !wildHitPoints
  || !battleStarter
  || !attackButton
  || !catchButton
  || !runButton
  || !northButton
  || !southButton
  || !westButton
  || !eastButton
) {
  throw new Error("Required game elements are missing.");
}

const movementButtons = [northButton, southButton, westButton, eastButton];
const battleButtons = [attackButton, catchButton, runButton];

function findStarterDefinition(starterId) {
  for (const starterDefinition of starterDefinitions) {
    if (starterDefinition.id === starterId) {
      return starterDefinition;
    }
  }

  return null;
}

function findTerrainDefinition(terrainId) {
  for (const terrainDefinition of terrainDefinitions) {
    if (terrainDefinition.id === terrainId) {
      return terrainDefinition;
    }
  }

  return null;
}

function findMapTile(row, column) {
  for (const mapTile of mapTiles) {
    if (mapTile.row === row && mapTile.column === column) {
      return mapTile;
    }
  }

  return null;
}

function chooseEncounterDefinition() {
  if (encounterTestMode === "no-encounter") {
    return null;
  }

  if (encounterTestMode === "known-encounter") {
    let knownDefinition = null;

    for (const definition of encounterDefinitions) {
      if (definition.number === knownEncounterNumber) {
        if (knownDefinition !== null) {
          throw new Error("Known encounter number matches more than one species.");
        }
        knownDefinition = definition;
      }
    }

    if (knownDefinition === null) {
      throw new Error("Known encounter number is absent from the encounter list.");
    }

    return knownDefinition;
  }

  if (encounterTestMode !== "normal") {
    throw new Error(`Unknown encounter test mode: ${encounterTestMode}`);
  }

  const chanceValue = Math.random();

  if (chanceValue >= encounterChancePercent / 100) {
    return null;
  }

  const selectionValue = Math.random();
  const encounterIndex = Math.floor(selectionValue * encounterDefinitions.length);
  return encounterDefinitions[encounterIndex];
}

function renderMap() {
  overworldMap.replaceChildren();

  for (const mapTile of mapTiles) {
    const terrainDefinition = findTerrainDefinition(mapTile.terrain);

    if (terrainDefinition === null) {
      throw new Error(`Unknown terrain: ${mapTile.terrain}`);
    }

    const trainerHere =
      state.mapPosition !== null
      && mapTile.row === state.mapPosition.row
      && mapTile.column === state.mapPosition.column;
    const tileElement = document.createElement("li");
    const visibleRow = mapTile.row + 1;
    const visibleColumn = mapTile.column + 1;
    const tileName =
      `Row ${visibleRow}, column ${visibleColumn}: ${terrainDefinition.name}.`;

    tileElement.setAttribute(
      "class",
      `map-tile map-tile--${mapTile.terrain}`,
    );
    tileElement.setAttribute("aria-label", tileName);
    tileElement.textContent = terrainDefinition.symbol;

    if (trainerHere) {
      tileElement.setAttribute("aria-label", `${tileName} Trainer here.`);
      const trainerImage = document.createElement("img");
      trainerImage.setAttribute("class", "trainer-sprite");
      trainerImage.setAttribute("src", "assets/trainer.png");
      trainerImage.setAttribute("alt", "");
      tileElement.append(trainerImage);
    }

    overworldMap.append(tileElement);
  }
}

function renderGame() {
  if (state.starter === null || state.mapPosition === null) {
    trainerOutput.textContent = "No trainer yet.";
    starterOutput.textContent = "No starter selected.";
    hitPointsOutput.textContent = "Not available.";
    positionOutput.textContent = "Not set.";
  } else {
    trainerOutput.textContent = state.trainerName;
    starterOutput.textContent = `${state.starter.name} — ${state.starter.type}`;
    hitPointsOutput.textContent =
      `${state.starter.currentHitPoints} of ${state.starter.maximumHitPoints}`;

    const currentTile = findMapTile(
      state.mapPosition.row,
      state.mapPosition.column,
    );

    if (currentTile === null) {
      throw new Error(
        `No map tile at row ${state.mapPosition.row}, column ${state.mapPosition.column}.`,
      );
    }

    const currentTerrain = findTerrainDefinition(currentTile.terrain);

    if (currentTerrain === null) {
      throw new Error(`Unknown terrain: ${currentTile.terrain}`);
    }

    const visibleRow = state.mapPosition.row + 1;
    const visibleColumn = state.mapPosition.column + 1;

    positionOutput.textContent =
      `${currentTerrain.name} — row ${visibleRow}, column ${visibleColumn}`;
  }

  if (state.activeEncounter === null) {
    encounterOutput.textContent = "No active encounter.";
  } else {
    encounterOutput.textContent = state.activeEncounter.name;
  }

  overworldSection.hidden = state.activeEncounter !== null;
  battleSection.hidden = state.activeEncounter === null;

  if (state.activeEncounter !== null) {
    wildImage.setAttribute("src", state.activeEncounter.image);
    wildImage.setAttribute("alt", state.activeEncounter.name);
    wildName.textContent = `${state.activeEncounter.name} — ${state.activeEncounter.type}`;
    wildHitPoints.textContent =
      `${state.activeEncounter.currentHitPoints} of ${state.activeEncounter.maximumHitPoints}`;
    battleStarter.textContent =
      `${state.starter.name}: ${state.starter.currentHitPoints} of ${state.starter.maximumHitPoints} hit points`;
  }

  caughtOutput.textContent = `${state.caughtPokemon.length}`;
  gameStatus.textContent = state.statusMessage;
  renderMap();

  const canMove = state.mapPosition !== null && state.activeEncounter === null;

  for (const movementButton of movementButtons) {
    if (canMove) {
      movementButton.removeAttribute("disabled");
    } else {
      movementButton.setAttribute("disabled", "");
    }
  }

  for (const battleButton of battleButtons) {
    if (state.activeEncounter === null) {
      battleButton.setAttribute("disabled", "");
    } else {
      battleButton.removeAttribute("disabled");
    }
  }
}

function handleTrainerSubmit(event) {
  event.preventDefault();

  trainerNameInput.removeAttribute("aria-invalid");
  starterChoice.removeAttribute("aria-invalid");
  trainerNameError.textContent = "";
  starterError.textContent = "";

  const trainerName = trainerNameInput.value.trim();
  const starterId = starterChoice.value;

  if (trainerName === "") {
    trainerNameInput.setAttribute("aria-invalid", "true");
    trainerNameError.textContent = "Enter a fictional trainer name.";
    trainerNameInput.focus();
    return;
  }

  if (starterId === "") {
    starterChoice.setAttribute("aria-invalid", "true");
    starterError.textContent = "Choose a starter Pokémon.";
    starterChoice.focus();
    return;
  }

  const starterDefinition = findStarterDefinition(starterId);

  if (starterDefinition === null) {
    starterChoice.setAttribute("aria-invalid", "true");
    starterError.textContent = "Choose a listed starter Pokémon.";
    starterChoice.focus();
    return;
  }

  state.trainerName = trainerName;
  state.starter = {
    id: starterDefinition.id,
    name: starterDefinition.name,
    type: starterDefinition.type,
    currentHitPoints: starterDefinition.maximumHitPoints,
    maximumHitPoints: starterDefinition.maximumHitPoints,
  };
  state.mapPosition = {
    row: startingPosition.row,
    column: startingPosition.column,
  };
  state.activeEncounter = null;
  state.caughtPokemon = [];
  state.pendingCapture = null;
  state.statusMessage =
    `${trainerName} and ${starterDefinition.name} are ready to explore.`;

  renderGame();
  northButton.focus();
}

function moveTrainer(direction, rowChange, columnChange) {
  if (state.mapPosition === null || state.activeEncounter !== null) {
    return;
  }

  const proposedRow = state.mapPosition.row + rowChange;
  const proposedColumn = state.mapPosition.column + columnChange;
  const destination = findMapTile(proposedRow, proposedColumn);

  if (destination === null) {
    state.statusMessage = `Cannot move ${direction}: outside the map.`;
    renderGame();
    return;
  }

  if (destination.terrain === "blocked") {
    state.statusMessage = `Cannot move ${direction}: blocked terrain.`;
    renderGame();
    return;
  }

  state.mapPosition = { row: proposedRow, column: proposedColumn };
  const terrain = findTerrainDefinition(destination.terrain);

  if (terrain === null) {
    throw new Error(`Unknown terrain: ${destination.terrain}`);
  }

  if (destination.terrain === "center") {
    const neededHealing =
      state.starter.currentHitPoints < state.starter.maximumHitPoints;
    state.starter.currentHitPoints = state.starter.maximumHitPoints;
    if (neededHealing) {
      state.statusMessage =
        `${state.starter.name} was healed at the Pokémon Center.`;
    } else {
      state.statusMessage =
        `${state.starter.name} is already at full hit points.`;
    }
  } else if (destination.terrain === "grass") {
    const definition = chooseEncounterDefinition();

    if (definition === null) {
      state.statusMessage =
        `Moved ${direction} to tall grass (row ${proposedRow + 1}, column ${proposedColumn + 1}). No wild encounter.`;
    } else {
      state.activeEncounter = {
        number: definition.number,
        name: definition.name,
        type: definition.type,
        image: definition.image,
        currentHitPoints: definition.maximumHitPoints,
        maximumHitPoints: definition.maximumHitPoints,
      };
      state.statusMessage = `A wild ${definition.name} appeared!`;
    }
  } else {
    state.statusMessage =
      `Moved ${direction} to ${terrain.name} (row ${proposedRow + 1}, column ${proposedColumn + 1}).`;
  }

  renderGame();

  if (state.activeEncounter !== null) {
    battleHeading.focus();
  }
}

function handleNorthClick() {
  moveTrainer("north", -1, 0);
}

function handleSouthClick() {
  moveTrainer("south", 1, 0);
}

function handleWestClick() {
  moveTrainer("west", 0, -1);
}

function handleEastClick() {
  moveTrainer("east", 0, 1);
}

function finishBattle(message) {
  state.activeEncounter = null;
  state.statusMessage = message;
  renderGame();
  northButton.focus();
}

function handleAttackClick() {
  if (state.activeEncounter === null) {
    return;
  }

  const wildPokemon = state.activeEncounter;
  wildPokemon.currentHitPoints -= playerAttackDamage;

  if (wildPokemon.currentHitPoints < 0) {
    wildPokemon.currentHitPoints = 0;
  }

  if (wildPokemon.currentHitPoints === 0) {
    finishBattle(`${wildPokemon.name} reached 0 hit points. You won the battle.`);
    return;
  }

  state.starter.currentHitPoints -= wildAttackDamage;

  if (state.starter.currentHitPoints <= 0) {
    state.mapPosition = {
      row: startingPosition.row,
      column: startingPosition.column,
    };
    state.starter.currentHitPoints = state.starter.maximumHitPoints;
    finishBattle(`${state.starter.name} fainted after ${wildPokemon.name} responded. You returned to the Pokémon Center, and ${state.starter.name} was healed.`);
    return;
  }

  state.statusMessage =
    `${state.starter.name} attacked ${wildPokemon.name}. ${wildPokemon.name} has ${wildPokemon.currentHitPoints} hit points. ${wildPokemon.name} responded. ${state.starter.name} has ${state.starter.currentHitPoints} hit points.`;
  renderGame();
  attackButton.focus();
}

function handleCatchClick() {
  if (state.activeEncounter === null) {
    return;
  }

  const wildPokemon = state.activeEncounter;

  if (wildPokemon.currentHitPoints > captureThreshold) {
    state.statusMessage =
      `${wildPokemon.name} has ${wildPokemon.currentHitPoints} hit points. Lower it to ${captureThreshold} or less before throwing a Poké Ball.`;
    renderGame();
    catchButton.focus();
    return;
  }

  state.pendingCapture = {
    number: wildPokemon.number,
    name: wildPokemon.name,
  };
  finishBattle(`Caught ${wildPokemon.name}. The collection is added in the next stage.`);
}

function handleRunClick() {
  if (state.activeEncounter === null) {
    return;
  }

  const wildPokemon = state.activeEncounter;
  finishBattle(`You ran from ${wildPokemon.name}.`);
}

trainerForm.addEventListener("submit", handleTrainerSubmit);
northButton.addEventListener("click", handleNorthClick);
southButton.addEventListener("click", handleSouthClick);
westButton.addEventListener("click", handleWestClick);
eastButton.addEventListener("click", handleEastClick);
attackButton.addEventListener("click", handleAttackClick);
catchButton.addEventListener("click", handleCatchClick);
runButton.addEventListener("click", handleRunClick);

renderGame();
