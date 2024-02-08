interface PlayerScoreProps {
  player: number;
  scoreValue: number;
}

const PlayerScore = (props: PlayerScoreProps) => {
  const { player, scoreValue } = props;
  return (
    <div>
      <div>Player: {player}</div>
      <div>Score: {scoreValue}</div>
    </div>
  );
};

export default PlayerScore;
