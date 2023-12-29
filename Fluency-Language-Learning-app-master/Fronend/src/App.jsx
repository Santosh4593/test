import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Profile from "./pages/my_profile/index";
import Board from "./pages/leaderboard/index";
import Quiz from "./pages/home/quiz";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Board />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
