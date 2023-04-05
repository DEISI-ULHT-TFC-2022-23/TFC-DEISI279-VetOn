import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Client from "../components/Client";
import { Link } from "react-router-dom";

export default function Chat() {
  const { userId, setUserId, username, setUsername } = useContext(UserContext);
  const [socketServer, setSocketServer] = useState(null);
  const [onlineClients, setOnlineClients] = useState({});
  const [offlineClients, setOfflineClients] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollDivRef = useRef();

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4000");
    setSocketServer(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  useEffect(() => {
    connectToWs();
  }, []);

  useEffect(() => {
    axios.get("/clients").then((response) => {
      const offlineClientsArray = response.data.filter(
        (client) =>
          client._id !== userId &&
          !Object.keys(onlineClients).includes(client._id)
      );
      const clients = {};
      offlineClientsArray.forEach((client) => {
        clients[client._id] = client;
      });
      setOfflineClients(clients);
    });
  }, [onlineClients]);

  function allOnlineClients(clientsDupped) {
    const clients = {};
    clientsDupped.forEach(({ userId, username }) => {
      clients[userId] = username;
    });
    setOnlineClients(clients);
  }

  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      allOnlineClients(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedContact) {
        setMessages((allMessages) => [...allMessages, { ...messageData }]);
      }
    }
  }

  function sendMessage(event, file = null) {
    if (event) event.preventDefault();

    socketServer.send(
      JSON.stringify({
        recipient: selectedContact,
        text: newMessage,
        file,
      })
    );

    if (file) {
      axios.get("/messages/" + selectedContact).then((response) => {
        setMessages(response.data);
      });
    } else {
      setNewMessage("");
      setMessages((allMessages) => [
        ...allMessages,
        {
          _id: Date.now(),
          sender: userId,
          recipient: selectedContact,
          text: newMessage,
        },
      ]);
    }
  }

  function uploadFile(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        fileName: event.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const scrollDiv = scrollDivRef.current;
    if (scrollDiv) {
      scrollDiv.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedContact) {
      axios.get("/messages/" + selectedContact).then((response) => {
        setMessages(response.data);
      });
    }
  }, [selectedContact]);

  const onlyOtherOnlineClients = { ...onlineClients };
  delete onlyOtherOnlineClients[userId];

  const messagesSet = uniqBy(messages, "_id");

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/5 flex flex-col">
        <div className="flex-grow">
          <Link to={"/"} onClick={() => setSocketServer(null)}>
            <img
              className="py-4 pl-4"
              src="./src/assets/logo.png"
              alt="VetOn Logo"
            />
          </Link>

          {Object.keys(onlyOtherOnlineClients).map((userId) => (
            <Client
              key={userId}
              clientId={userId}
              username={onlyOtherOnlineClients[userId]}
              onClick={() => setSelectedContact(userId)}
              selected={userId === selectedContact}
              online={true}
            />
          ))}
          {Object.keys(offlineClients).map((userId) => (
            <Client
              key={userId}
              clientId={userId}
              username={offlineClients[userId].username}
              onClick={() => setSelectedContact(userId)}
              selected={userId === selectedContact}
              online={false}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col bg-green-100 w-4/5 p-2">
        <div className="flex-grow">
          {!selectedContact && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">&larr; Selecione um contacto</div>
            </div>
          )}
          {!!selectedContact && (
            <div className="relative h-full">
              <div className="absolute top-0 left-0 right-0 bottom-2 overflow-y-scroll [@media(max-width:1920px)]:scrollbar-hide">
                {messagesSet.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === userId ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "inline-block text-left p-2 my-2 rounded-md " +
                        (message.sender === userId
                          ? "bg-green-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {message.text}
                      {message.file && (
                        <div>
                          <a
                            target="_blank"
                            className="flex items-center gap-1 underline"
                            href={
                              axios.defaults.baseURL +
                              "/uploads/" +
                              message.file
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                              />
                            </svg>
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={scrollDivRef}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedContact && (
          <form className="flex gap-2 items-center" onSubmit={sendMessage}>
            <input
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              type="text"
              placeholder="Escreve a tua mensagem..."
              className="bg-white flex-grow border rounded-sm p-2"
            />
            <label type="button" className="mt-2 cursor-pointer">
              <input type="file" onChange={uploadFile} className="hidden" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-green-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
