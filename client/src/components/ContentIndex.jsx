import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FacebookSVG from "./FacebookSVG";
import LinkedInSVG from "./LinkedInSVG";
import InstagramSVG from "./InstagramSVG";
import Clock from "./Clock";
import LocationSVG from "./LocationSVG";
import PhoneSVG from "./PhoneSVG";
import CalendarSVG from "./CalendarSVG";
import LetterSVG from "./LetterSVG";
import GithubSVG from "./GithubSVG";
import { UserContext } from "../UserContext";

export default function ContentIndex({ loggedIn = false }) {
  const { userId } = useContext(UserContext);
  const [dateState, setDateState] = useState(new Date());
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function submitForm(event) {
    event.preventDefault();
    if (name == "" || email == "" || message == "") {
      alert("Preencha todos os campos do formulario");
    } else {
      const res = await axios.post("/contact", {
        name,
        email,
        message,
      });
      setMessage("");
      setName("");
      setEmail("");
      alert("Email enviado com sucesso");
    }
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
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div>
      <div id="about-us" className="ml-16 mr-10 mt-32">
        <div className="flex">
          <div className="w-1/2">
            <div className="font-poppins text-3xl">Bem-vindo à</div>
            <div className="font-poppins pt-4 text-8xl font-bold mb-10">
              VetOn
            </div>
            <div className="font-poppins pt-4 text-xl">
              Sabendo que é importante garantir a saúde dos animais de estimação
              de qualquer indivíduo, a VetOn torna possível o agendamento de
              consultas no Hospital Veterinário da Universidade Lusófona de
              forma simples e eficaz. <br /> Nesta fase inicial iremos estar ao
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
            <div
              className="flexbox bg-primary justify-center text-center rounded-xl w-96 p-10"
              key={service._id}
            >
              <div className="font-poppins font-bold text-xl pb-8">
                {service.title}
              </div>
              <img
                src={service.image}
                alt="serviceImage"
                className="rounded-xl"
              />
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
                <img className="rounded-xl" src={doctor.image} alt="Doctor" />
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
            <form onSubmit={submitForm}>
              <div className="font-poppins text-3xl pb-2">Nome</div>
              <input
                value={name}
                type="text"
                onChange={(event) => setName(event.target.value)}
                placeholder="Introduza o seu nome"
                className="block py-2 border-b-2 border-gray-500 w-10/12 text-black outline-none"
              />
              <div className="font-poppins text-3xl pb-2 pt-6">Email</div>
              <input
                value={email}
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Introduza o seu email"
                className="block py-2 border-b-2 border-gray-500 w-10/12 text-black outline-none"
              />
              <div className="font-poppins text-3xl pb-6 pt-6">Mensagem</div>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
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
          <Clock dateState={dateState} />
        </div>
        <div>
          <div className="flex items-center pt-8 gap-2 mr-40">
            <LocationSVG />
            <div className="block font-poppins">
              <div className="text-sm">Campo Grande 376, 1749-024</div>
              <div>Lisboa, Portugal</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <PhoneSVG />
            <div className="block">
              <div className="font-poppins text-xl">961847699</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-8">
            <CalendarSVG className={"w-12 h-12"}/>
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
            <LetterSVG />
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
              <a
                href="https://www.linkedin.com/in/rubenvpsilva/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInSVG />
              </a>
              <a
                href="https://www.instagram.com/rbnvsilva/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramSVG />
              </a>
              <a
                href="https://github.com/rbnvsilva"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubSVG />
              </a>
            </div>
          </div>
          <div className="font-poppins flex items-center pt-8 gap-2">
            <div className="text-xl pt-3">Rodrigo Simões</div>
            <div className="flex items-center gap-2 font-poppins text-l pt-4">
              <a
                href="https://www.linkedin.com/in/rodrigo-simões-6a2393207/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInSVG />
              </a>
              <a
                href="https://www.instagram.com/rodrigo_simoes02/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramSVG />
              </a>
              <a
                href="https://github.com/RodrigoSimoes-22001628"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubSVG />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
