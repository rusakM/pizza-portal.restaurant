import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { formatFullDate } from "../../utils/formatDate";

const MessagesListRow = ({ item, reply, markAsRead }) => (
  <li className="wrapper">
    <div className="flex-row round-border wrapper">
      <div styles={{ width: "75%", padding: "0.5em" }}>
        <h6>{formatFullDate(item.createdAt)}</h6>
        <h6>
          {item.name}&nbsp;&lt;{item.email}&gt;
        </h6>
        {item.phoneNumber && (
          <p>
            <FontAwesomeIcon icon={faPhone} />
            &nbsp;{item.phoneNumber}
          </p>
        )}
        <p>{item.message}</p>
        {item.isReplied && <p className="wrapper">Odp:&nbsp;{item.reply}</p>}
      </div>
      <div styles={{ width: "25%", padding: "0.5em" }}>
        {item.readAt && <p>Wyświetlone: {formatFullDate(item.readAt)}</p>}
        {item.repliedAt && (
          <p>Odpowiedź wysłano: {formatFullDate(item.repliedAt)}</p>
        )}
        {!item.isRead && (
          <Button onClick={() => markAsRead(item._id)}>
            Oznacz jako przeczytane
          </Button>
        )}
        {!item.isReplied && (
          <Button onClick={() => reply(item._id)}>Wyślij odpowiedź</Button>
        )}
      </div>
    </div>
  </li>
);

export default MessagesListRow;
