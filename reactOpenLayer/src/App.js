import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dasboard";
import AccessibleMap from "./components/AccessibleMap";
import Home from "./components/Home";
import VectorLayerMap from "./components/VectorLayerMap";
import Settings from "./components/Settings";
import VectorTiles from "./components/VectorTiles";
import DrawShapes from "./components/DrawShapes";
import DrawAndModify from "./components/DrawAndModify";

const App = () => {
  return (
    <Router>
      <Dashboard>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/accessibleMap" element={ <AccessibleMap /> } />
          <Route path="/vectorLayerMap" element={ <VectorLayerMap /> } />
          <Route path="/vectorTiles" element={ <VectorTiles /> } />
          <Route path="/drawShapes" element={ <DrawShapes /> } />
          <Route path="/drawAndModify" element={ <DrawAndModify /> } />
          <Route path="/settings" element={ <Settings /> } />
        </Routes>
      </Dashboard>
    </Router>
  )
}


export default App