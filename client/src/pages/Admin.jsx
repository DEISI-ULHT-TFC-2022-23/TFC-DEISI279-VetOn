import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const { username, setUsername, setUserId } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  async function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
    setUsername(null);
    setUserId(null);
  }

  async function deleteAppointment(id) {
    await axios.delete("/delete-appointment/" + id);
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
          Médicos
        </div>
        <Link to={"/add-doctor"}>
          <button className="flex gap-2 border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
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

        <div className="w-full flex flex-wrap gap-8 p-4">
          {doctors.map((doctor) => (
            <div
              className="bg-white rounded-xl w-80 p-10 border border-primary"
              key={doctor._id}
            >
              <div>
                <img src="../src/assets/medico.jpg" alt="Doctor" />
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
                <div>
                  <svg
                    fill="#000000"
                    width="40px"
                    height="40px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
                  </svg>
                </div>
                <div>
                  <svg
                    fill="#000000"
                    height="35px"
                    width="35px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="-143 145 512 512"
                    xmlSpace="preserve"
                  >
                    <path d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M41.4,508.1H-8.5V348.4h49.9 V508.1z M15.1,328.4h-0.4c-18.1,0-29.8-12.2-29.8-27.7c0-15.8,12.1-27.7,30.5-27.7c18.4,0,29.7,11.9,30.1,27.7C45.6,316.1,33.9,328.4,15.1,328.4z M241,508.1h-56.6v-82.6c0-21.6-8.8-36.4-28.3-36.4c-14.9,0-23.2,10-27,19.6c-1.4,3.4-1.2,8.2-1.2,13.1v86.3H71.8c0,0,0.7-146.4,0-159.7h56.1v25.1c3.3-11,21.2-26.6,49.8-26.6c35.5,0,63.3,23,63.3,72.4V508.1z" />
                  </svg>
                </div>
                <div>
                  <svg
                    width="45px"
                    height="45px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.65 7.2H16.66M8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20ZM15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="font-poppins text-5xl mt-10 mb-20" id="my-appointments">
          Serviços
        </div>
        <Link to={"/add-service"}>
          <button className="border flex gap-2 border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
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
        <div className="w-full flex flex-wrap gap-8 justify-between p-4">
          {services.map((service) => (
            <div className="bg-primary rounded-xl w-80 p-10" key={service._id}>
              <div className="font-poppins font-bold text-2xl pb-8">
                {service.title}
              </div>
              <div>{service.description}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="font-poppins text-5xl mt-10 mb-20" id="my-appointments">
          Serviços
        </div>
        <Link to={"/make-appointment-admin"}>
          <button className="border flex gap-2 border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
            Marcar Consulta
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
          {appointments.map((appointment) => (
            <div
              className="bg-gray-300 rounded-xl w-96 p-10"
              key={appointment._id}
            >
              <div className="font-poppins font-bold text-2xl pb-8">
                Clínica: {appointment.clinic}
              </div>
              <div className="font-poppins font-bold text-2xl pb-8">
                Animal: {appointment.pet}
              </div>
              <div className="font-poppins font-bold text-2xl pb-8">
                Tipo de consulta: {appointment.appointmentType}
              </div>
              <div className="font-poppins font-bold text-2xl pb-8">
                Médico: {appointment.doctor}
              </div>
              <div className="font-poppins font-bold text-2xl pb-8">
                Hora: {appointment.hour}
              </div>
              <div className="flex justify-between">
                <button
                  className="border border-red-500 rounded-full px-4 py-2 hover:bg-red-500 hover:text-white transition duration-300"
                  onClick={() => deleteAppointment(appointment._id)}
                >
                  Desmarcar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
