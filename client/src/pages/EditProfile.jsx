import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PasswordChecklist from "react-password-checklist";
import { UserContext } from "../UserContext";

export default function EditProfile() {
  const { setUsername: setLoggedInUsername } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameMessage, setUsernameMessage] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [photoMessage, setPhotoMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [toggleButton, setToggleButton] = useState(true);

  async function submitEmail(event) {
    event.preventDefault();

    const res = await axios.post("/edit-email", {
      email,
    });
    if (res.data.message) {
      setEmailMessage(res.data.message);
    }
    if (res.data.error) {
      setEmailError(res.data.error);
    }
    setInterval(() => {
      setEmailError(null);
    }, 2000);
    setInterval(() => {
      setEmailMessage(null);
    }, 2000);
    setEmail("");
  }

  async function submitUsername(event) {
    event.preventDefault();
    if (username == "") {
      alert("Preencha o campo corretamente");
    } else {
      const res = await axios.post("/edit-username", {
        username,
      });
      if (res.data.message) {
        setUsernameMessage(res.data.message);
      }
      setLoggedInUsername(username);
      setInterval(() => {
        setUsernameMessage(null);
      }, 3000);
      setUsername("");
    }
  }

  async function submitPassword(event) {
    event.preventDefault();
    if (currentPassword == "" || password == "") {
      alert("Preencha os campos corretamente");
    } else {
      const res = await axios.post("/edit-password", {
        currentPassword,
        password,
      });
      if (res.data.message) {
        setPasswordMessage(res.data.message);
      }
      if (res.data.error) {
        setPasswordError(res.data.error);
      }
      setInterval(() => {
        setPasswordMessage(null);
      }, 3000);
      setInterval(() => {
        setPasswordError(null);
      }, 3000);
      setPassword("");
      setCurrentPassword("");
      setConfirmPassword("");
    }
  }

  async function submitPhoto(event) {
    event.preventDefault();
    if (addedPhotos.length == 0) {
      alert("Selecione uma foto");
    } else {
      const res = await axios.post("/edit-photo", {
        addedPhotos,
      });
      if (res.data.message) {
        setPhotoMessage(res.data.message);
      }
      setInterval(() => {
        setPhotoMessage(null);
      }, 3000);
      setAddedPhotos([]);
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
    <div className="bg-gray-300 h-screen flex flex-col items-center justify-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submitEmail}>
        <div className="flex justify-center mb-4">
          <Link to={"/profile"}>
            <img
              src={"https://vet-on.s3.amazonaws.com/logo_small.png"}
              alt=""
            />
          </Link>
        </div>
        {emailMessage !== null && (
          <div className="font-poppins p-2 my-5 bg-primary text-white rounded-full text-center ">
            {emailMessage}
          </div>
        )}
        {emailError !== null && (
          <div className="font-poppins p-2 my-5 bg-red-500 text-white rounded-full text-center ">
            {emailError}
          </div>
        )}
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
          className="block w-full rounded-sm p-2 mb-2 border"
        />

        <button className="bg-primary text-white block w-full rounded-sm p-2">
          Alterar email
        </button>
      </form>
      <form className="w-64 mx-auto mb-12" onSubmit={submitUsername}>
        {usernameMessage !== null && (
          <div className="font-poppins p-2 my-5 bg-primary text-white rounded-full text-center ">
            {usernameMessage}
          </div>
        )}
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          placeholder="Username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />

        <button className="bg-primary text-white block w-full rounded-sm p-2">
          Alterar username
        </button>
      </form>
      <form className="w-64 mx-auto mb-12" onSubmit={submitPassword}>
        {passwordMessage !== null && (
          <div className="font-poppins p-2 my-5 bg-primary text-white rounded-full text-center ">
            {passwordMessage}
          </div>
        )}
        {passwordError !== null && (
          <div className="font-poppins p-2 my-5 bg-red-500 text-white rounded-full text-center ">
            {passwordError}
          </div>
        )}
        <input
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          type="password"
          placeholder="Password atual"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Nova password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />

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
            capital: "Pelo menos uma caracter maiúsculo",
            match: "As password estão iguais",
          }}
        />
        <button className="bg-primary text-white block w-full rounded-sm p-2 mt-5 mb-5">
          Alterar password
        </button>
      </form>
      <form className="w-64 mx-auto mb-12" onSubmit={submitPhoto}>
        {photoMessage !== null && (
          <div className="font-poppins p-2 my-5 bg-primary text-white rounded-full text-center ">
            {photoMessage}
          </div>
        )}
        <label className="flex justify-center gap-2 w-full rounded-sm p-2 border bg-white text-black">
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
        {toggleButton && (
          <button className="bg-primary text-white block w-full rounded-sm p-2">
            Alterar foto
          </button>
        )}
      </form>
    </div>
  );
}
