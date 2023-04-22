import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

export default function EditProfile() {
  const { id } = useParams();
  const { setUsername: setAccountUsername } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  console.log(id);

  async function submitEmail(event) {
    event.preventDefault();
  }

  async function submitUsername(event) {
    event.preventDefault();
    axios
      .patch("/edit-username/" + id, {
        username,
      })
      .then((response) => {
        setAccountUsername(response.data.username);
      });
  }

  async function submitPassword(event) {
    event.preventDefault();
  }

  return (
    <div className="bg-gray-300 h-screen flex flex-col items-center justify-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submitEmail}>
        <div className="flex justify-center mb-4">
          <Link to={"/"}>
            <img src="../src/assets/logo.png" alt="" />
          </Link>
        </div>

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

        <button className="bg-primary text-white block w-full rounded-sm p-2">
          Alterar password
        </button>
      </form>
    </div>
  );
}
