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
const ruta = "https://restoapp-backend.herokuapp.com/api/categoriaPlato";

class CategoriaAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdCategoriaPlato: 0,
      DescripcionCategoriaPlato: "",
    };
    this.props = {};
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  

  async createCategoria() {
    if (document.getElementById("TbIdCategoria").value === "") {
      request
        .post(ruta)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({
          DescripcionCategoriaPlato: document.getElementById(
            "TbDescripcionCategoria"
          ).value,
        })
        .end(function (err, res) {
          const CategoriaPlatos = JSON.parse(res.text);
          if (CategoriaPlatos.error) {
            localStorage.removeItem("token-jwt");
          }
          window.location.reload();
        });
    } else {
      request
        .put(ruta + "/" + document.getElementById("TbIdCategoria").value)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({
          DescripcionCategoriaPlato: document.getElementById(
            "TbDescripcionCategoria"
          ).value,
        })
        .end(function (err, res) {
          const CategoriaPlatos = JSON.parse(res.text);
          if (CategoriaPlatos.error) {
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
              id="TbIdCategoria"
              disabled
              size="sm"
              type="text"
              enabled="false"
            />
          </Col>
        </Form.Group>
        <Form.Group className="" as={Row}>
          <Form.Label column lg="12">
            Descripción de Rol
          </Form.Label>
          <Col lg="12">
            <Form.Control
              id="TbDescripcionCategoria"
              name="DescripcionCategoria"
              onChange={this.changeHandler}
              size="sm"
              type="text"
              placeholder="Descripción"
              required
            />
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

class CategoriaList extends Component {
  constructor() {
    super();
    this.state = {
      CategoriaPlatos: [],
      CategoriaPlato: [],
    };
  }
  GetCategorias() {
    request
      .get(ruta)
      .set("token", token)
      .end((err, res) => {
        const CategoriaPlatos = JSON.parse(res.text);
        if (CategoriaPlatos.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            CategoriaPlatos: CategoriaPlatos,
          });
        }
      });
  }

  componentDidMount() {
    this.GetCategorias();
  }

  onEdit(CategoriaPlato) {
    this.setState({ CategoriaPlato: CategoriaPlato });
    document.getElementById("TbIdCategoria").value =
      CategoriaPlato.IdCategoriaPlato;
    document.getElementById("TbDescripcionCategoria").value =
      CategoriaPlato.DescripcionCategoriaPlato;
  }

  render() {
    return (
      (<CategoriaList />),
      this.state.CategoriaPlatos.map((CategoriaPlato, i) => (
        <tr key={CategoriaPlato.IdCategoriaPlato}>
          <td>
            {
              <Button
                onClick={() => this.onEdit(CategoriaPlato)}
                variant="link"
              >
                Seleccionar
              </Button>
            }
          </td>
          <td>{CategoriaPlato.IdCategoriaPlato}</td>
          <td>{CategoriaPlato.DescripcionCategoriaPlato}</td>
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
          Catálogo de Categoria de Platillos
        </Card.Title>
        <Card.Body>
          <Container>
            <CategoriaAdd></CategoriaAdd>
            <Table className="mt-5" responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Código</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <CategoriaList></CategoriaList>
              </tbody>
            </Table>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
