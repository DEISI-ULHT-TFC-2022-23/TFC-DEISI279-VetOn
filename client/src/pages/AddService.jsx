import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AddService() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);
  const [toggleButton, setToggleButton] = useState(true);

  useEffect(() => {
    axios.get("/services").then((response) => {
      setServices(response.data.services);
    });
  }, []);

  async function submit(event) {
    event.preventDefault();
    const res = await axios.post("/add-service", {
      name,
      addedPhotos,
    });
    if (res.data.message) {
      setMessage(res.data.message);
    }
    setInterval(() => {
      setMessage(null);
      navigate("/admin");
      window.location.reload(true);
    }, 2000);
    setName("");
    setAddedPhotos([]);
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
          <Link to={"/admin"}>
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
          placeholder="Tipo de serviço"
          className="block w-full rounded-sm p-2 mb-2 border"
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

        {toggleButton && (
          <button className="bg-primary text-white block w-full rounded-sm p-2">
            Adicionar serviço
          </button>
        )}
      </form>
    </div>
  );
}
