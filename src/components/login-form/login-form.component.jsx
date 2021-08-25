import React from "react";
import axios from "axios";

import { Form, Button, Container } from "react-bootstrap";

import Alert from "../alert/alert.component";
import LoadingScreen from "../loading-screen/loading-screen.component";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loginAlertVisible: false,
      loginErrorMessage: "",
      loadingData: false,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  toggleLoginAlert = () => {
    this.setState({
      loginAlertVisible: !this.state.loginAlertVisible,
    });
  };

  login = async () => {
    const { email, password } = this.state;

    try {
      const user = await axios({
        method: "POST",
        url: "/api/users/loginAdmin",
        data: {
          email,
          password,
        },
      });
      this.props.loginUser(user.data.data.user, user.data.tokenExpires);
    } catch (error) {
      console.log(error);
      this.setState({
        loginAlertVisible: true,
        loginErrorMessage:
          error?.response.data?.message || error?.response?.statusText,
        loadingData: false,
        password: "",
        errorData: error,
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    await this.login();
  };

  render() {
    const { email, password, loadingData, loginErrorMessage } = this.state;
    return (
      <Container className="screen-container">
        {loadingData && <LoadingScreen>Logowanie...</LoadingScreen>}
        <h1 className="offset-3">Zaloguj się:</h1>
        <Form className="col-6 offset-3" onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="email"
              value={email}
              type="email"
              onChange={this.handleChange}
            />
            <Form.Label>Email</Form.Label>
          </Form.Group>
          <Form.Group>
            <Form.Control
              name="password"
              value={password}
              type="password"
              onChange={this.handleChange}
            />
            <Form.Label>Hasło</Form.Label>
          </Form.Group>
          <Button variant="primary" type="submit">
            Zaloguj
          </Button>
        </Form>
        {this.state.loginAlertVisible && (
          <Alert close={this.toggleLoginAlert}>{loginErrorMessage}</Alert>
        )}
      </Container>
    );
  }
}

export default LoginForm;
