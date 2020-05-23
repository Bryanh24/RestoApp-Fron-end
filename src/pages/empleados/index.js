import React, { Component } from "react";
import { Card, Container, Table, Form, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import request from "superagent";
import { getJwt } from "../../helpers/jwtHelper";

const ruta = "http://localhost:3000/api/empleado";
const rutaGetRol = "http://localhost:3000/api/roles";
const token = getJwt();

class EmpleadoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdEmpleado: 0,
      NombreEmpleado: "",
      DescripcionEmpleado: "",
      CategoriaEmpleado: 0,
      PrecioEmpleado: 0.0,
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.createEmpleado();
    console.log(this.props);
  };
  async createEmpleado() {
    request
      .put(ruta + "/" + document.getElementById("TbIdEmpleado").value)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("token", token)
      .send({
        NombreEmpleado: document.getElementById("TbNombreEmpleado").value,
      })
      .send({
        ApellidoEmpleado: document.getElementById("TbApellidoEmpleado").value,
      })
      .send({
        UsuarioEmpleado: document.getElementById("TbUsuarioEmpleado").value,
      })
      .send({
        idRol: document.getElementById("DdRolEmpleado").value,
      })
      .send({
        TelefonoEmpleado: "TbTelefonoEmpleado".value,
      })
      .send({
        DireccionEmpleado: document.getElementById("TbDireccionEmpleado").value,
      })
      .end(function (err, res) {
        const empleados = JSON.parse(res.text);
        if (empleados.error) {
          localStorage.removeItem("jwt-token");
        }
        window.location.reload();
      });
  }

  deleteEmpleado() {
    if (document.getElementById("TbIdEmpleado").value != null) {
      request
        .del(ruta + "/" + document.getElementById("TbIdEmpleado").value)
        .set("Accept", "application/json")
        .set("token", token)
        .end(function (err, res) {
          const empleados = JSON.parse(res.text);
          if (empleados.error) {
            localStorage.removeItem("jwt-token");
          }
          window.location.reload();
        });
    }
  }

  render() {
    return (
      <Form onSubmit={this.submitHandler}>
        <Form.Row>
          <Form.Group as={Col} lg="6">
            <Form.Label>Código</Form.Label>
            <Form.Control
              id="TbIdEmpleado"
              disabled
              size="sm"
              type="text"
              enabled="false"
            />
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              id="TbNombreEmpleado"
              name="NombreEmpleado"
              onChange={this.changeHandler}
              size="sm"
              type="text"
              placeholder="Nombre del platillo"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} lg="6">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              id="TbApellidoEmpleado"
              size="sm"
              type="text"
              placeholder="Apellido"
              name="ApellidoEmpleado"
              onChange={this.changeHandler}
            />
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              id="TbUsuarioEmpleado"
              size="sm"
              type="text"
              placeholder="Usuario"
              name="UsuarioEmpleado"
              onChange={this.changeHandler}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} lg="6">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              name="IdRolEmpleado"
              onChange={this.changeHandler}
              id="DdRolEmpleado"
              as="select"
              size="sm"
              custom
            >
              <option value="-1">Seleccione un Rol...</option>
              <RolList />
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              id="TbTelefonoEmpleado"
              size="sm"
              type="text"
              placeholder="Teléfono"
              name="TelefonoEmpleado"
              onChange={this.changeHandler}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} lg="12">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              id="TbDireccionEmpleado"
              size="sm"
              type="text"
              placeholder="Dirección"
              name="DireccionEmpleado"
              onChange={this.changeHandler}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Button
            lg="4"
            size="sm"
            className="mr-2"
            variant="primary"
            type="submit"
          >
            Guardar
          </Button>
          <Button
            lg="4"
            onClick=""
            size="sm"
            className="mr-2"
            variant="primary"
            type="reset"
          >
            Nuevo
          </Button>
          <Button
            lg="4"
            onClick={this.deleteEmpleado}
            size="sm"
            variant="primary"
            type="button"
          >
            Eliminar
          </Button>
        </Form.Row>
      </Form>
    );
  }
}

class EmpleadoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empleados: [],
      empleado: [],
    };
    this.props = {
      getEmpleados: this.GetEmpleados(),
    };
  }
  GetEmpleados() {
    request.get(ruta).end((err, res) => {
      const empleados = JSON.parse(res.text);
      if (empleados.error) {
        localStorage.removeItem("jwt-token");
        window.location.reload();
      } else {
        this.setState({
          empleados: empleados,
        });
      }
    });
  }
  componentDidMount() {
    this.GetEmpleados();
  }

  onEdit(empleado) {
    this.setState({ empleado: empleado });
    console.log(empleado);
    document.getElementById("TbIdEmpleado").value = empleado.IdEmpleado;
    document.getElementById("TbNombreEmpleado").value = empleado.NombreEmpleado;
    document.getElementById("TbApellidoEmpleado").value =
      empleado.ApellidoEmpleado;
    document.getElementById("TbUsuarioEmpleado").value =
      empleado.UsuarioEmpleado;
    document.getElementById("DdRolEmpleado").value = empleado.rol.idRol;
    document.getElementById("TbDireccionEmpleado").value =
      empleado.DireccionEmpleado;
    document.getElementById("TbTelefonoEmpleado").value =
      empleado.TelefonoEmpleado;
  }

  render() {
    return (
      (<EmpleadoList />),
      this.state.empleados.map((empleado, i) => (
        <tr key={empleado.IdEmpleado}>
          <td>
            {
              <Button onClick={() => this.onEdit(empleado)} variant="link">
                Seleccionar
              </Button>
            }
          </td>
          <td>{empleado.IdEmpleado}</td>
          <td>{empleado.NombreEmpleado}</td>
          <td>{empleado.ApellidoEmpleado}</td>
          <td>{empleado.UsuarioEmpleado}</td>
          <td>{empleado.rol.DescripcionRol}</td>
          <td>{empleado.TelefonoEmpleado}</td>
          <td>{empleado.DireccionEmpleado}</td>
        </tr>
      ))
    );
  }
}
class RolList extends Component {
  constructor() {
    super();
    this.state = {
      Roles: [],
      Rol: [],
    };
  }
  GetRoles() {
    request
      .get(rutaGetRol)
      .set("token", token) // Works.
      .end((err, res) => {
        const roles = JSON.parse(res.text);
        if (roles.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            Roles: roles,
          });
        }
      });
  }
  componentDidMount() {
    this.GetRoles();
  }
  render() {
    return this.state.Roles.map((Roles, i) => (
      <option key={Roles.idRol} value={Roles.idRol}>
        {Roles.DescripcionRol}
      </option>
    ));
  }
}
export default class extends Component {
  render() {
    return (
      <Card>
        <Card.Title size="lg" className="mt-3" align="center">
          Catálogo Empleados
        </Card.Title>
        <Card.Body>
          <Container>
            <EmpleadoAdd></EmpleadoAdd>
            <Table className="mt-5" responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                </tr>
              </thead>
              <tbody>
                <EmpleadoList></EmpleadoList>
              </tbody>
            </Table>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
