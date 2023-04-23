import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";

export default function Authentication() {
  const { setUsername: setLoggedInUsername, setUserId } =
    useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isRegisterOrLogin, setIsRegisterOrLogin] = useState("login");
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    if (isRegisterOrLogin === "register") {
      const res = await axios.post("/register", {
        email,
        username,
        password,
      });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setUserId(res.data.id);
        setLoggedInUsername(username);
        navigate("/");
      }
    } else if (isRegisterOrLogin === "login") {
      const res = await axios.post("/login", {
        username,
        password,
      });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        if (res.data.type === "admin") {
          setUserId(res.data.id);
          setLoggedInUsername(username);
          navigate("/admin");
        }
        if (res.data.type === "user") {
          setUserId(res.data.id);
          setLoggedInUsername(username);
          navigate("/");
        }
        if (res.data.type === "support") {
          setUserId(res.data.id);
          setLoggedInUsername(username);
          navigate("/support");
        }
      }
    }
  }

  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/"}>
            <img src="./src/assets/logo.png" alt="" />
          </Link>
        </div>
        {error !== null && (
          <div className="font-poppins p-2 my-5 bg-red-500 text-white rounded-full text-center ">
            {error}
          </div>
        )}
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
        {isRegisterOrLogin === "register" && (
          <div>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              placeholder="confirmar password"
              className="block w-full rounded-sm p-2 mb-4 border"
            />
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={password}
              valueAgain={confirmPassword}
              className="font-poppins text-sm text-black font-bold"
              messages={{
                minLength: "Pelo menos 8 caracteres",
                specialChar: "Pelo menos um caracter especial",
                number: "Pelo menos 1 numero",
                capital: "Pelo menos uma letra maiuscula",
                match: "As password estao iguais",
              }}
            />
          </div>
        )}

        <button className="bg-primary text-white block w-full rounded-sm p-2 mt-4">
          {isRegisterOrLogin === "register" ? "Registar" : "Login"}
        </button>
        {isRegisterOrLogin === "register" && (
          <div className="text-center mt-2">
            Ja tem conta?&nbsp;
            <button
              className="font-semibold underline"
              onClick={() => setIsRegisterOrLogin("login")}
            >
              Faca o Login aqui
            </button>
          </div>
        )}
        {isRegisterOrLogin === "login" && (
          <div>
            <div className="text-center mt-2">
              Nao tem conta?&nbsp;
              <button
                className="font-semibold underline"
                onClick={() => setIsRegisterOrLogin("register")}
              >
                Registe-se aqui
              </button>
            </div>
            <div className="text-center mt-2">
              Esqueceu-se da password?
              <Link to={"/forgot-password"}>
                <button className="font-semibold underline">
                  Redefina aqui
                </button>
              </Link>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}