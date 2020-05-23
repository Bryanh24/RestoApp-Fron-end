import React, { Component } from "react";
import {
  Card,
  Container,
  Table,
  Form,
  Col,
  Button,
  CardColumns,
  Row,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import request from "superagent";

const rutaLogin = "https://restoapp-backend.herokuapp.com/api/empleado/login";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      UsuarioEmpleado: "",
      PasswordEmpleado: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    request
      .post(rutaLogin)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({ UsuarioEmpleado: this.state.UsuarioEmpleado })
      .send({ PasswordEmpleado: this.state.PasswordEmpleado })
      .end((err, res) => {
        const token = JSON.parse(res.text);
        console.log(token);

        if (token.succes) {
          localStorage.setItem("token-jwt", token.succes);
          window.location.reload(); 
        }
        if (token.error) {
        }
      });
  }
  render() {
    return (
      <Card className="text-center">
        <Card.Header>RestoApp</Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => this.onSubmit(e)}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                name="UsuarioEmpleado"
                type="text"
                placeholder="Usuario"
                onChange={this.onChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                name="PasswordEmpleado"
                type="password"
                placeholder="Contraseña"
                onChange={this.onChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Inicias Sesión
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-muted">
          Todos los derechos Reservados.
        </Card.Footer>
      </Card>
    );
  }
}
export default Login;
