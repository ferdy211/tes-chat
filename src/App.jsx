// import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Chat from "./chat";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
