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

const startingPosition = {
  row: 2,
  column: 2,
};

const state = {
  trainerName: "",
  starter: null,
  mapPosition: null,
  activeEncounter: null,
  caughtPokemon: [],
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
) {
  throw new Error("Required trainer setup elements are missing.");
}

function findStarterDefinition(starterId) {
  for (const starterDefinition of starterDefinitions) {
    if (starterDefinition.id === starterId) {
      return starterDefinition;
    }
  }

  return null;
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

    const visibleRow = state.mapPosition.row + 1;
    const visibleColumn = state.mapPosition.column + 1;

    positionOutput.textContent =
      `Pokémon Center — row ${visibleRow}, column ${visibleColumn}`;
  }

  if (state.activeEncounter === null) {
    encounterOutput.textContent = "No active encounter.";
  } else {
    encounterOutput.textContent = state.activeEncounter.name;
  }

  caughtOutput.textContent = `${state.caughtPokemon.length}`;
  gameStatus.textContent = state.statusMessage;
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
  state.statusMessage =
    `${trainerName} and ${starterDefinition.name} are ready to explore.`;

  renderGame();
}

trainerForm.addEventListener("submit", handleTrainerSubmit);

renderGame();
