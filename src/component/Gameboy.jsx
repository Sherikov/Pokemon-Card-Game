import { useEffect, useState } from "react";
import "../style/console.css";
import "../style/display.css";
import { ArrowBtn, Button, ResetButton } from "./Button";
import Card from "./Card";

const CARD_COUNT = 9;
const POKEMON_LIMIT = 151;
const SHUFFLE_DURATION = 650;
const POKEMON_LIST_URL = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}&offset=0`;

const shuffleArray = (items) => {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
    }

    return shuffledItems;
};

const formatLabel = (value) =>
    value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const mapPokemonToCard = (pokemon) => ({
    id: pokemon.id,
    name: formatLabel(pokemon.name),
    type: pokemon.types.map(({ type }) => formatLabel(type.name)).join(" / "),
    baseExperience: pokemon.base_experience ?? 0,
    image:
        pokemon.sprites.other?.["official-artwork"]?.front_default ??
        pokemon.sprites.front_default ??
        "",
});

const Gameboy = () => {
    const [cards, setCards] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [statusText, setStatusText] = useState("Click each Pokemon only once.");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [pokemonPool, setPokemonPool] = useState([]);
    const [restartCount, setRestartCount] = useState(0);
    const [shuffleRequest, setShuffleRequest] = useState({ id: 0, active: false });

    useEffect(() => {
        let ignore = false;

        const loadPokemonPool = async () => {
            if (pokemonPool.length) {
                return;
            }

            setIsLoading(true);
            setErrorMessage("");
            setStatusText("Loading Pokemon...");

            try {
                const response = await fetch(POKEMON_LIST_URL);

                if (!response.ok) {
                    throw new Error("Unable to load the Pokemon list.");
                }

                const data = await response.json();

                if (!ignore) {
                    setPokemonPool(data.results ?? []);
                }
            } catch (error) {
                if (!ignore) {
                    setCards([]);
                    setErrorMessage(error instanceof Error ? error.message : "Unexpected loading error.");
                    setStatusText("Unable to load Pokemon.");
                    setIsLoading(false);
                }
            }
        };

        void loadPokemonPool();

        return () => {
            ignore = true;
        };
    }, [pokemonPool, restartCount]);

    useEffect(() => {
        if (!pokemonPool.length) {
            return undefined;
        }

        let ignore = false;

        const loadCards = async () => {
            setIsLoading(true);
            setCards([]);
            setScore(0);
            setSelectedIds([]);
            setErrorMessage("");
            setHasWon(false);
            setIsAnimating(false);
            setStatusText("Loading Pokemon...");
            setShuffleRequest((currentRequest) => ({ ...currentRequest, active: false }));

            try {
                if (pokemonPool.length < CARD_COUNT) {
                    throw new Error("Not enough Pokemon data for a 3x3 board.");
                }

                const selectedPokemon = shuffleArray(pokemonPool).slice(0, CARD_COUNT);
                const loadedPokemon = await Promise.all(
                    selectedPokemon.map(async ({ url }) => {
                        const response = await fetch(url);

                        if (!response.ok) {
                            throw new Error("Unable to load Pokemon cards.");
                        }

                        return response.json();
                    }),
                );

                if (!ignore) {
                    setCards(shuffleArray(loadedPokemon.map(mapPokemonToCard)));
                    setStatusText("Click each Pokemon only once.");
                }
            } catch (error) {
                if (!ignore) {
                    setCards([]);
                    setErrorMessage(error instanceof Error ? error.message : "Unexpected loading error.");
                    setStatusText("Unable to load Pokemon.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        void loadCards();

        return () => {
            ignore = true;
        };
    }, [pokemonPool, restartCount]);

    useEffect(() => {
        if (!shuffleRequest.active) {
            return undefined;
        }

        const shuffleTimeout = window.setTimeout(() => {
            setCards((currentCards) => shuffleArray(currentCards));
        }, SHUFFLE_DURATION / 2);

        const finishTimeout = window.setTimeout(() => {
            setIsAnimating(false);
            setShuffleRequest((currentRequest) => ({ ...currentRequest, active: false }));
        }, SHUFFLE_DURATION);

        return () => {
            window.clearTimeout(shuffleTimeout);
            window.clearTimeout(finishTimeout);
        };
    }, [shuffleRequest]);

    const startShuffleAnimation = () => {
        setIsAnimating(true);
        setShuffleRequest((currentRequest) => ({
            id: currentRequest.id + 1,
            active: true,
        }));
    };

    const handleCardClick = (cardId, cardName) => {
        if (isLoading || isAnimating || errorMessage || hasWon) {
            return;
        }

        if (selectedIds.includes(cardId)) {
            setScore(0);
            setSelectedIds([]);
            setHasWon(false);
            setStatusText(`${cardName} was already selected. Score reset.`);
            startShuffleAnimation();
            return;
        }

        const nextSelectedIds = [...selectedIds, cardId];
        const nextScore = nextSelectedIds.length;

        setSelectedIds(nextSelectedIds);
        setScore(nextScore);
        setBestScore((currentBestScore) => Math.max(currentBestScore, nextScore));

        if (nextScore === CARD_COUNT) {
            setHasWon(true);
            setStatusText("You won! You clicked all 9 cards once. Press Restart.");
        } else {
            setStatusText(`${cardName} is new. Keep going!`);
        }

        startShuffleAnimation();
    };

    const handleRestart = () => {
        setBestScore(0);
        setIsAnimating(false);
        setShuffleRequest((currentRequest) => ({
            id: currentRequest.id + 1,
            active: false,
        }));
        setRestartCount((currentCount) => currentCount + 1);
    };

    return (
        <div className="console">
            <div className="display">
                <div className="header">
                    <h1>Pokemon Memory</h1>
                    <div className="score">
                        <div className="score-item">
                            <span>Score</span>
                            <strong>{score}</strong>
                        </div>
                        <div className="score-item">
                            <span>Best</span>
                            <strong>{bestScore}</strong>
                        </div>
                    </div>
                </div>
                <h2 className={`title ${hasWon ? "title-win" : ""}`}>{statusText}</h2>
                <div className={`card-container ${isLoading || errorMessage ? "card-container-message" : ""}`}>
                    {isLoading ? <div className="board-message">Loading Pokemon...</div> : null}

                    {!isLoading && errorMessage ? (
                        <div className="board-message board-message-error">{errorMessage}</div>
                    ) : null}

                    {!isLoading && !errorMessage
                        ? cards.map((card) => (
                              <Card
                                  key={card.id}
                                  cardName={card.name}
                                  cardType={card.type}
                                  cardXP={card.baseExperience}
                                  imageSrc={card.image}
                                  onClick={() => handleCardClick(card.id, card.name)}
                                  disabled={isAnimating || hasWon}
                                  isFlipped={isAnimating}
                              />
                          ))
                        : null}
                </div>
            </div>

            <ArrowBtn className="d-pad-button" />
            <ResetButton divClass="btn-reset" buttonClass="reset" onClick={handleRestart} label="Restart" />
            <div className="action-btn">
                <Button className="btn" text="A" />
                <Button className="btn" text="B" />
            </div>
            <div className="lines">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
            </div>
        </div>
    );
};

export default Gameboy;
