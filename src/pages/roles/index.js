import React, { Component } from "react";
import {
  Card,
  Container,
  Table,
  Form,
  Col,
  Row,
  Button,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import request from "superagent";
import { getJwt } from "../../helpers/jwtHelper";

const ruta = "https://restoapp-backend.herokuapp.com/api/roles";
const token = getJwt();

class RolAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idRol: 0,
      DescripcionRol: "",
    };
    this.props = {};
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.createRol();
    this.GetRols();
  };
  GetRols() {
    request.get(ruta).end((err, res) => {
      const roles = JSON.parse(res.text);
      this.setState({
        roles: roles,
      });
    });
  }
  async createRol() {
    if (document.getElementById("TbidRol").value === "") {
      request
        .post(ruta)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({ DescripcionRol: this.state.DescripcionRol })
        .end(function (err, res) {
          const roles = JSON.parse(res.text);
          if (roles.error) {
            localStorage.removeItem("token-jwt");
          }
          window.location.reload();
        });
    } else {
      request
        .put(ruta + "/" + document.getElementById("TbidRol").value)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({
          DescripcionRol: document.getElementById("TbDescripcionRol").value,
        })
        .end(function (err, res) {
          const roles = JSON.parse(res.text);
          if (roles.error) {
            localStorage.removeItem("token-jwt");
            window.location.reload();
          }
          window.location.reload();
        });
    }
  }

  render() {
    return (
      <Form onSubmit={this.submitHandler}>
        <Form.Group as={Row}>
          <Form.Label column lg="12">
            Código
          </Form.Label>
          <Col lg="12">
            <Form.Control
              id="TbidRol"
              disabled
              size="sm"
              type="text"
              enabled="false"
            />
          </Col>
        </Form.Group>
        <Form.Group className="" as={Row}>
          <Form.Label for="TbDescripcionRol" column lg="12">
            Descripción de Rol
          </Form.Label>
          <Col lg="12">
            <Form.Control
              id="TbDescripcionRol"
              name="DescripcionRol"
              onChange={this.changeHandler}
              size="sm"
              type="text"
              placeholder="Descripción"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Button size="sm" className="mr-2" variant="primary" type="submit">
          Guardar
        </Button>
        <Button onClick="" size="sm" variant="primary" type="reset">
          Nuevo
        </Button>
      </Form>
    );
  }
}

class RolList extends Component {
  constructor() {
    super();
    this.state = {
      roles: [],
      rol: [],
    };
  }
  GetRols() {
    request
      .get(ruta)
      .set("token", token) // Works.
      .end((err, res) => {
        const roles = JSON.parse(res.text);
        if (roles.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            roles: roles,
          });
        }
      });
  }
  componentDidMount() {
    this.GetRols();
  }

  onEdit(rol) {
    this.setState({ rol: rol });
    document.getElementById("TbidRol").value = rol.idRol;
    document.getElementById("TbDescripcionRol").value = rol.DescripcionRol;
  }

  render() {
    return (
      (<RolList />),
      this.state.roles.map((rol, i) => (
        <tr key={rol.idRol}>
          <td>
            {
              <Button onClick={() => this.onEdit(rol)} variant="link">
                Seleccionar
              </Button>
            }
          </td>
          <td>{rol.idRol}</td>
          <td>{rol.DescripcionRol}</td>
        </tr>
      ))
    );
  }
}

export default class extends Component {
  render() {
    return (
      <Card>
        <Card.Title size="lg" className="mt-3" align="center">
          Catálogo de Roles
        </Card.Title>
        <Card.Body>
          <Container>
            <RolAdd></RolAdd>
            <Table className="mt-5" responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Código</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <RolList></RolList>
              </tbody>
            </Table>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
