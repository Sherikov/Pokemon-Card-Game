import MemoryGame from "./component/MemoryGame";
import "./style/body.css";
import "./style/variable.css";

function App() {
    return (
        <div className="app-shell">
            <a
                className="github-link"
                href="https://github.com/Sherikov"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Sherikov GitHub profile"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12C0.5 17.08 3.79 21.39 8.36 22.91C8.94 23.01 9.15 22.66 9.15 22.36C9.15 22.09 9.14 21.18 9.13 20C5.92 20.7 5.24 18.64 5.24 18.64C4.72 17.3 3.97 16.94 3.97 16.94C2.93 16.22 4.05 16.24 4.05 16.24C5.2 16.32 5.8 17.43 5.8 17.43C6.82 19.19 8.48 18.68 9.13 18.38C9.23 17.64 9.53 17.13 9.86 16.84C7.3 16.55 4.61 15.56 4.61 11.16C4.61 9.91 5.06 8.9 5.79 8.11C5.67 7.82 5.28 6.62 5.9 5C5.9 5 6.87 4.69 9.08 6.19C10 5.94 10.98 5.82 11.96 5.82C12.94 5.82 13.92 5.94 14.84 6.19C17.05 4.69 18.02 5 18.02 5C18.64 6.62 18.25 7.82 18.13 8.11C18.86 8.9 19.31 9.91 19.31 11.16C19.31 15.57 16.61 16.54 14.05 16.83C14.47 17.19 14.85 17.9 14.85 19C14.85 20.57 14.84 21.96 14.84 22.36C14.84 22.66 15.05 23.02 15.64 22.91C20.21 21.39 23.5 17.08 23.5 12C23.5 5.65 18.35 0.5 12 0.5Z"
                    />
                </svg>
                <span>GitHub</span>
            </a>
            <MemoryGame />
        </div>
    );
}

export default App;
