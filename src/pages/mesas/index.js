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

const token = getJwt();
const ruta = "https://restoapp-backend.herokuapp.com/api/mesa";
const libre = 1

class MesaAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdMesa: 0,
      DescripcionMesa: "",
    };
    this.props = {};
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.createMesa();
  };

  async createMesa() {
    if (document.getElementById("TbIdMesa").value === "") {
      request
        .post(ruta)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({ DescripcionMesa: this.state.DescripcionMesa })
        .send({ EstadoMesa: libre })
        .end(function (err, res) {
          const mesa = JSON.parse(res.text);
          if (mesa.error) {
            localStorage.removeItem("token-jwt");
          }
          window.location.reload();
        });
    } else {
      request
        .put(ruta + "/" + document.getElementById("TbIdMesa").value)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({
          DescripcionMesa: document.getElementById("TbDescripcionMesa").value,
        })
        .end(function (err, res) {
          const mesa = JSON.parse(res.text);
          if (mesa.error) {
            localStorage.removeItem("token-jwt");
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
              id="TbIdMesa"
              disabled
              size="sm"
              type="text"
              enabled="false"
            />
          </Col>
        </Form.Group>
        <Form.Group className="" as={Row}>
          <Form.Label column lg="12">
            Descripción
          </Form.Label>
          <Col lg="12">
            <Form.Control
              id="TbDescripcionMesa"
              name="DescripcionMesa"
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

class MesaList extends Component {
  constructor() {
    super();
    this.state = {
      mesas: [],
      mesa: [],
    };
  }
  GetMesas() {
    request
      .get(ruta)
      .set("token", token)
      .end((err, res) => {
        const mesas = JSON.parse(res.text);
        if (mesas.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            mesas: mesas,
          });
        }
      });
  }
  componentDidMount() {
    this.GetMesas();
  }

  onEdit(mesa) {
    this.setState({ mesa: mesa });
    document.getElementById("TbIdMesa").value = mesa.IdMesa;
    document.getElementById("TbDescripcionMesa").value = mesa.DescripcionMesa;
  }

  render() {
    return (
      (<MesaList />),
      this.state.mesas.map((mesa, i) => (
        <tr key={mesa.IdMesa}>
          <td>
            {
              <Button onClick={() => this.onEdit(mesa)} variant="link">
                Seleccionar
              </Button>
            }
          </td>
          <td>{mesa.IdMesa}</td>
          <td>{mesa.DescripcionMesa}</td>
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
          Catálogo de Mesas
        </Card.Title>
        <Card.Body>
          <Container>
            <MesaAdd></MesaAdd>
            <Table className="mt-5" responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Código</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <MesaList></MesaList>
              </tbody>
            </Table>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
