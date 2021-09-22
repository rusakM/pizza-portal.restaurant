import React from "react";
import { Button, Form } from "react-bootstrap";
import { formatFullDate } from "../../utils/formatDate";

class MessageReply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replyMessage: "",
    };
  }

  async componentDidMount() {
    await this.props.read(this.props.message._id);
  }

  changeHandler = (event) => {
    this.setState({
      replyMessage: event.target.value,
    });
  };

  render() {
    const { message, sendReply } = this.props;
    return (
      <div className="wrapper">
        <h3>Wyślij odpowiedź na wiadomość:</h3>
        <p>{formatFullDate(message.createdAt)}</p>
        <h6>
          Do:&nbsp;{message.name}&nbsp;&lt;{message.email}&gt;
        </h6>
        <p className="wrapper">{message.message}</p>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            sendReply(this.state.replyMessage);
          }}
        >
          <Form.Control
            as="textarea"
            value={this.state.replyMessage}
            onChange={this.changeHandler}
          />
          <Button type="submit">Wyślij</Button>
        </Form>
      </div>
    );
  }
}

export default MessageReply;
