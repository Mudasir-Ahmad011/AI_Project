import './App.css';
import Login from './Components/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './Components/Signup';
import Admin from './Components/Admin';
import Agent from './Components/Agent';
import AddCustomer from './Components/AddCustomer';
function App() {
  return (
  <Router>
    <Routes>
      <Route exact path="/" element={<Login/>}/>
      <Route exact path="/signup" element={<SignUp/>}/>
      <Route exact path='/admin' element={<Admin/>}/>
      <Route exact path="/agent" element={<Agent/>}/>
      <Route exact path="/AddCustomer" element={<AddCustomer/>}/>
    </Routes>
  </Router>
  );
}

export default App;
