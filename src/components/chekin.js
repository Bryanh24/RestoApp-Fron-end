import React, { Component } from "react";
import {
  Card,
  Container,
  Table,
  Form,
  Col,
  Row,
  Button,
  Nav,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import request from "superagent";
import { getJwt } from "../helpers/jwtHelper";

const token = getJwt();
const ruta = "https://restoapp-backend.herokuapp.com/api/categoriaPlato";
const rutaGetPlato = "https://restoapp-backend.herokuapp.com/api/plato/get";
const rutaGetProducto = "https://restoapp-backend.herokuapp.com/api/producto/get";
const rutaGetCategoriaProducto = "https://restoapp-backend.herokuapp.com/api/categoriaProducto";
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

class CardCategoriaPlatos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CategoriaPlatos: [],
      Platos: [],
      IdCategoriaPlato: 1,
      CategoriaProductos: [],
      Productos: [],
      IdCategoriaProducto: 1,
      DescripcionMesa: "",
      rows: [],
      rowsProduct: [],
    };
  }

  handleAddPlatoRow = (plato) => {
    this.setState({
      rows: [...this.state.rows, plato],
    });
  };
  handleAddProductoRow = (producto) => {
    debugger;
    const item = {
      Cantidad: 1,
      DespcripcionProducto: producto.DescripcionProducto,
      PrecioProducto: producto.PrecioProducto,
    };
    this.setState({
      rowsProduct: [...this.state.rowsProduct, item],
    });
  };
  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
  };
  addCantidad = (idx) => () => {
    this.state.rowsProduct[idx].Cantidad += 1;
    console.log(this.state.rowsProduct[idx].Cantidad);
  };
  handleRemoveSpecificRowProducto = (idx) => () => {
    const rowsProduct = [...this.state.rowsProduct];
    rowsProduct.splice(idx, 1);
    this.setState({ rowsProduct });
  };

  componentDidMount() {
    this.GetCategorias();
    this.getPlatos();
    this.GetCategoriaProductos();
    this.getProductos();
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
  getPlatos() {
    request
      .post(rutaGetPlato)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("token", token)
      .send({ IdCategoriaPlato: this.state.IdCategoriaPlato })
      .end((err, res) => {
        const Platos = JSON.parse(res.text);
        if (Platos.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            Platos: Platos,
          });
        }
      });
  }
  getProductos() {
    request
      .post(rutaGetProducto)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("token", token)
      .send({ IdCategoriaProducto: this.state.IdCategoriaProducto })
      .end((err, res) => {
        const Productos = JSON.parse(res.text);
        if (Productos.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            Productos: Productos,
          });
        }
      });
  }
  onChangeSelect = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      this.getPlatos
    );
  };
  onChangeCategoriaProducto = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      this.getProductos
    );
  };
  GetCategoriaProductos() {
    request
      .get(rutaGetCategoriaProducto)
      .set("token", token)
      .end((err, res) => {
        const CategoriaProductos = JSON.parse(res.text);
        if (CategoriaProductos.error) {
          localStorage.removeItem("token-jwt");
          window.location.reload();
        } else {
          this.setState({
            CategoriaProductos: CategoriaProductos,
          });
        }
      });
  }
  render() {
    const catrgorias = this.state.CategoriaPlatos.map((CategoriaPlato, i) => (
      <option
        key={CategoriaPlato.IdCategoriaPlato}
        value={CategoriaPlato.IdCategoriaPlato}
      >
        {CategoriaPlato.DescripcionCategoriaPlato}
      </option>
    ));
    const categoriaProducto = this.state.CategoriaProductos.map(
      (CategoriaProducto, i) => (
        <option
          key={CategoriaProducto.IdCategoriaProducto}
          value={CategoriaProducto.IdCategoriaProducto}
        >
          {CategoriaProducto.DescripcionCategoriaProducto}
        </option>
      )
    );
    const platos = this.state.Platos.map((plato, i) => (
      <tr key={plato.IdPlato}>
        <td>
          {
            <Button
              variant="warning"
              onClick={() => this.handleAddPlatoRow(plato)}
            >
              +
            </Button>
          }
        </td>
        <td>{plato.NombrePlato}</td>
        <td>{plato.DescripcionPlato}</td>
        <td>{formatter.format(plato.PrecioPlato)}</td>
      </tr>
    ));
    const productos = this.state.Productos.map((producto, i) => (
      <tr key={producto.IdProducto}>
        <td>
          {
            <Button
              onClick={() => this.handleAddProductoRow(producto)}
              variant="warning"
            >
              +
            </Button>
          }
        </td>
        <td>{producto.DescripcionProducto}</td>
        <td>{formatter.format(producto.PrecioProducto)}</td>
      </tr>
    ));
    return (
      <div className="Container-fluid">
        <h2 className="text-center">{this.props.descripcionMesa}</h2>
        <Row>
          <Col className="overflow-auto" lg="6">
            <Card border="primary" mb="4" className="m-3 mw-100 overflow-auto">
              <Card.Header className="text-center">
                <h5>Platillos</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Categorías de Platillos</Form.Label>
                    <Form.Control
                      id="DDIdCategoriaPlato"
                      name="IdCategoriaPlato"
                      onChange={this.onChangeSelect}
                      as="select"
                      custom
                    >
                      {catrgorias}
                    </Form.Control>
                  </Form.Group>
                </Form>
                <Table
                 style = {{height:"100px"}}
                  className="mt-5"
                  responsive
                  striped
                  bordered
                  hover
                  size="sm"
                >
                  <thead>
                    <tr>
                      <th>Agregar</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>{platos}</tbody>
                </Table>
              </Card.Body>
            </Card>
            <Card border="success" className="m-3 mw-100 overflow-auto">
              <Card.Header className="text-center">
                <h5>Productos</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Categorías de Platillos</Form.Label>
                    <Form.Control
                      id="DDIdCategoriaProducto"
                      name="IdCategoriaProducto"
                      onChange={this.onChangeCategoriaProducto}
                      as="select"
                      custom
                    >
                      {categoriaProducto}
                    </Form.Control>
                  </Form.Group>
                </Form>
                <Table
                  className="mt-5"
                  responsive
                  striped
                  bordered
                  hover
                  size="sm"
                >
                  <thead>
                    <tr>
                      <th>Agregar</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>{productos}</tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6">
            <Table id="tablaComanda" responsive>
              <thead>
                <tr>
                  <th>Cantidad</th>
                  <th>Referencia</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                  <th>Cancelar</th>
                </tr>
              </thead>
              <tbody>
                {this.state.rows.map((item, idx) => (
                  <tr id="addr0" key={idx}>
                    <td>1</td>
                    <td>{item.DescripcionPlato}</td>
                    <td>{item.PrecioPlato}</td>
                    <td>{}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={this.handleRemoveSpecificRow(idx)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
                {this.state.rowsProduct.map((item, idx) => (
                  <tr id="addr0" key={idx}>
                    <td>
                      <button
                        type="button"
                        className="ml-3 mr-3 btn btn-danger btn-circle btn-sm"
                      >
                        -
                      </button>
                      {item.Cantidad}
                      <button
                        type="button"
                        className="ml-3 mr-3 btn btn-success btn-circle btn-sm"
                        onClick={this.addCantidad(idx)}
                      >
                        +
                      </button>
                    </td>
                    <td>{item.DespcripcionProducto}</td>
                    <td>{this.state.rowsProduct[idx].PrecioProducto}</td>
                    <td>
                      {this.state.rowsProduct[idx].Cantidad *
                        this.state.rowsProduct[idx].PrecioProducto}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={this.handleRemoveSpecificRowProducto(idx)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CardCategoriaPlatos;
