import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, withRouter } from "react-router-dom";
import app from "../App";

class NavIigationbar extends React.Component {
  LogOff() {
    localStorage.removeItem("token-jwt");
    window.location.reload()
  }

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">RestoApp</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>
            <NavLink className="text-secondary" to="/">
              Inicio
            </NavLink>
          </Nav.Link>
          <NavDropdown
            className="text-secondary"
            title="Empleados"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item>
              <NavLink className="text-secondary" to="/empleado">
                Catalogo de Empleados
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <NavLink className="text-secondary" to="/registrarEmpleado">
                Registrar Empleado
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <NavLink className="text-secondary" to="/agregarRol">
                Roles
              </NavLink>
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Platillos" id="basic-nav-dropdown">
            <NavDropdown.Item>
              <NavLink className="text-secondary" to="/plato">
                Platillos
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <NavLink className="text-secondary" to="/categoriaPlato">
                Categoria de Platillos
              </NavLink>
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Productos" id="basic-nav-dropdown">
            <NavDropdown.Item>
              <NavLink className="text-secondary" to="/producto">
                Productos
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <NavLink className="text-secondary" to="/categoriaProducto">
                Categoria de Productos
              </NavLink>
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link>
            <NavLink className="text-secondary" to="/mesa">
              Mesas
            </NavLink>
          </Nav.Link>
        </Nav>
        <Nav>
        <NavDropdown title="Configuración" id="collasible-nav-dropdown">
        <NavDropdown.Item onClick={this.LogOff}>Cerrar Sesión</NavDropdown.Item>
      </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

NavIigationbar = withRouter(NavIigationbar);
export default NavIigationbar;
