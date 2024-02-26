import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export const Contact = ({ userRef, listing }) => {
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getLandlord() {
      const dataRef = doc(db, "users", userRef);
      const docSnap = await getDoc(dataRef);

      if (docSnap.exists()) {
        setLandlordInfo(docSnap.data());
      } else {
        toast.error("Landlord information does not exit");
      }
      console.log(docSnap.data());
    }

    getLandlord();
  }, [userRef]);

  function onChange(e) {
    setMessage(e.target.value);
  }

  return (
    <>
      {landlordInfo !== null && (
        <div className="flex flex-col w-full">
          <p>
            Contact {landlordInfo.name} for the {listing.name.toLowerCase()}
          </p>

          <div className="mt-3 mb-6">
            <textarea
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
            ></textarea>
          </div>
          <a
            href={`mailto:${landlordInfo.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              className="px-7 py-3 bg-blue-600 text-white text-center rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-200 ease-in-out w-full mb-6"
              type="button"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
};
