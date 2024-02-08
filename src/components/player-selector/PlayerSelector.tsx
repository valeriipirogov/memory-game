import { useState } from "react";

interface PlayerSelectorProps {
  startGame: (nrOfPlayers: number) => void;
}

const PlayerSelector = (props: PlayerSelectorProps) => {
  const { startGame } = props;
  const [nrOfPlayers, setNrOfPlayers] = useState<number>(1);

  const startGameClickHandler = () => {
    startGame(nrOfPlayers);
  };

  return (
    <div>
      <h1>Please, select number of players!</h1>
      <div>
        <input
          id="onePlayer"
          type="radio"
          name="player"
          defaultChecked={nrOfPlayers === 1}
          onClick={() => setNrOfPlayers(1)}
        />
        <label htmlFor="onePlayer">1 Player</label>
        <input
          id="twoPlayer"
          type="radio"
          name="player"
          defaultChecked={nrOfPlayers === 2}
          onClick={() => setNrOfPlayers(2)}
        />
        <label htmlFor="twoPlayer">2 Players</label>
      </div>
      <div>
        <button id="startGame" onClick={startGameClickHandler}>
          Start the game
        </button>
      </div>
    </div>
  );
};

export default PlayerSelector;
