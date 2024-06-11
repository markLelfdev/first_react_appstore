import React  from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop  from "./pages/shop";
import Cart from './pages/Cart';
import Header from "./components/Header";
const App : React.FC = ()=> {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Shop/>} /> 
        <Route path="/cart" element={<Cart />} />
        </Routes>
    </Router>
  );
}
export default App;
