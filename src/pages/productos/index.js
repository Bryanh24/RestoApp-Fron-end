import React, { Component } from "react";
import { Card, Container, Table, Form, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import request from "superagent";
import { getJwt } from "../../helpers/jwtHelper";

const token = getJwt();
const rutaGetCategoria = "http://localhost:3000/api/categoriaProducto";
const ruta = "http://localhost:3000/api/producto";
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

class ProductoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdProducto: 0,
      DescripcionProducto: "",
      CategoriaProducto: 0,
      CantidadProducto: 0,
      PrecioProducto: 0.0,
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.createProducto();
    console.log(this.props);
  };
  async createProducto() {
    console.log(this.state);
    if (document.getElementById("TbIdProducto").value === "") {
      request
        .post(ruta)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({ DescripcionProducto: this.state.DescripcionProducto })
        .send({ IdCategoriaProducto: this.state.IdCategoriaProducto })
        .send({ CantidadProducto: parseInt(this.state.CantidadProducto) })
        .send({ PrecioProducto: parseFloat(this.state.PrecioProducto) })
        .end(function (err, res) {
          const producto = JSON.parse(res.text);
          if (producto.error) {
            localStorage.removeItem("token-jwt");
          }
          window.location.reload();
        });
    } else {
      request
        .put(ruta + "/" + document.getElementById("TbIdProducto").value)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({
          CantidadProducto: document.getElementById("TbCantidadProducto").value,
        })
        .send({
          DescripcionProducto: document.getElementById("TbDescripcionProducto")
            .value,
        })
        .send({
          IdCategoriaProducto: parseInt(
            document.getElementById("DdCategoriaProducto").value
          ),
        })
        .send({
          PrecioProducto: parseFloat(
            document.getElementById("TbPrecioProducto").value
          ),
        })
        .end(function (err, res) {
          const producto = JSON.parse(res.text);
          if (producto.error) {
            localStorage.removeItem("token-jwt");
          }
          window.location.reload();
        });
    }
  }
  deleteProducto() {
    if (document.getElementById("TbIdProducto").value != null) {
      request
        .del(ruta + "/" + document.getElementById("TbIdProducto").value)
        .set("Accept", "application/json")
        .set("token", token)
        .end(function (err, res) {
          const producto = JSON.parse(res.text);
          if (producto.error) {
            localStorage.removeItem("token-jwt");
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
              id="TbIdProducto"
              disabled
              size="sm"
              type="text"
              enabled="false"
            />
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              id="TbDescripcionProducto"
              size="sm"
              type="text"
              placeholder="Descripción"
              name="DescripcionProducto"
              onChange={this.changeHandler}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} lg="6">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              id="TbCantidadProducto"
              size="sm"
              type="text"
              placeholder="Cantidad"
              name="CantidadProducto"
              onChange={this.changeHandler}
            />
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              name="IdCategoriaProducto"
              onChange={this.changeHandler}
              id="DdCategoriaProducto"
              as="select"
              size="sm"
              custom
            >
              <option value="-1">Seleccione una Categoria...</option>
              <CategoriaList />
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} lg="12">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              id="TbPrecioProducto"
              size="sm"
              type="text"
              placeholder="Precio"
              name="PrecioProducto"
              onChange={this.changeHandler}
            />
          </Form.Group>
        </Form.Row>
        <Button size="sm" className="mr-2" variant="primary" type="submit">
          Guardar
        </Button>
        <Button className="mr-2" size="sm" variant="primary" type="reset">
          Nuevo
        </Button>
        <Button
          onClick={this.deleteProducto}
          size="sm"
          variant="primary"
          type="button"
        >
          Eliminar
        </Button>
      </Form>
    );
  }
}

class ProductoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      producto: [],
    };
  }
  GetProductos() {
    request
      .get(ruta)
      .set("token", token)
      .end((err, res) => {
        const productos = JSON.parse(res.text);
        if (productos.error) {
          localStorage.removeItem("jwt-token");
          window.location.reload();
        } else {
          this.setState({
            productos: productos,
          });
        }
      });
  }
  componentDidMount() {
    this.GetProductos();
  }

  onEdit(producto) {
    this.setState({ producto: producto });
    document.getElementById("TbIdProducto").value = producto.IdProducto;
    document.getElementById("TbDescripcionProducto").value =
      producto.DescripcionProducto;
    document.getElementById("DdCategoriaProducto").value =
      producto.categoriaProducto.IdCategoriaProducto;
    document.getElementById("TbPrecioProducto").value = producto.PrecioProducto;
    document.getElementById("TbCantidadProducto").value =
      producto.CantidadProducto;
  }

  render() {
    return (
      (<ProductoList />),
      this.state.productos.map((producto, i) => (
        <tr key={producto.IdProducto}>
          <td>
            {
              <Button onClick={() => this.onEdit(producto)} variant="link">
                Seleccionar
              </Button>
            }
          </td>
          <td>{producto.IdProducto}</td>
          <td>{producto.DescripcionProducto}</td>
          <td>{producto.categoriaProducto.DescripcionCategoriaProducto}</td>
          <td>{producto.CantidadProducto}</td>
          <td>{formatter.format(producto.PrecioProducto)}</td>
        </tr>
      ))
    );
  }
}
class CategoriaList extends Component {
  constructor() {
    super();
    this.state = {
      CategoriaProductos: [],
      CategoriaProducto: [],
    };
  }
  GetCategorias() {
    request
      .get(rutaGetCategoria)
      .set("token", token)
      .end((err, res) => {
        const CategoriaProductos = JSON.parse(res.text);
        if (CategoriaProductos.error) {
          localStorage.removeItem("jwt-token");
          window.location.reload();
        } else {
          this.setState({
            CategoriaProductos: CategoriaProductos,
          });
        }
      });
  }
  componentDidMount() {
    this.GetCategorias();
  }

  onEdit(CategoriaProducto) {
    this.setState({ CategoriaProducto: CategoriaProducto });
    document.getElementById("TbIdCategoria").value =
      CategoriaProducto.IdCategoriaProducto;
    document.getElementById("TbDescripcionCategoria").value =
      CategoriaProducto.DescripcionCategoriaProducto;
  }

  render() {
    return this.state.CategoriaProductos.map((CategoriaProducto, i) => (
      <option
        key={CategoriaProducto.IdCategoriaProducto}
        value={CategoriaProducto.IdCategoriaProducto}
      >
        {CategoriaProducto.DescripcionCategoriaProducto}
      </option>
    ));
  }
}
export default class extends Component {
  render() {
    return (
      <Card>
        <Card.Title size="lg" className="mt-3" align="center">
          Catálogo Productos
        </Card.Title>
        <Card.Body>
          <Container>
            <ProductoAdd></ProductoAdd>
            <Table className="mt-5" responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Categoria</th>
                  <th>Cantidad Disponible</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                <ProductoList></ProductoList>
              </tbody>
            </Table>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
