import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  updateDoc,
  where,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { FcHome } from "react-icons/fc";
import { ListingItem } from "../components/ListingItem.jsx";

export const Profile = () => {
  const [changeProfileDetails, setChangeProfileDetails] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  function onLogOut() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName != name) {
        //change on firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //update on firestore
        const docRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Update profile details succesful");
    } catch (error) {
      toast.error("Can not to change profile credentials");
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold text-center mt-6">My Profile</h1>
        <div className="mx-4 sm:w-[50%]">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeProfileDetails}
              onChange={onChange}
              className={`w-full text-xl p-4 text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mt-6 ${
                changeProfileDetails && "bg-red-200 focus:bg-red-200"
              }`}
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
                <span
                  onClick={() => {
                    changeProfileDetails && onSubmit();
                    setChangeProfileDetails((prev) => !prev);
                  }}
                  className={`ml-2 text-red-600 hover:text-red-700 transition ease-in-out duration-200 cursor-pointer `}
                >
                  {changeProfileDetails ? "Apply Change" : "Edit"}
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-7 py-3 rounded shadow-md uppercase text-sm font-medium hover:bg-blue-700 transition duration-200 easy-in-out hover:shadow-lg active:bg-blue-800 mt-6"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center "
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or Rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className=" text-2xl font-semibold text-center ">My Listings</h2>
            <ul>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};
