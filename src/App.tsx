import { Route, Routes } from "react-router-dom";
import "./App.css";
import CardPage from "./pages/CardPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cards/register" element={<RegisterPage />} />
      <Route path="/cards/:id" element={<CardPage />} />
    </Routes>
  );
}

export default App;
