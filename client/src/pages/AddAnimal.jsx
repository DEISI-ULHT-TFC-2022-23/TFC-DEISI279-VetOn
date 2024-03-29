import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";

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
  const [toggleButton, setToggleButton] = useState(true);
  const [message, setMessage] = useState(null);
  const genders = ["Macho", "Fêmea"];
  const skins = ["Não tem pelagem", "Curta", "Longa"];

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
      addedPhotos,
    });

    if (res.data.message) {
      setMessage(res.data.message);
    }

    setInterval(() => {
      setMessage(null);
      navigate("/profile");
      window.location.reload(true);
    }, 2000);

    setName("");
    setType("");
    setRace("");
    setWeight("");
    setGender("");
    setBirthDate("");
    setSkinType("");
    setAddedPhotos([]);
  }

  const handleDateChange = (date) => {
    setBirthDate(date);
  };

  const onChangeGender = (event) => {
    setGender(event.target.value);
  };

  const onChangeSkin = (event) => {
    setSkinType(event.target.value);
  };

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
          <Link to={"/profile"}>
            <img
              src={"https://vet-on.s3.amazonaws.com/logo_small.png"}
              alt=""
            />
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
          placeholder="Espécie"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={race}
          onChange={(event) => setRace(event.target.value)}
          type="text"
          placeholder="Raça"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <input
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          type="number"
          placeholder="Peso (kg)"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
        />
        <select
          value={gender}
          name="gender"
          id="gender"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
          onChange={onChangeGender}
        >
          <option value="" disabled hidden>
            Escolha um género
          </option>
          {genders.map((gender) => (
            <option key={gender}>{gender}</option>
          ))}
        </select>
        <ReactDatePicker
          dateFormat="dd/MM/yyyy"
          timeIntervals={60}
          selected={birth_date}
          onChange={handleDateChange}
          className="block w-64 rounded-sm p-2 mb-2 border placeholder:text-black"
          placeholderText="Data de nascimento"
          maxDate={new Date()}
        />
        <select
          value={skin_type}
          name="skin"
          id="skin"
          className="block w-full rounded-sm p-2 mb-2 border placeholder:text-black"
          onChange={onChangeSkin}
        >
          <option value="" disabled hidden>
            Tipo de pelagem
          </option>
          {skins.map((skin) => (
            <option key={skin}>{skin}</option>
          ))}
        </select>
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

        {toggleButton && (
          <button className="bg-primary text-white block w-full rounded-sm p-2">
            Adicionar animal
          </button>
        )}
      </form>
    </div>
  );
}
