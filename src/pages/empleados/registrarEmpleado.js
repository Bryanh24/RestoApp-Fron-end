import React, { Component } from "react";
import { Card, Container, Table, Form, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import request from "superagent";
import { getJwt } from "../../helpers/jwtHelper";

const ruta = "https://restoapp-backend.herokuapp.com/api/empleado/register";
const rutaGetRol = "https://restoapp-backend.herokuapp.com/api/roles";
const token = getJwt()

class EmpleadoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdEmpleado: 0,
      NombreEmpleado: "",
      ApellidoEmpleado: "",
      UsuarioEmpleado: 0,
      idRol: 0,
      TelefonoEmpleado: "",
      DireccionEmpleado: "",
      PasswordEmpleado: "",
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
      .post(ruta)
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
        idRol: parseInt(document.getElementById("DdRolEmpleado").value),
      })
      .send({
        TelefonoEmpleado: parseInt(
          document.getElementById("TbTelefonoEmpleado").value
        ),
      })
      .send({
        DireccionEmpleado: document.getElementById("TbDireccionEmpleado").value,
      })
      .send({
        PasswordEmpleado: document.getElementById("TbPasswordEmpleado").value,
      })
      .end(function (err, res) {
        const empleados = JSON.parse(res.text);
        if (empleados.error) {
          localStorage.removeItem("jwt-token");
          window.location.reload();
        }
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
            window.location.reload();
          }
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
          <Form.Group as={Col} lg="6">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              id="TbPasswordEmpleado"
              size="sm"
              type="password"
              placeholder="********"
              name="PasswordEmpleado"
              onChange={this.changeHandler}
            />
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              id="TbConfirmarPassword"
              size="sm"
              type="text"
              placeholder="********"
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
        </Form.Row>
      </Form>
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
          Registrar Nuevo Empleado
        </Card.Title>
        <Card.Body>
          <Container>
            <EmpleadoAdd></EmpleadoAdd>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
