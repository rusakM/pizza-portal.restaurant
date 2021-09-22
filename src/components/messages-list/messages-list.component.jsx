import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

import LISTS from "./messages-lists";
import MessagesListRow from "../messages-list-row/messages-list-row.component";
import Alert from "../alert/alert.component";
import MessageReply from "../message-reply/message-reply.component";

class MessagesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      activeList: "all",
      page: 1,
      isVisibleReply: false,
      activeMessage: null,
    };
  }

  async componentDidMount() {
    try {
      const messages = await axios({
        method: "GET",
        url: "/api/messages?limit=25",
      });

      this.setState({
        messages: messages.data.data.data,
      });
    } catch (error) {}
  }

  getMessages = async (list, page) => {
    try {
      let url = `/api/messages?limit=25&page=${page}&sort=-createdAt`;
      if (list === LISTS.unreplied) {
        url += "&isReplied=false";
      } else if (list === LISTS.unread) {
        url += "&isRead=false";
      }

      const newMessages = await axios({
        url,
        method: "GET",
      });
      let messages = [];
      if (page > 1) {
        messages = [...this.state.messages, ...newMessages.data.data.data];
      } else {
        messages = newMessages.data.data.data;
      }
      this.setState({
        messages,
        activeList: list,
        page,
      });
    } catch (error) {}
  };

  getMessageNum = (id) => {
    const { messages } = this.state;
    let messageNum = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i]._id === id) {
        messageNum = i;
        break;
      }
    }
    return messageNum;
  };

  markAsRead = async (id) => {
    try {
      const { messages, activeList } = this.state;
      let messageNum = this.getMessageNum(id);

      if (messages[messageNum].isRead) {
        return;
      }
      const message = await axios({
        method: "PATCH",
        url: `/api/messages/${id}/read`,
      });
      if (activeList === LISTS.unread) {
        messages.splice(messageNum, 1);
      } else {
        messages[messageNum] = message.data.data.data;
      }

      this.setState({
        messages,
      });
    } catch (error) {}
  };

  openReplyPopup = (id) => {
    const { messages } = this.state;
    const num = this.getMessageNum(id);
    const activeMessage = messages[num];

    if (id === activeMessage._id) {
      this.setState({
        isVisibleReply: true,
        activeMessage,
      });
    }
  };

  closeReplyPopup = () => {
    this.setState({
      isVisibleReply: false,
      activeMessage: null,
    });
  };

  sendReply = async (replyMessage) => {
    try {
      const { activeMessage, messages, activeList } = this.state;

      if (activeMessage.isReplied || !replyMessage) {
        return;
      }

      const reply = await axios({
        method: "PATCH",
        url: `/api/messages/${activeMessage._id}/reply`,
        data: {
          reply: replyMessage,
        },
      });

      const num = this.getMessageNum(activeMessage._id);
      if (activeList === LISTS.all) {
        messages[num] = reply.data.data.data;
      }
      if (activeList === LISTS.unreplied) {
        messages.splice(num, 1);
      }

      this.setState({
        messages,
        activeMessage: null,
        isVisibleReply: false,
      });
    } catch (error) {}
  };

  render() {
    const { activeList, page, messages, isVisibleReply, activeMessage } =
      this.state;
    return (
      <div className="wrapper">
        <div className="flex-row">
          <Button onClick={() => this.getMessages(LISTS.all, 1)}>
            Wszystkie
          </Button>
          <Button onClick={() => this.getMessages(LISTS.unread, 1)}>
            Nieprzeczytane
          </Button>
          <Button onClick={() => this.getMessages(LISTS.unreplied, 1)}>
            Bez odpowiedzi
          </Button>
        </div>
        <ul className="list wrapper">
          {messages.map((item, num) => (
            <MessagesListRow
              item={item}
              key={item._id}
              reply={() => this.openReplyPopup(item._id, num)}
              markAsRead={this.markAsRead}
            />
          ))}
        </ul>
        <div className="centered-content">
          <Button onClick={() => this.getMessages(activeList, page + 1)}>
            Pobierz starsze wiadomości
          </Button>
        </div>
        {isVisibleReply && (
          <Alert close={this.closeReplyPopup} closeBtn={true}>
            <MessageReply
              read={this.markAsRead}
              sendReply={this.sendReply}
              message={activeMessage}
            />
          </Alert>
        )}
      </div>
    );
  }
}

export default MessagesList;
