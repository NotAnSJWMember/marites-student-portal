import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register"
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard";

import "./App.scss";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
         </Routes>
      </Router>
   );
}

export default App;
