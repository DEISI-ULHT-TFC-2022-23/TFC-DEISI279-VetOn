import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function AddAnimal() {
  const { userId, setUserId, username, setUsername } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [race, setRace] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [skin_type, setSkinType] = useState("");

  async function submit(event) {
    event.preventDefault();
    navigate("/profile");
    await axios.post(`add-animal/${userId}`, {
      name,
      type,
      race,
      weight,
      gender,
      birth_date,
      skin_type,
    });
  }

  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/"}>
            <img src="../src/assets/logo.png" alt="" />
          </Link>
        </div>

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
          Adicionar animal
        </button>
      </form>
    </div>
  );
}
