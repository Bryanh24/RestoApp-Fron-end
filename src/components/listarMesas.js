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
import { getJwt } from "../helpers/jwtHelper";
import history from "../helpers/history";
import Checkin from "./chekin";

const token = getJwt();
const ruta = "http://localhost:3000/api/mesa";

export default class extends Component {
  constructor() {
    super();
    this.state = {
      mesas: [],
      mesa: [],
      DescripcionMesa: "MESA 2",
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
  goToCheckin = (mesa) => {
    this.setState(
      { DescripcionMesa: mesa.DescripcionMesa },
      this.props.descripcionMesa(this.state.DescripcionMesa)
    );
  };

  componentDidMount() {
    this.GetMesas();
  }

  render() {
    const mesas = this.state.mesas.map((mesa, i) => (
      <Col lg="6">
        <Button
          className="m-3"
          onClick={() => this.goToCheckin({ mesa })}
          block
          size="lg"
          lg="6"
          key={mesa.IdMesa}
          variant="outline-primary"
        >
          {mesa.DescripcionMesa}
        </Button>
      </Col>
    ));
    return (
      <div className="container">
        <Row>{mesas}</Row>
      </div>
    );
  }
}
