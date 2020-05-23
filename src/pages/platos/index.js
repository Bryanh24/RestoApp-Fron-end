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
const ruta = "https://restoapp-backend.herokuapp.com/api/plato";
const rutaGetCategoria = "https://restoapp-backend.herokuapp.com/api/categoriaPlato";
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

class PlatoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IdPlato: 0,
      NombrePlato: "",
      DescripcionPlato: "",
      CategoriaPlato: 0,
      PrecioPlato: 0.0,
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.createPlato();
    console.log(this.props);
  };
  async createPlato() {
    if (document.getElementById("TbIdPlato").value === "") {
      request
        .post(ruta)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("token", token)
        .send({ NombrePlato: this.state.NombrePlato })
        .send({ DescripcionPlato: this.state.DescripcionPlato })
        .send({ IdCategoriaPlato: this.state.IdCategoriaPlato })
        .send({ PrecioPlato: parseFloat(this.state.PrecioPlato) })
        .end(function (err, res) {
          const plato = JSON.parse(res.text);
          if (plato.error) {
            localStorage.removeItem("token-jwt");
          }
          window.location.reload();
        });
    } else {
      request
        .put(ruta + "/" + document.getElementById("TbIdPlato").value)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send({ NombrePlato: document.getElementById("TbNombrePlato").value })
        .send({
          DescripcionPlato: document.getElementById("TbDescripcionPlato").value,
        })
        .send({
          IdCategoriaPlato: parseInt(
            document.getElementById("DdCategoriaPlato").value
          ),
        })
        .send({
          PrecioPlato: parseFloat(
            document.getElementById("TbPrecioPlato").value
          ),
        })
        .end(function (err, res) {
          const plato = JSON.parse(res.text);
          if (plato.error) {
            localStorage.removeItem("token-jwt");
          }
          window.location.reload();
        });
    }
  }

  deletePlato() {
    if (document.getElementById("TbIdPlato").value != null) {
      request
        .del(ruta + "/" + document.getElementById("TbIdPlato").value)
        .set("Accept", "application/json")
        .end(function (err, res) {
          const plato = JSON.parse(res.text);
          if (plato.error) {
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
              id="TbIdPlato"
              disabled
              size="sm"
              type="text"
              enabled="false"
            />
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              id="TbNombrePlato"
              name="NombrePlato"
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
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              id="TbDescripcionPlato"
              size="sm"
              type="text"
              placeholder="Descripción"
              name="DescripcionPlato"
              onChange={this.changeHandler}
            />
          </Form.Group>
          <Form.Group as={Col} lg="6">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              name="IdCategoriaPlato"
              onChange={this.changeHandler}
              id="DdCategoriaPlato"
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
              id="TbPrecioPlato"
              size="sm"
              type="text"
              placeholder="Descripción"
              name="PrecioPlato"
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
            onClick={this.deletePlato}
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

class PlatoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      platos: [],
      plato: [],
    };
    this.props = {
      getPlatos: this.GetPlatos(),
    };
  }
  GetPlatos() {
    request
      .get(ruta)
      .set("token", token)
      .end((err, res) => {
        const platos = JSON.parse(res.text);
        if (platos.error) {
          localStorage.removeItem("jwt-token");
          window.location.reload();
        } else {
          this.setState({
            platos: platos,
          });
        }
      });
  }
  componentDidMount() {
    this.GetPlatos();
  }

  onEdit(plato) {
    this.setState({ plato: plato });
    document.getElementById("TbIdPlato").value = plato.IdPlato;
    document.getElementById("TbNombrePlato").value = plato.NombrePlato;
    document.getElementById("TbDescripcionPlato").value =
      plato.DescripcionPlato;
    document.getElementById("DdCategoriaPlato").value =
      plato.categoriaPlato.IdCategoriaPlato;
    document.getElementById("TbPrecioPlato").value = plato.PrecioPlato;
  }

  render() {
    return (
      (<PlatoList />),
      this.state.platos.map((plato, i) => (
        <tr key={plato.IdPlato}>
          <td>
            {
              <Button onClick={() => this.onEdit(plato)} variant="link">
                Seleccionar
              </Button>
            }
          </td>
          <td>{plato.IdPlato}</td>
          <td>{plato.NombrePlato}</td>
          <td>{plato.DescripcionPlato}</td>
          <td>{plato.categoriaPlato.DescripcionCategoriaPlato}</td>
          <td>{formatter.format(plato.PrecioPlato)}</td>
        </tr>
      ))
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
      .get(rutaGetCategoria)
      .set("token", token)
      .end((err, res) => {
        const CategoriaPlatos = JSON.parse(res.text);
        if (CategoriaPlatos.error) {
          localStorage.removeItem("jwt-token")
          window.location.reload()
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
    return this.state.CategoriaPlatos.map((CategoriaPlato, i) => (
      <option
        key={CategoriaPlato.IdCategoriaPlato}
        value={CategoriaPlato.IdCategoriaPlato}
      >
        {CategoriaPlato.DescripcionCategoriaPlato}
      </option>
    ));
  }
}
export default class extends Component {
  render() {
    return (
      <Card>
        <Card.Title size="lg" className="mt-3" align="center">
          Catálogo Platillos
        </Card.Title>
        <Card.Body>
          <Container>
            <PlatoAdd></PlatoAdd>
            <Table className="mt-5" responsive striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                <PlatoList></PlatoList>
              </tbody>
            </Table>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}
