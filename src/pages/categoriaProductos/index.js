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
const ruta = "https://restoapp-backend.herokuapp.com/api/categoriaProducto";

class CategoriaAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdCategoriaProducto: 0,
      DescripcionCategoriaProducto: "",
    };
    this.props = {};
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.createCategoria();
  };

  createCategoria() {
    if (document.getElementById("TbIdCategoria").value === "") {
      request
        .post(ruta)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({
          DescripcionCategoriaProducto: this.state.DescripcionCategoriaProducto,
        })
        .end(function (err, res) {
          const CategoriaProductos = JSON.parse(res.text);
          if (CategoriaProductos.error) {
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
          DescripcionCategoriaProducto: document.getElementById(
            "TbDescripcionCategoria"
          ).value,
        })
        .end(function (err, res) {
          const CategoriaProductos = JSON.parse(res.text);
          if (CategoriaProductos.error) {
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
            Descripción de Categoria Productos
          </Form.Label>
          <Col lg="12">
            <Form.Control
              id="TbDescripcionCategoria"
              name="DescripcionCategoriaProducto"
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

class CategoriaList extends Component {
  constructor() {
    super();
    this.state = {
      Categorias: [],
      Categoria: [],
    };
  }
  GetCategorias() {
    request
      .get(ruta)
      .set("token", token)
      .end((err, res) => {
        const Categorias = JSON.parse(res.text);
        if (Categorias.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            Categorias: Categorias,
          });
        }
      });
  }
  componentDidMount() {
    this.GetCategorias();
  }

  onEdit(Categoria) {
    this.setState({ Categoria: Categoria });
    document.getElementById("TbIdCategoria").value =
      Categoria.IdCategoriaProducto;
    document.getElementById("TbDescripcionCategoria").value =
      Categoria.DescripcionCategoriaProducto;
  }

  render() {
    return (
      (<CategoriaList />),
      this.state.Categorias.map((categoria, i) => (
        <tr key={categoria.IdCategoriaProducto}>
          <td>
            {
              <Button onClick={() => this.onEdit(categoria)} variant="link">
                Seleccionar
              </Button>
            }
          </td>
          <td>{categoria.IdCategoriaProducto}</td>
          <td>{categoria.DescripcionCategoriaProducto}</td>
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
          Catálogo de Categorias
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
