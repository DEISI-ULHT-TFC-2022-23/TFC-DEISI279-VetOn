import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Logo from "../components/Logo";
import AuthenticatedButtons from "../components/AuthenticatedButtons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MakeAppointment() {
  const { setUsername } = useContext(UserContext);
  const [doctorName, setDoctorName] = useState("");
  const [hour, setHour] = useState("");
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentType, setAppointmentType] = useState("");
  const [animals, setAnimals] = useState([]);
  const [pet, setPet] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/user-animals").then((response) => {
      setAnimals(response.data.animals);
    });
  }, []);

  const onChangeAnimal = (event) => {
    setPet(event.target.value);
  };

  const onChangeAppointmentType = (event) => {
    setAppointmentType(event.target.value);
  };

  const onChangeDoctor = (event) => {
    setDoctorName(event.target.value);
  };

  const onChangeHour = (event) => {
    setHour(event.target.value);
  };

  async function submit(event) {
    event.preventDefault();
    await axios.post("/add-appointment", {
      pet,
      appointmentType,
      doctorName,
      hour,
    });
    navigate("/profile");
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

  async function logout() {
    await axios.get("/logout");
    window.location.reload(true);
    setId(null);
    setUsername(null);
  }

  return (
    <form onSubmit={submit} className="mb-28">
      <div className="fixed top-0 w-full">
        <nav className="flex items-center justify-between p-4 bg-gray-200">
          <Logo index={false} />
          <AuthenticatedButtons onClick={logout} />
        </nav>
      </div>
      <div className="mt-32 flex flex-col items-center">
        <div className="text-5xl">Marque a sua consulta</div>

        <div>
          <div className="mt-20 mb-5 text-center text-xl">
            Selecione o Hospital / Clinica
          </div>
          <select
            name="clinic"
            id="clinic"
            className="border border-primary rounded-full p-4"
          >
            <option>Hospital Veterinário da Universidade Lusófona</option>
          </select>
          <div className="mt-10 mb-5 text-center text-xl">
            Selecione o animal pretendido
          </div>
          <select
            value={pet}
            name="animal"
            id="animal"
            className="border border-primary rounded-full p-4 w-96"
            onChange={onChangeAnimal}
          >
            <option value="" disabled hidden>
              Escolha um dos seus animais...
            </option>
            {animals.map((animal) => (
              <option key={animal._id}>{animal.name}</option>
            ))}
          </select>
          <div className="mt-10 mb-5 text-center text-xl">
            Selecione o tipo de consulta
          </div>
          <select
            value={appointmentType}
            name="appointment_type"
            id="appointment_type"
            className="border border-primary rounded-full p-4 w-96"
            onChange={onChangeAppointmentType}
          >
            <option value="" disabled hidden>
              Escolha um tipo de consulta...
            </option>
            {services.map((service) => (
              <option key={service._id}>{service.title}</option>
            ))}
          </select>

          <div>
            {appointmentType !== "" && (
              <div>
                <div className="mt-10 mb-5 text-center text-xl">
                  Selecione o médico
                </div>
                <select
                  value={doctorName}
                  name="doctor"
                  id="doctor"
                  className="border border-primary rounded-full p-4 w-96"
                  onChange={onChangeDoctor}
                >
                  <option value="" disabled hidden>
                    Escolha um médico...
                  </option>
                  {doctors
                    .filter((doctor) => doctor.job === appointmentType)
                    .map((doctor) => (
                      <option key={doctor._id}>{doctor.name}</option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <div>
            {doctorName !== "" && (
              <div>
                <div className="mt-10 mb-5 text-center text-xl">
                  Selecione um horário
                </div>
                <select
                  value={hour}
                  name="hour"
                  id="hour"
                  className="border border-primary rounded-full p-4 w-96"
                  onChange={onChangeHour}
                >
                  <option value="" disabled hidden>
                    Escolha um horário...
                  </option>
                  {doctors
                    .filter((doctor) => doctor.job === appointmentType)
                    .map((doctor) =>
                      doctor.appointmentHours.map((appointment) =>
                        appointment.hours.map((hour) => (
                          <option key={hour}>{hour}</option>
                        ))
                      )
                    )}
                </select>
              </div>
            )}
          </div>
          {hour !== "" && (
            <button className="mt-10 mb-20 ml-28 rounded-full border border-primary px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
              Marcar consulta
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
