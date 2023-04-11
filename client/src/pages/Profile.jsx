import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { id, username } = useContext(UserContext);

  return (
    <div>
      <div className="bg-gray-300 py-4 pl-12">
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
          src="../src/assets/default_profile.jpg"
          alt="Profile Picture"
        />

        <div className="flex items-center gap-2 font-poppins top-80 text-3xl z-10 relative mb-96">
          {username}
          <Link to={"/edit-profile"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
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
      <div className="flex flex-col items-center w-full">
        <div className="font-poppins text-5xl mt-10 mb-20" id="my-appointments">
          As minhas consultas
        </div>
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
