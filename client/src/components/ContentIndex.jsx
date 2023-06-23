import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ContentIndex({ loggedIn = false }) {
  const [dateState, setDateState] = useState(new Date());
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

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
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div>
      <div id="about-us"></div>
      <div className="ml-16 mr-10 mt-32">
        <div className="flex">
          <div className="w-1/2 ">
            <div className="font-poppins text-3xl">Bem-vindo à</div>
            <div className="font-poppins pt-4 text-8xl font-bold mb-10">
              VetOn
            </div>
            <div className="font-poppins pt-4 text-xl">
              Sabendo que é importante garantir a saúde dos animais de estimação
              de qualquer indivíduo a VetOn torna possível o agendamento de
              consultas no Hospital Veterinário da Universidade Lusófona de
              forma simples e efica. <br /> Nesta fase inicial iremos estar ao
              dispor do Hospital Veterinário da Universidade Lusófona de forma a
              oferecer uma maior visibilidade e colmatar a carência em aspetos
              de logística e gerenciamento que este apresenta. <br /> Num futuro
              próximo pretendemos ser o intermediário entre várias clínicas
              veterinárias e você. <br />
              <b>Estamos ao seu dispor a qualquer hora, todos os dias.</b>
            </div>
            <div className="font-poppins pt-16">
              {loggedIn && (
                <Link to={"/make-appointment"}>
                  <button className="rounded-full border border-primary px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
                    Agende a sua consulta
                  </button>
                </Link>
              )}
              {!loggedIn && (
                <Link to={"/authentication"}>
                  <button className="rounded-full border border-primary px-4 py-2 hover:bg-primary hover:text-white transition duration-300">
                    Agende a sua consulta
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="w-1/6 "></div>
          <div className="w-1/2 bg-gray-200 rounded-tr-3xl rounded-br-3xl">
            <img
              className="pl-44 pt-10"
              src={"https://vet-on.s3.amazonaws.com/dogs_landing.png"}
              alt="Dogs"
            />
          </div>
        </div>
        <div
          className="flex items-center justify-center font-poppins mt-20 text-5xl"
          id="services"
        >
          Serviços Disponíveis
        </div>
        <div className="flex flex-wrap gap-8 justify-between p-12 w-full mt-20 bg-gray-200">
          {services.map((service) => (
            <div className="flexbox bg-primary justify-center text-center rounded-xl w-96 p-10" key={service._id}>
              <div className="font-poppins font-bold text-xl pb-8">
                {service.title}
              </div>
              <img src={service.image} alt="serviceImage" className="rounded-xl" />
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-center font-poppins mt-20 text-5xl"
          id="doctors"
        >
          Médicos Afiliados
        </div>
        <div className="flex flex-wrap gap-8 justify-between p-12 w-full mt-20 bg-primary">
          {doctors.map((doctor) => (
            <div className="bg-white rounded-xl w-80 p-10" key={doctor._id}>
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
        <div className="flex justify-between">
          <div className="w-2/5 mt-20 border-4 border-primary rounded-3xl ml-20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.24743547565!2d-9.155304684368053!3d38.75802846275171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1932fc16a21773%3A0xbb910a0db57ce114!2sUniversidade%20Lus%C3%B3fona%20-%20Centro%20Universit%C3%A1rio%20Lisboa!5e0!3m2!1spt-PT!2spt!4v1680730430727!5m2!1spt-PT!2spt"
              width="711"
              height="711"
              className="rounded-3xl"
            ></iframe>
          </div>
          <div className="w-2/5 mt-20">
            <div
              className="flex items-center font-poppins text-5xl pb-10"
              id="contacts"
            >
              Contacte-nos
            </div>
            <form>
              <div className="font-poppins text-3xl pb-2">Nome</div>
              <input
                type="text"
                placeholder="Introduza o seu nome"
                className="block py-2 border-b-2 border-gray-500 w-10/12 text-black outline-none"
              />
              <div className="font-poppins text-3xl pb-2 pt-6">Email</div>
              <input
                type="text"
                placeholder="Introduza o seu email"
                className="block py-2 border-b-2 border-gray-500 w-10/12 text-black outline-none"
              />
              <div className="font-poppins text-3xl pb-6 pt-6">Mensagem</div>
              <textarea
                className="border border-gray-500 resize-none outline-none"
                name="mensagem"
                id="mensagem"
                cols="80"
                rows="10"
              ></textarea>
              <div className="pt-8 pl-4">
                <button className="border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition duration-300">
                  Submeter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex justify-between bg-gray-200 mt-10 pb-10 w-full">
        <div>
          <img
            className="pt-8 pb-40 pl-4"
            src={"https://vet-on.s3.amazonaws.com/lusofona_footer.png"}
            alt=""
          />
          <div className="flex font-poppins text-2xl gap-2 pl-6">
            <div>
              {dateState.toLocaleDateString("pt", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="border-l border-gray-500"></div>
            <div>
              {dateState.toLocaleString("pt", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
              })}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center pt-8 gap-2 mr-40">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <div className="block font-poppins">
              <div className="text-sm">Campo Grande 376, 1749-024</div>
              <div>Lisboa, Portugal</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            </div>
            <div className="block">
              <div className="font-poppins text-xl">961847699</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
            </div>
            <div className="block font-poppins">
              <div className="text-sm">
                Aberto <b>24H</b>, todos os dias
              </div>
              <div>
                incluindo <b>fins de semana e feriados</b>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="block font-poppins">
              <div>recepcao.medvet@ulusofona.pt</div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center pt-8 mr-56">
            <div className="block">
              <div className="font-poppins text-2xl font-semibold">
                VetOn © 2023
              </div>
            </div>
          </div>
          <div className="font-poppins flex items-center pt-8 gap-2">
            <div className="text-xl pt-3">Ruben Silva</div>
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
          <div className="font-poppins flex items-center pt-8 gap-2">
            <div className="text-xl pt-3">Rodrigo Simões</div>
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
        </div>
      </div>
    </div>
  );
}
