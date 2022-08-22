import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from "../src/components/Home"
import Signup from "../src/components/Signup"
import ForgotPassword from "../src/components/ForgotPassword"
import Dashboard from "./components/Dashboard";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  const token = localStorage.getItem('token')
  
  return (
      <BrowserRouter>
      <Routes>
        {token ? <Route path="/" element={<Dashboard />} /> :  <Route path="/" element={<Home/>} />}
        <Route exact path="/Signup" element={<Signup />} />
        <Route exact path="/login" element={<Home />} />
        <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
        <Route exact path="/Dashboard" element={<Dashboard />} />
        <Route exact path="/verifyEmail" element={<VerifyEmail />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
