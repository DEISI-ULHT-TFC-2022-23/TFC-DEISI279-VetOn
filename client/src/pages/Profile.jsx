import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import axios from "axios";
import MaleSVG from "../components/MaleSVG";
import FemaleSVG from "../components/FemaleSVG";
import CalendarSVG from "../components/CalendarSVG";
import ScaleSVG from "../components/ScaleSVG";
import ScissorsSVG from "../components/ScissorsSVG";
import HospitalSVG from "../components/HospitalSVG";
import PawSVG from "../components/PawSVG";
import DoctorSVG from "../components/DoctorSVG";

export default function Profile() {
  const { setUsername, setUserId, username } = useContext(UserContext);
  const [animals, setAnimals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [photo, setPhoto] = useState([]);

  function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUsername(null);
    setUserId(null);
  }

  async function deleteAnimal(id) {
    await axios.delete("/delete-animal/" + id);
    window.location.reload(false);
  }

  async function deleteAppointment(id) {
    await axios.delete("/delete-appointment/" + id);
    window.location.reload(false);
  }

  useEffect(() => {
    axios.get("/user-animals").then((response) => {
      setAnimals(response.data.animals);
    });
  }, []);

  useEffect(() => {
    axios.get("/user-appointments").then((response) => {
      setAppointments(response.data.appointments);
    });
  }, []);

  useEffect(() => {
    axios.get("/users/" + username).then((response) => {
      setPhoto(response.data.image);
    });
  }, [username]);

  return (
    <div>
      <div className="flex justify-between bg-[#d1d4db] py-4 pl-12">
        <Link to={"/"}>
          <img src={"https://vet-on.s3.amazonaws.com/logo_small.png"} alt="" />
        </Link>
      </div>
      <div className="flex flex-col items-center z-0">
        <img
          className="w-full absolute"
          src={"https://vet-on.s3.amazonaws.com/background_profile.jpg"}
          alt="Profile Background"
        />

        <img
          className="top-80 relative h-64 w-64 rounded-full"
          src={photo}
          alt="Profile Picture"
        />

        <div className="flex items-center gap-2 mt-4 font-poppins top-80 text-3xl z-10 relative mb-96">
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
        <Link to={"/"}>
          <button
            onClick={logout}
            className="bg-primary text-white block w-full rounded-sm p-2"
          >
            Logout
          </button>
        </Link>
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

        {animals.length !== 0 && (
          <div className="flex flex-wrap gap-8 justify-between p-12 w-full mt-20 bg-gray-200">
            {animals.map((animal) => (
              <div
                className="bg-white relative rounded-xl w-80 p-10"
                key={animal._id}
              >
                <div>
                  <img
                    src={animal.image}
                    alt="Animal"
                    className="w-full h-full rounded-xl"
                  />
                </div>
                <div className="font-poppins text-l text-gray-500 pt-4">
                  {animal.type} • {animal.race}
                </div>
                <div className="flex gap-4 text-center font-poppins font-bold text-2xl pt-4">
                  {animal.name}
                  {animal.gender == "Macho" && <MaleSVG />}
                  {animal.gender == "Fêmea" && <FemaleSVG />}
                </div>
                <div className="flex gap-4 text-center font-poppins font-bold text-2xl pt-4">
                  <div className="flex gap-4">
                    <CalendarSVG className={"w-8 h-8"} />
                    <div className="text-xl mt-1">
                      {animal.birth_date.split("T")[0]}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-center font-poppins font-bold text-2xl pt-4">
                  <div className="flex gap-4">
                    <ScaleSVG />
                    <div className="text-xl mt-1">{animal.weight}kg</div>
                  </div>
                </div>
                <div className="flex gap-4 text-center font-poppins font-bold text-2xl pt-4 mb-10">
                  <div className="flex gap-4">
                    <ScissorsSVG />
                    <div className="text-xl mt-1">{animal.skin_type}</div>
                  </div>
                </div>
                <div className="flex justify-between gap-20 absolute bottom-0 mb-6">
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
        )}
      </div>
      <div className="flex flex-col items-center w-full h-96">
        <div className="font-poppins text-5xl mt-10 mb-20" id="my-appointments">
          As minhas consultas
        </div>
        <Link to={"/make-appointment"}>
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

        {appointments.length !== 0 && (
          <div className="flex flex-wrap rounded-xl gap-8 justify-between p-12 w-full mt-20 bg-gray-200">
            {appointments.map((appointment) => (
              <div
                className="bg-white rounded-xl w-96 p-10 relative"
                key={appointment._id}
              >
                <div className="font-poppins text-l text-gray-500 pt-4">
                  <div className="flex gap-4">
                    <HospitalSVG />
                    {appointment.clinic}
                  </div>
                </div>
                <div className="font-poppins font-bold text-xl pt-4">
                  {appointment.appointmentType}
                </div>
                <div className="font-poppins text-2xl pt-4">
                  <div className="flex gap-4">
                    <PawSVG />
                    {appointment.pet}
                  </div>
                </div>
                <div className="flex gap-2 font-poppins text-xl pt-4">
                  <CalendarSVG className={"w-8 h-8"} />
                  <div className="mt-1">
                    {appointment.date} às {appointment.hour}h
                  </div>
                </div>
                <div className="flex gap-2 font-poppins text-xl pt-4 mb-12">
                  <DoctorSVG />
                  <div className="mt-2">{appointment.doctor}</div>
                </div>
                <div className="absolute bottom-0 mb-6">
                  {new Date(
                    appointment.date.split("/")[1] +
                      "/" +
                      appointment.date.split("/")[0] +
                      "/" +
                      appointment.date.split("/")[2]
                  ).getTime() < new Date().getTime() && (
                    <button className="border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300 mt-4 disabled cursor-default">
                      Concluida
                    </button>
                  )}
                  {new Date(
                    appointment.date.split("/")[1] +
                      "/" +
                      appointment.date.split("/")[0] +
                      "/" +
                      appointment.date.split("/")[2]
                  ).getTime() >= new Date().getTime() && (
                    <div className="flex gap-24">
                      
                      <button className="border border-blue-400 rounded-full px-4 py-2 hover:bg-blue-400 hover:text-white transition duration-300 disabled cursor-default">
                        Por fazer
                      </button>
                      <button
                        className="border border-red-500 rounded-full px-4 py-2 hover:bg-red-500 hover:text-white transition duration-300"
                        onClick={() => deleteAppointment(appointment._id)}
                      >
                        Desmarcar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
