import "../style/button.css";

const ResetButton = (props) => {
    const {
        divClass,
        buttonClass,
        onClick,
        label = "Restart",
    } = props;

    return (
        <div className={divClass}>
            <button className={buttonClass} onClick={onClick}></button>
            <h3>{label}</h3>
        </div>
    );
};

const Button = (props) => {
    const {
        onClick,
        className,
        text,
    } = props;

    return (
        <button className={className} onClick={onClick}>
            {text}
        </button>
    );
};

const ArrowBtn = (props) => {
    const { className } = props;

    return (
        <button className={className} aria-label="D-pad">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M 35 15
                    L 65 15
                    L 65 35
                    L 85 35
                    L 85 65
                    L 65 65
                    L 65 85
                    L 35 85
                    L 35 65
                    L 15 65
                    L 15 35
                    L 35 35
                    Z"
                    fill="#242424"
                    stroke="rgba(0, 0, 0, 0.42)"
                    strokeWidth="8"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
};

export { ResetButton, Button, ArrowBtn };
