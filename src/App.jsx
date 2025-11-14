import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SudokuProvider } from "./context/SudokuContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import GameSelection from "./pages/GameSelection";
import GameEasy from "./pages/GameEasy";
import GameNormal from "./pages/GameNormal";
import Rules from "./pages/Rules";
import Scores from "./pages/Scores";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppContent() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<GameSelection />} />
                <Route path="/games/easy" element={<GameEasy />} />
                <Route path="/games/normal" element={<GameNormal />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/scores" element={<Scores />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <SudokuProvider>
                <AppContent />
            </SudokuProvider>
        </Router>
    );
}

export default App;
