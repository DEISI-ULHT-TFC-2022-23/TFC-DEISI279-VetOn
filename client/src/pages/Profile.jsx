import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { username } = useContext(UserContext);
  const [animals, setAnimals] = useState([]);

  async function deleteAnimal(id) {
    await axios.delete("/delete-animal/" + id);
    window.location.reload(false);
  }

  useEffect(() => {
    axios.get("/user-animals").then((response) => {
      setAnimals(response.data.animals);
    });
  }, []);

  console.log(animals);

  return (
    <div>
      <div className="bg-[#d1d4db] py-4 pl-12">
        <Link to={"/"}>
          <img src="../src/assets/logo.png" alt="" />
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <img
          className="w-full absolute"
          src="../src/assets/background_profile.jpg"
          alt="Profile Background"
        />

        <img
          className="top-80 relative h-64 w-64 rounded-full "
          src={`../src/assets/default_profile.jpg`}
          alt="Profile Picture"
        />

        <div className="flex items-center gap-2 font-poppins top-80 text-3xl z-10 relative mb-96">
          {username}
          <Link to={"/edit-profile"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="font-poppins text-5xl mt-10 mb-20" id="my-animals">
          Os meus animais
        </div>
        <Link to={"/add-animal"}>
          <button className="flex gap-2 border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
            Adicionar animal
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </Link>

        <div className="w-full flex flex-wrap gap-8 p-4">
          {animals &&
            animals.map((animal) => (
              <div
                className="bg-gray-300 rounded-xl w-96 p-10"
                key={animal._id}
              >
                <div className="font-poppins font-bold text-2xl pb-8">
                  Nome: {animal.name}
                </div>
                <div className="font-poppins font-bold text-2xl pb-8">
                  Especie: {animal.type}
                </div>
                <div className="font-poppins font-bold text-2xl pb-8">
                  Raca: {animal.race}
                </div>
                <div className="font-poppins font-bold text-2xl pb-8">
                  Peso: {animal.weight}
                </div>
                <div className="font-poppins font-bold text-2xl pb-8">
                  Genero: {animal.gender}
                </div>
                <div className="font-poppins font-bold text-2xl pb-8">
                  Data de nascimento: {animal.birth_date}
                </div>
                <div className="font-poppins font-bold text-2xl pb-8">
                  Pelagem: {animal.skin_type}
                </div>
                <div className="flex justify-between">
                  <Link to={`/edit-animal/${animal._id}`}>
                    <button className="border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
                      Editar
                    </button>
                  </Link>

                  <button
                    className="border border-red-500 rounded-full px-4 py-2 hover:bg-red-500 hover:text-white transition duration-300"
                    onClick={() => deleteAnimal(animal._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="font-poppins text-5xl mt-10 mb-20" id="my-appointments">
          As minhas consultas
        </div>
        <Link to={"/appointments"}>
          <button className="border flex gap-2 border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
            Marcar consulta
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
          </button>
        </Link>
        <div className=" w-full flex flex-wrap gap-8 justify-between p-4">
          <div className="bg-gray-300 rounded-xl w-80 p-10">
            <div className="font-poppins font-bold text-2xl pb-8">
              Anestesias e Operacoes
            </div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              sem lacus, dictum quis sapien sed, vestibulum volutpat urna.
              Mauris vulputate metus nec sodales interdum. Phasellus faucibus
              dui ac urna suscipit, eget dictum nunc viverra.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
