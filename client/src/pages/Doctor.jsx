import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HospitalSVG from "../components/HospitalSVG";
import PawSVG from "../components/PawSVG";
import CalendarSVG from "../components/CalendarSVG";
import DoctorSVG from "../components/DoctorSVG";

export default function Doctor() {
  const { setUsername, setUserId, username } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [datas, setDatas] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const navigate = useNavigate();

  function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUsername(null);
    setUserId(null);
  }

  useEffect(() => {
    const week = [];
    const currentDateFull = new Date();
    var sunday = new Date(
      currentDateFull.setDate(
        currentDateFull.getDate() - currentDateFull.getDay()
      )
    );

    const dayString = "" + new Date(sunday).getDate();
    const monthString = "" + (new Date(sunday).getMonth() + 1);
    if (dayString.length == 1) {
      if (monthString.length == 1) {
        week.push(
          `0${new Date(sunday).getDate()}/0${
            new Date(sunday).getMonth() + 1
          }/${new Date(sunday).getFullYear()}`
        );
      } else {
        week.push(
          `0${new Date(sunday).getDate()}/${
            new Date(sunday).getMonth() + 1
          }/${new Date(sunday).getFullYear()}`
        );
      }
    } else {
      if (monthString.length == 1) {
        week.push(
          `${new Date(sunday).getDate()}/0${
            new Date(sunday).getMonth() + 1
          }/${new Date(sunday).getFullYear()}`
        );
      } else {
        week.push(
          `${new Date(sunday).getDate()}/${
            new Date(sunday).getMonth() + 1
          }/${new Date(sunday).getFullYear()}`
        );
      }
    }

    while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0) {
      const dayString = "" + new Date(sunday).getDate();
      const monthString = "" + (new Date(sunday).getMonth() + 1);
      if (dayString.length == 1) {
        if (monthString.length == 1) {
          week.push(
            `0${new Date(sunday).getDate()}/0${
              new Date(sunday).getMonth() + 1
            }/${new Date(sunday).getFullYear()}`
          );
        } else {
          week.push(
            `0${new Date(sunday).getDate()}/${
              new Date(sunday).getMonth() + 1
            }/${new Date(sunday).getFullYear()}`
          );
        }
      } else {
        if (monthString.length == 1) {
          week.push(
            `${new Date(sunday).getDate()}/0${
              new Date(sunday).getMonth() + 1
            }/${new Date(sunday).getFullYear()}`
          );
        } else {
          week.push(
            `${new Date(sunday).getDate()}/${
              new Date(sunday).getMonth() + 1
            }/${new Date(sunday).getFullYear()}`
          );
        }
      }
    }
    setDatas(week);
  }, []);

  useEffect(() => {
    axios.get("/users/" + username).then((response) => {
      setDoctor();
      setPhoto(response.data.image);
    });
  }, [username]);

  useEffect(() => {
    axios.get("/appointments").then((response) => {
      setAppointments(response.data.appointments);
    });
  }, []);

  useEffect(() => {
    axios.get("/doctors").then((response) => {
      for (let i = 0; i < response.data.doctors.length; i++) {
        if (response.data.doctors[i].username == username) {
          setDoctor(response.data.doctors[i].name);
        }
      }
    });
  }, [username]);

  return (
    <div>
      <div className="flex justify-between bg-[#d1d4db] py-4 pl-12">
        <img src={"https://vet-on.s3.amazonaws.com/logo_small.png"} alt="" />
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
        {appointments.length !== 0 &&
          datas.map((date) => (
            <div className="p-12 w-full mt-20">
              <div className="text-3xl text-center">
                Consultas no dia {date}
              </div>
              <div className="flex flex-wrap rounded-xl gap-8 justify-between p-12 w-full mt-20 bg-gray-200">
                {appointments
                  .filter(
                    (appointment) =>
                      appointment.date == date && appointment.doctor == doctor
                  )
                  .map((appointment) => (
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
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
