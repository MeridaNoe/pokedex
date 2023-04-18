import React from "react";
import {
  AiOutlineMedicineBox,
  AiOutlineControl
} from "react-icons/ai";
import { MdOutlinePlace , MdCatchingPokemon} from "react-icons/md";
import { BiBug, BiGitCompare, BiHomeHeart } from "react-icons/bi";
import { FiUsers} from "react-icons/fi";
import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";



const PublicNavbar = () => {
  const navbarStyle = {
    backgroundColor: " #fff",
  };
  return (
    <>
      <Navbar style={navbarStyle} expand="lg">
        <Container fluid>
          <Navbar.Brand>Centro Pokemon UTEZ</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="mx2-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link to="/Pokemons" className="ms-1 nav-link">
                {" "}
                <MdCatchingPokemon /> Pokemos
              </Link>
              <Nav.Link href="/CitaMedica">
                <AiOutlineMedicineBox /> Cita Medica
              </Nav.Link>

              <NavDropdown title="Componentes" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/Combinacion">
                  <BiGitCompare /> Combinacion
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/EspeciesPokemon">
                  <BiBug /> Especies
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/OrigenPokemon">
                  <MdOutlinePlace /> Regiones
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/Consultorios">
                  <BiHomeHeart /> Consultorios
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Usuarios" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/Users">
                  <FiUsers /> Usuarios
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/Roles">
                  <AiOutlineControl /> Roles de Usuario
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default PublicNavbar;
