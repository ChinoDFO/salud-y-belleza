import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import { AdminPanel } from "../src/pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tlS&B$_67PadAdm3011/admin/" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;