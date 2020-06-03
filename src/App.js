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
import {Router } from "react-router-dom";
import { getJwt } from "./helpers/jwtHelper";
import Login from "./pages/login/index";
import history from "./helpers/history";
import Checkin from "./components/chekin";
import { render } from "@testing-library/react";
const jwt = getJwt();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      descripcionMesa: "",
    };
  }
  callbackFunctionMesa = (listarMesasData) => {
    this.setState({ descripcionMesa: listarMesasData }, this.goToChekin);
  };
  componentDidMount() {
    if (jwt) {
      this.setState({
        isLoggedIn: true,
      });
    }
  }
  goToChekin = () => {
    console.log(this.state.descripcionMesa)
    history.push("/checkin");
  };
  render() {
    if (this.state.isLoggedIn) {
      return (
        <Router history={history}>
          <div>
            <Nav />
            <Route
              exact
              path="/"
              render={() => (
                <Home descripcionMesa={this.callbackFunctionMesa} />
              )}
            />
            <Route path="/agregarRol" component={Agregar} />
            <Route path="/categoriaProducto" component={categoriaProducto} />
            <Route path="/categoriaPlato" component={categoriaPlato} />
            <Route path="/mesa" component={mesa} />
            <Route path="/plato" component={plato} />
            <Route path="/producto" component={producto} />
            <Route path="/empleado" component={empleado} />
            <Route path="/registrarEmpleado" component={registrarEmpleado} />
            <Route
              path="/checkin"
              render={() => (
                <Checkin descripcionMesa={this.state.descripcionMesa} />
              )}
            />
          </div>
        </Router>
      );
    } else {
      return <Login />;
    }
  }
}
export default App;
