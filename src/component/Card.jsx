import "../style/cards.css";

const Card = (props) => {
    const {
        cardName,
        cardType,
        cardXP,
        imageSrc,
        onClick,
        disabled,
        isFlipped,
    } = props;

    return (
        <button
            type="button"
            className={`card ${isFlipped ? "is-flipped" : ""}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={`Select ${cardName}`}
        >
            <span className="card-inner">
                <span className="card-face card-front">
                    {imageSrc ? (
                        <img className="card-image" src={imageSrc} alt={cardName} loading="lazy" />
                    ) : (
                        <span className="card-image-placeholder">?</span>
                    )}
                    <span className="card-content">
                        <h5 className="card-name">{cardName}</h5>
                        <span className="card-type">{cardType}</span>
                        <span className="card-xp">XP {cardXP}</span>
                    </span>
                </span>
                <span className="card-face card-back" aria-hidden="true">
                    <span className="card-back-mark">POKE</span>
                </span>
            </span>
        </button>
    );
};

export default Card;
