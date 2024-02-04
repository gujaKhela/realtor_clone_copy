import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const Profile = () => {
  const navigate = useNavigate()
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  function onLogOut() {
    auth.signOut();
    navigate("/")
  }
  return (
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold text-center mt-6">My Profile</h1>
      <div className="mx-4 sm:w-[50%]">
        <form>
          <input
            type="text"
            id="name"
            value={name}
            disabled
            className="w-full text-xl p-4 text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mt-6 "
          />
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full text-xl p-4 text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mt-6 "
          />

          <div className="mt-6 flex justify-between text-sm sm:text-lg">
            <p className="">
              Do you want to change your name?
              <span className="ml-2 text-red-600 hover:text-red-700 transition ease-in-out duration-200 cursor-pointer">
                Edit
              </span>
            </p>
            <p
              onClick={onLogOut}
              className=" text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer"
            >
              Sign out
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
