import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";
import { fetchCatsImages } from "./api/catsApi";
import PlayerSelector from "./components/player-selector/PlayerSelector";
import CardComponent from "./components/card/CardComponent";
import { Score } from "./model/Score";
import { Card } from "./model/Card";
import PlayerScore from "./components/player-score/PlayerScore";

const NUM_CARDS = 24;

const App: React.FC = () => {
  const [nrOfPlayers, setNrOfPlayers] = useState<number>();
  const [cards, setCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState<number>(1);
  const [playerScore, setPlayerScore] = useState<Score[]>([]);
  const [images, setImages] = useState<string[]>();

  const headerMessage = useMemo(
    () =>
      cards.length === matchedCards.length || !nrOfPlayers || nrOfPlayers === 1
        ? "Memory Game"
        : `Memory Game - Player ${playerTurn}'s Turn`,
    [cards.length, matchedCards.length, nrOfPlayers, playerTurn]
  );

  const theWinnerMessage = useMemo(() => {
    if (playerScore.length === 0 || nrOfPlayers === 1) {
      return;
    }
    const maxScore = playerScore
      .map((p) => p.scoreValue)
      .reduce((a, b) => Math.max(a, b));
    const winners = playerScore
      .filter((p) => p.scoreValue === maxScore)
      .map((p) => p.player);
    if (winners.length === playerScore.length) {
      return "This is the draw!";
    }
    return `The winner${winners.length === 1 ? " is" : "s are"} player${
      winners.length === 1 ? "" : "s"
    } ${winners.join(", ")}`;
  }, [nrOfPlayers, playerScore]);

  const shuffle = (array: Card[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const changeThePlayer = useCallback(() => {
    if (nrOfPlayers && nrOfPlayers > 1) {
      setPlayerTurn((previous) =>
        previous + 1 > nrOfPlayers ? 1 : previous + 1
      );
    }
  }, [nrOfPlayers]);

  const cardClickHandler = useCallback(
    (id: number) => {
      if (!nrOfPlayers) {
        return;
      }
      const flippedCards = cards.filter((c) => c.flipped);

      if (flippedCards.length == 2 || flippedCards.some((c) => c.id === id)) {
        return;
      }

      setCards((previous) =>
        previous.map((c) => (c.id === id ? { ...c, flipped: true } : c))
      );
    },
    [cards, nrOfPlayers]
  );

  const isMatchedCard = useCallback(
    (cardId: number) => {
      return matchedCards.includes(cardId);
    },
    [matchedCards]
  );

  const fetchImages = async () => {
    const buffer: string[] = [];
    for (let i = 0; i < Math.ceil(NUM_CARDS / 20); i++) {
      try {
        const data = await fetchCatsImages(Math.min(NUM_CARDS / 2, 10), i);
        data
          .map((item: { url: string }) => item.url)
          .forEach((element: string) => buffer.push(element));
      } catch (error) {
        setImages([]);
        return;
      }
    }
    setImages(buffer);
  };

  const createCards = useCallback(() => {
    if (images) {
      const newCards: Card[] = [];

      for (let i = 0; i < NUM_CARDS; i++) {
        const index = Math.floor(i / 2);
        newCards.push({
          id: i,
          image: images[index],
          value: index,
          flipped: false,
        });
      }
      setCards(shuffle(newCards));
    }
  }, [images]);

  const createPlayers = useCallback(() => {
    if (nrOfPlayers === 2) {
      setPlayerScore(
        Array.from({ length: nrOfPlayers }, (_, index) => ({
          player: index + 1,
          scoreValue: 0,
        }))
      );
    } else if (!nrOfPlayers) {
      setPlayerScore([]);
    }
  }, [nrOfPlayers]);

  const startGame = (np: number) => {
    setNrOfPlayers(np);
    createPlayers();
  };

  const restartGame = () => {
    setNrOfPlayers(undefined);
    setCards([]);
    setMatchedCards([]);
    setPlayerTurn(1);
    createCards();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (playerScore.length === 0) {
      createPlayers();
    }
  }, [createPlayers, nrOfPlayers, playerScore.length]);

  useEffect(() => {
    if (cards.length === 0 && images) {
      createCards();
    }
  }, [cards.length, createCards, images]);

  useEffect(() => {
    const flippedCards = cards.filter((c) => c.flipped);
    const flippedCardsId = flippedCards.map((c) => c.id);
    if (flippedCards.length == 2) {
      let shouldChangePlayer = false;
      let timeout = 1000;
      if (flippedCards[0].value === flippedCards[1].value) {
        setTimeout(() => {
          setMatchedCards((previous) => [...previous, ...flippedCardsId]);
        }, timeout);
        setPlayerScore((previous) =>
          previous.map((s) =>
            s.player === playerTurn ? { ...s, scoreValue: s.scoreValue + 1 } : s
          )
        );
      } else {
        shouldChangePlayer = true;
        timeout = 2000;
      }
      setTimeout(() => {
        setCards((previous) =>
          previous.map((c) =>
            flippedCardsId.includes(c.id) ? { ...c, flipped: false } : c
          )
        );
        if (shouldChangePlayer) {
          changeThePlayer();
        }
      }, timeout);
    }
  }, [cards, changeThePlayer, playerTurn]);

  return (
    <div className="App">
      <h1>{headerMessage}</h1>
      {!nrOfPlayers && <PlayerSelector startGame={startGame} />}
      {cards.length > 0 && cards.length === matchedCards.length ? (
        <div>
          <h1>{theWinnerMessage}</h1>
        </div>
      ) : (
        <div className="cards-container">
          {cards.map((card) =>
            isMatchedCard(card.id) ? (
              <CardComponent id={card.id} className="card matched" />
            ) : (
              <CardComponent
                id={card.id}
                flipped={card.flipped}
                value={card.value}
                className={`card ${card.flipped ? "flipped" : ""}`}
                image={card.image}
                onClick={cardClickHandler}
              />
            )
          )}
        </div>
      )}
      {nrOfPlayers && <button onClick={restartGame}>Restart Game</button>}
      {nrOfPlayers && nrOfPlayers > 1 && (
        <div className="score-info">
          {playerScore.map((ps) => (
            <PlayerScore
              key={ps.player}
              player={ps.player}
              scoreValue={ps.scoreValue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
