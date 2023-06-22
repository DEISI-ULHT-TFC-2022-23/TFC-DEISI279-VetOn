import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    const res = await axios.post("/forgot-password", { email });
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
            <img src={"https://vet-on.s3.amazonaws.com/logo_small.png"} alt="" />
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="email"
          className="block w-full rounded-sm p-2 mb-2 border"
        />

        <button className="bg-primary text-white block w-full rounded-sm p-2">
          Submeter
        </button>
      </form>
    </div>
  );
}
