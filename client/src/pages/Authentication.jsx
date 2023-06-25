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
  const [toggleButton, setToggleButton] = useState(true);
  const [error, setError] = useState(null);
  const [isRegisterOrLogin, setIsRegisterOrLogin] = useState("login");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    if (isRegisterOrLogin === "register") {
      const res = await axios.post("/register", {
        email,
        username,
        password,
        addedPhotos,
      });
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setUserId(res.data.id);
        setLoggedInUsername(username);
        setAddedPhotos([]);
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
        if (res.data.type === "doctor") {
          setUserId(res.data.id);
          setLoggedInUsername(username);
          navigate("/doctor");
        }
      }
    }
  }

  function uploadPhoto(ev) {
    ev.preventDefault();
    setAddedPhotos([]);
    setToggleButton(false);
    const files = ev.target.files;
    const data = new FormData();
    data.append("photo", files[0]);

    axios.post("/upload", data).then((response) => {
      const { data: filename } = response;
      setAddedPhotos((prev) => {
        return [...prev, filename];
      });
      setToggleButton(true);
    });
  }

  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/"}>
            <img
              src={"https://vet-on.s3.amazonaws.com/logo_small.png"}
              alt=""
            />
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
            placeholder="Email"
            className="block w-full rounded-sm p-2 mb-2 border"
          />
        )}
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          placeholder="Username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        {isRegisterOrLogin === "register" && (
          <div>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              placeholder="Confirmar password"
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
                number: "Pelo menos 1 número",
                capital: "Pelo menos um caracter maiúsculo",
                match: "As password estão iguais",
              }}
            />
            <label className="flex justify-center gap-2 w-full rounded-sm p-2 mb-2 mt-4 border bg-white text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
              Escolha um ficheiro
              <input type="file" className="hidden" onChange={uploadPhoto} />
            </label>
          </div>
        )}

        {toggleButton && (
          <button
            id="button"
            className="bg-primary text-white block w-full rounded-sm p-2 mt-4"
          >
            {isRegisterOrLogin === "register" ? "Registar" : "Login"}
          </button>
        )}

        {isRegisterOrLogin === "register" && (
          <div className="text-center mt-2">
            Já tem conta?&nbsp;
            <button
              className="font-semibold underline"
              onClick={() => setIsRegisterOrLogin("login")}
            >
              Faça o Login aqui
            </button>
          </div>
        )}
        {isRegisterOrLogin === "login" && (
          <div>
            <div className="text-center mt-2">
              Não tem conta?&nbsp;
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
