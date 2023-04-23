import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import axios from "axios";

export default function ResetPassword() {
  const { id, uniqueString } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function submit(event) {
    event.preventDefault();
    const res = await axios.post("/reset-password/" + id + "/" + uniqueString, {
      password,
    });
    if (res.data.error) {
      setMessage(null);
      setError(res.data.error);
    }
    if (res.data.message) {
      setError(null);
      setMessage(res.data.message);
    }
  }

  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/"}>
            <img src="/src/assets/logo.png" alt="" />
          </Link>
        </div>

        {error !== null && (
          <div className="font-poppins p-2 my-5 bg-red-500 text-white rounded-full text-center ">
            {error}
          </div>
        )}
        {message !== null && (
          <div className="font-poppins p-2 my-5 bg-primary text-white rounded-full text-center ">
            {message}
          </div>
        )}

        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />

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
            number: "Pelo menos 1 número",
            capital: "Pelo menos uma caracter maiúsculo",
            match: "As password estão iguais",
          }}
        />
        <button className="bg-primary text-white block w-full rounded-sm p-2 mt-4">
          Redefinir password
        </button>
      </form>
    </div>
  );
}
