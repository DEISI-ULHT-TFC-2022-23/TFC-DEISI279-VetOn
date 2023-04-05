import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function Authentication() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [image, setImage] = useState("");
  const [isRegisterOrLogin, setIsRegisterOrLogin] = useState("register");
  const { setUsername: setLoggedInUsername, setUserId } =
    useContext(UserContext);

  async function submit(event) {
    event.preventDefault();
    if (isRegisterOrLogin === "register") {
      const res = await axios.post("/register", { email, username, password });
      setUserId(res.data.id);
      setLoggedInUsername(username);
      navigate("/");
    } else if (isRegisterOrLogin === "login") {
      const res = await axios.post("/login", { username, password });
      setUserId(res.data.id);
      setLoggedInUsername(username);
      navigate("/");
    }
  }

  return (
    <div className="bg-green-100 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/"}>
            <img src="./src/assets/logo.png" alt="" />
          </Link>
        </div>
        {isRegisterOrLogin === "register" && (
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="email"
            className="block w-full rounded-sm p-2 mb-2 border"
          />
        )}
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        {/* <input
                    value={image}
                    onChange={(ev) => setImage(ev.target.value)}
                    type="file"
                    className="block w-full rounded-sm p-2 mb-2"
                /> */}
        <button className="bg-green-500 text-white block w-full rounded-sm p-2">
          {isRegisterOrLogin === "register" ? "Registar" : "Login"}
        </button>
        {isRegisterOrLogin === "register" && (
          <div className="text-center mt-2">
            Ja tem conta?
            <button onClick={() => setIsRegisterOrLogin("login")}>
              Faca o Login aqui
            </button>
          </div>
        )}
        {isRegisterOrLogin === "login" && (
          <div className="text-center mt-2">
            Nao tem conta?
            <button onClick={() => setIsRegisterOrLogin("register")}>
              Registe-se aqui
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
