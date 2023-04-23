import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AddDoctor() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [description, setDescription] = useState("");
  const [fb, setFb] = useState("");
  const [li, setLi] = useState("");
  const [insta, setInsta] = useState("");
  const [message, setMessage] = useState(null);

  async function submit(event) {
    event.preventDefault();
    const res = await axios.post("/add-doctor", {
      name,
      job,
      description,
      fb,
      li,
      insta,
    });
    if (res.data.message) {
      setMessage(res.data.message);
    }
    setInterval(() => {
      setMessage(null);
    }, 3000);
    setName("");
    setJob("");
    setDescription("");
    setFb("");
    setLi("");
    setInsta("");
  }

  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/admin"}>
            <img src="../src/assets/logo.png" alt="" />
          </Link>
        </div>
        {message !== null && (
          <div className="font-poppins p-2 my-5 bg-primary text-white rounded-full text-center ">
            {message}
          </div>
        )}
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          placeholder="Nome"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={job}
          onChange={(event) => setJob(event.target.value)}
          type="text"
          placeholder="Especializacao"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          type="text"
          placeholder="Descricao"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={fb}
          onChange={(event) => setFb(event.target.value)}
          type="text"
          placeholder="Link Facebook"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={li}
          onChange={(event) => setLi(event.target.value)}
          type="text"
          placeholder="Link LinkedIn"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={insta}
          onChange={(event) => setInsta(event.target.value)}
          type="text"
          placeholder="Link Instagram"
          className="block w-full rounded-sm p-2 mb-2 border"
        />

        <button className="bg-primary text-white block w-full rounded-sm p-2">
          Adicionar doctor
        </button>
      </form>
    </div>
  );
}
