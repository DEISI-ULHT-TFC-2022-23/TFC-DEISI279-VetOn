import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AddAnimal() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [race, setRace] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [birth_date, setBirthDate] = useState("");
  const [skin_type, setSkinType] = useState("");
  const [message, setMessage] = useState(null);

  async function submit(event) {
    event.preventDefault();
    const res = await axios.post("/add-animal", {
      name,
      type,
      race,
      weight,
      gender,
      birth_date,
      skin_type,
      addedPhotos
    });

    if (res.data.message) {
      setMessage(res.data.message);
    }
    setInterval(() => {
      setMessage(null);
    }, 3000);
    setName("");
    setType("");
    setRace("");
    setWeight("");
    setGender("");
    setBirthDate("");
    setSkinType("");
    setAddedPhotos([]);
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photo", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data:filename } = response;
        setAddedPhotos(prev => {
          return [...prev, filename];
        });
      });
  }

  return (
    <div className="bg-gray-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={submit}>
        <div className="flex justify-center mb-4">
          <Link to={"/profile"}>
            <img src={"https://vet-on.s3.amazonaws.com/logo_small.png"} alt="" />
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
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={type}
          onChange={(event) => setType(event.target.value)}
          type="text"
          placeholder="Especie"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={race}
          onChange={(event) => setRace(event.target.value)}
          type="text"
          placeholder="Raca"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          type="text"
          placeholder="Peso"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={gender}
          onChange={(event) => setGender(event.target.value)}
          type="text"
          placeholder="Genero"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={birth_date}
          onChange={(event) => setBirthDate(event.target.value)}
          type="text"
          placeholder="Data de nascimento"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={skin_type}
          onChange={(event) => setSkinType(event.target.value)}
          type="text"
          placeholder="Pelagem"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <label className="flex justify-center gap-2 w-full rounded-sm p-2 mb-2 border bg-white text-black">
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

        <button className="bg-primary text-white block w-full rounded-sm p-2">
          Adicionar animal
        </button>
      </form>
    </div>
  );
}
