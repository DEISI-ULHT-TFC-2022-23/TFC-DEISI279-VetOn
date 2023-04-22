import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Nav from "./../components/Nav";
import Logo from "../components/Logo";
import AuthenticatedButtons from "../components/AuthenticatedButtons";

export default function MakeAppointment() {
  const { userId, setUserId, username, setUsername } = useContext(UserContext);
  const [doctorSelected, setDoctorSelected] = useState(false);
  const [hourSelected, setHourSelected] = useState(false);

  async function logout() {
    await axios.get("/logout");
    window.location.reload(true);
    setId(null);
    setUsername(null);
  }

  useEffect(() => {
    setInterval(() => {
      if (document.getElementById("doctor").value === "default") {
        setDoctorSelected(false);
      } else {
        setDoctorSelected(true);
      }
    });
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (document.getElementById("hour").value === "default") {
        setHourSelected(false);
      } else {
        setHourSelected(true);
      }
    });
  }, []);

  return (
    <div>
      <div className="fixed top-0 w-full">
        <nav className="flex items-center justify-between p-4 bg-gray-200">
          <Logo index={false} />
          <AuthenticatedButtons onClick={logout} />
        </nav>
      </div>
      <div className="mt-52 flex flex-col items-center">
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
            <option>Hospital Veterinario da Universidade Lusofona</option>
          </select>
          <div className="mt-10 mb-5 text-center text-xl">
            Selecione o tipo de consulta
          </div>
          <select
            name="appointment_type"
            id="appointment_type"
            className="border border-primary rounded-full p-4"
          >
            <option>Hospital Veterinario da Universidade Lusofona</option>
          </select>
          <div className="mt-10 mb-5 text-center text-xl">
            Selecione o medico
          </div>
          <select
            name="doctor"
            id="doctor"
            className="border border-primary rounded-full p-4"
          >
            <option value="default" selected disabled hidden>
              Escolha um medico...
            </option>
            <option>Hospital Veterinario da Universidade Lusofona</option>
          </select>

          <div>
            {doctorSelected === true && (
              <div>
                <div className="mt-10 mb-5 text-center text-xl">
                  Selecione um horario
                </div>
                <select
                  name="hour"
                  id="hour"
                  className="border border-primary rounded-full p-4"
                >
                  <option value="default" selected disabled hidden>
                    Escolha um horario...
                  </option>
                  <option>Hospital Veterinario da Universidade Lusofona</option>
                </select>
              </div>
            )}
          </div>
          <div>
            {hourSelected === true && (
              <button className="mt-10 mb-20 ml-28 rounded-full border border-primary px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
                Marcar consulta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
