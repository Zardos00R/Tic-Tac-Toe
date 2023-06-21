import View from "./view.js";
import Store from "./store.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "yellow",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "turquoise",
  },
];

// window.addEventListener("load", App.init);

function init() {
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  function initView() {
    view.closeAll();
    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreboard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
    view.initializeMove(store.game.moves);
  }

  window.addEventListener("storage", () => {
    initView();
  });
  initView();

  view.bindGameResetEvent((event) => {
    store.reset();

    initView();
  });
  view.bingNewRoundEvent((event) => {
    store.newRound();
    initView();
  });
  view.bindPlayerMoveEvent((square) => {
    const clickedSquare = square.target;

    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    // Place an icon of the current player in square
    view.handlePlayerMove(square, store.game.currentPlayer);
    // Advance to the next state byh pushing a move to the move arrays
    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie!"
      );

      return;
    }

    // Set the next player's turn indicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
