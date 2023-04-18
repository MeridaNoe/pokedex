import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import PublicNavbar from "./PublicNavbar";

import PokemonsAgua from "../../modules/pokemons/tipos/agua/PokemonsAgua";
import PokemonFuego from "../../modules/pokemons/tipos/fuego/PokemonFuego";
import Home from "./Home";
import CitasMedicas from "../../modules/citas/CitasMedicas";
import EspeciesPokemon from "../../modules/pokemons/especies/EspeciesPokemon";
import Origen from "../../modules/pokemons/origenes/Origen";
import PokemonsScreen from "../../modules/pokemons/PokemonsScreen";
import CombinacionScreen from "../../modules/combinacion/CombinacionScreen";
import ConsultorioScreen from "../../modules/consultorio/ConsultorioScreen";

import Users from "../../modules/users/Users";
import RolesScreen from "../../modules/users/roles/RolesScreen";
const AppRouter = () => {
  return (
    <Router>
      <PublicNavbar/>
        <Routes>
        <Route path="/" element={<PokemonsScreen />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/PokemonAgua" element={<PokemonsAgua />} />
        <Route path="/PokemonFuego" element={<PokemonFuego />} />
        <Route path="/CitaMedica" element={<CitasMedicas />} />
        <Route path="/EspeciesPokemon" element={<EspeciesPokemon />} />
        <Route path="/OrigenPokemon" element={<Origen />} />
        <Route path="/Pokemons" element={<PokemonsScreen />} />
        <Route path="/Combinacion" element={<CombinacionScreen />} />
        <Route path="/Consultorios" element={<ConsultorioScreen />} />

        <Route path="/Users" element={<Users />} />
        <Route path="/Roles" element={<RolesScreen />} />
        </Routes>
    
    </Router>
  );
};

export default AppRouter;
