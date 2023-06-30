import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FacebookSVG from "../components/FacebookSVG";
import LinkedInSVG from "../components/LinkedInSVG";
import InstagramSVG from "../components/InstagramSVG";
import HospitalSVG from "../components/HospitalSVG";
import PawSVG from "../components/PawSVG";
import CalendarSVG from "../components/CalendarSVG";
import DoctorSVG from "../components/DoctorSVG";

export default function Admin() {
  const { username, setUsername, setUserId } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUserId(null);
    setUsername(null);
    navigate("/");
  }

  async function deleteAppointment(id) {
    await axios.delete("/delete-appointment-admin/" + id);
    window.location.reload(false);
  }

  useEffect(() => {
    axios.get("/services").then((response) => {
      setServices(response.data.services);
    });
  }, []);

  useEffect(() => {
    axios.get("/doctors").then((response) => {
      setDoctors(response.data.doctors);
    });
  }, []);

  useEffect(() => {
    axios.get("/appointments").then((response) => {
      setAppointments(response.data.appointments);
    });
  }, []);

  return (
    <div>
      <div className="bg-[#d1d4db] py-4 pl-12">
        <img src={"https://vet-on.s3.amazonaws.com/logo_small.png"} alt="" />
      </div>
      <div className="flex flex-col items-center">
        <img
          className="w-full absolute"
          src={"https://vet-on.s3.amazonaws.com/background_profile.jpg"}
          alt="Profile Background"
        />

        <img
          className="top-80 relative h-64 w-64 rounded-full "
          src={"https://vet-on.s3.amazonaws.com/default_profile.jpg"}
          alt="Profile Picture"
        />

        <div className="flex items-center gap-2 font-poppins top-80 text-3xl z-10 relative mb-96">
          {username}
        </div>

        <button
          onClick={logout}
          className="bg-primary text-white block rounded-sm p-2"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="font-poppins text-5xl mt-10 mb-10" id="my-animals">
          Médicos
        </div>
        <Link to={"/add-doctor"}>
          <button className="flex gap-2 border mb-10 border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
            Adicionar médico
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

        <div className="w-full flex flex-wrap gap-8 p-4 bg-gray-200">
          {doctors.map((doctor) => (
            <div
              className="bg-white rounded-xl w-80 p-10 border border-primary"
              key={doctor._id}
            >
              <div>
                <img src={doctor.image} alt="Doctor" className="rounded-xl" />
              </div>
              <div className="font-poppins text-l text-gray-500 pt-4">
                {doctor.job}
              </div>
              <div className="font-poppins font-bold text-2xl pt-4">
                {doctor.name}
              </div>
              <div className="font-poppins text-l pt-4">
                {doctor.description}
              </div>
              <div className="flex items-center gap-2 font-poppins text-l pt-4">
                {doctor.fb !== "" && (
                  <a href={doctor.fb} target="_blank" rel="noopener noreferrer">
                    <FacebookSVG />
                  </a>
                )}
                {doctor.li !== "" && (
                  <a href={doctor.li} target="_blank" rel="noopener noreferrer">
                    <LinkedInSVG />
                  </a>
                )}
                {doctor.insta !== "" && (
                  <a
                    href={doctor.insta}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramSVG />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="font-poppins text-5xl mt-10 mb-10" id="my-appointments">
          Serviços
        </div>
        <Link to={"/add-service"}>
          <button className="border flex gap-2 mb-10 border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
            Adicionar serviço
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
        <div className="w-full flex flex-wrap gap-8 justify-between p-4 bg-gray-200">
          {services.map((service) => (
            <div className="bg-primary rounded-xl w-80 p-10" key={service._id}>
              <div className="font-poppins font-bold text-2xl pb-8">
                {service.title}
              </div>
              <img src={service.image} alt="" className="rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center w-full h-96">
        <div className="font-poppins text-5xl mt-10 mb-20" id="my-appointments">
          Consultas
        </div>
        <Link to={"/make-appointment-admin"}>
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
                    {appointment.date} as {appointment.hour}h
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
