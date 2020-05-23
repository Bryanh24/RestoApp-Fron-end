import React, { Component } from "react";
import Nav from "./components/Navbar";
import Route from "react-router-dom/Route";
import Agregar from "./pages/roles/index";
import categoriaProducto from "./pages/categoriaProductos/index";
import categoriaPlato from "./pages/categoriaPlatos/index";
import plato from "./pages/platos/index";
import mesa from "./pages/mesas/index";
import producto from "./pages/productos/index";
import empleado from "./pages/empleados/index";
import registrarEmpleado from "./pages/empleados/registrarEmpleado";
import Home from "./pages/home/home";
import { BrowserRouter } from "react-router-dom";
import { getJwt } from "./helpers/jwtHelper";
import Login from "./pages/login/index";
const jwt = getJwt();
class Logged extends Component {
  constructor(props) {
    super(props);
    this.state = { empleado: undefined };
  }
  componentDidMount() {
    const jwt = getJwt();
    {
      this.props.history.push();
    }
  }
  render() {
    if (!jwt) {
      return (
        <Login></Login>
      );
    }else
    {
        <BrowserRouter>
          <div>
            <Nav />
            <Route exact path="/" component={Home} />
            <Route path="/agregarRol" component={Agregar} />
            <Route path="/categoriaProducto" component={categoriaProducto} />
            <Route path="/categoriaPlato" component={categoriaPlato} />
            <Route path="/mesa" component={mesa} />
            <Route path="/plato" component={plato} />
            <Route path="/producto" component={producto} />
            <Route path="/empleado" component={empleado} />
            <Route path="/registrarEmpleado" component={registrarEmpleado} />
          </div>
        </BrowserRouter>
    }
  }
}
export default Logged;
