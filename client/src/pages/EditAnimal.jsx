import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [race, setRace] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [skin_type, setSkinType] = useState("");
  const [message, setMessage] = useState(null);

  async function submit(event) {
    event.preventDefault();
    const res = await axios.post("/edit-animal/" + id, {
      name,
      type,
      race,
      weight,
      gender,
      birth_date,
      skin_type,
    });
    if (res.data.message) {
      setMessage(res.data.message);
    }
    setInterval(() => {
      setMessage(null);
    }, 3000);
  }

  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/"}>
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
          value={type}
          onChange={(event) => setType(event.target.value)}
          type="text"
          placeholder="Especie"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={race}
          onChange={(event) => setRace(event.target.value)}
          type="text"
          placeholder="Raca"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          type="text"
          placeholder="Peso"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={gender}
          onChange={(event) => setGender(event.target.value)}
          type="text"
          placeholder="Genero"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={birth_date}
          onChange={(event) => setBirthDate(event.target.value)}
          type="text"
          placeholder="Data de nascimento"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={skin_type}
          onChange={(event) => setSkinType(event.target.value)}
          type="text"
          placeholder="Pelagem"
          className="block w-full rounded-sm p-2 mb-2 border"
        />

        <button className="bg-primary text-white block w-full rounded-sm p-2">
          Editar animal
        </button>
      </form>
    </div>
  );
}
