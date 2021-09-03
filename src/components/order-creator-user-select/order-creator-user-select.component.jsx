import React from "react";
import axios from "axios";

import { Form, Container, Button } from "react-bootstrap";

class OrderCreatorUserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultsList: [],
      searchField: "",
    };
  }

  changeHandler = (event) => {
    this.setState({
      searchField: event.target.value,
    });
  };

  submitHandler = async (event) => {
    event.preventDefault();
    try {
      const users = await axios({
        method: "GET",
        url: `/api/users/find-users/${this.state.searchField}`,
      });

      this.setState({
        resultsList: users.data.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { searchField, resultsList } = this.state;
    return (
      <Container>
        <Form onSubmit={this.submitHandler} className="flex-row">
          <Form.Control
            type="search"
            value={searchField}
            onChange={this.changeHandler}
          />
          <Button type="submit">Szukaj</Button>
        </Form>
        {resultsList.length > 0 && (
          <ul className="list list-scroll">
            {resultsList.map((result) => (
              <li className="flex-row" key={result._id}>
                <div className="small-img">
                  <img src={`/uploads/users/${result.photo}`} alt="" />
                </div>
                <div className="no-padding">
                  <h3>{result.name}</h3>
                  <p>{result.email}</p>
                </div>
                <Button onClick={() => this.props.select(result)}>
                  Wybierz
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Container>
    );
  }
}

export default OrderCreatorUserSelect;
