import React, { useState } from "react";
import { Spinner } from "../components/Spinner";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {addDoc, collection, serverTimestamp}from "firebase/firestore"
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export const CreateListing = () => {
  const navigate = useNavigate()
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longtitude: 0,
  });

  const {
    type,
    bathrooms,
    name,
    bedrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longtitude,
  } = formData;

  function onChange(e) {
    let boolien = null;

    if (e.target.value === "true") {
      boolien = true;
    }
    if (e.target.value === "false") {
      boolien = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolien ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discaunted Price needs to be less then regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("maxsimum 6 images are allowed");
      return;
    }

    let geoLocation = {};
    let location;

    if (!geoLocationEnabled) {
      const encodedAddress = encodeURIComponent(address);

      const apiUrl = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodedAddress}&language=en&limit=1&access_token=${
        import.meta.env.VITE_API_GEOLOCATION
      }`;

      // console.log(apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();

      geoLocation.lat = data.features?.[0]?.geometry?.coordinates[1] ?? 0;
      geoLocation.lng = data.features?.[0]?.geometry?.coordinates[0] ?? 0;

      // console.log(data);
      location = data.features.length == 0 && undefined;

      if (location === undefined || null) {
        setLoading(false);
        toast.error("Please enter a correct address");
        return;
      }
    } else {
      geoLocation.lat = latitude;
      geoLocation.lng = longtitude;
    }

    async function storeImage(img) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((img) => storeImage(img))
    ).catch((error) => {
      setLoading(false);
      toast.error("Image not uploaded");
      return;
    });



    const formDataCopy = {
      ...formData,
      imgUrls,
      geoLocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formDataCopy.offer &&delete formDataCopy.discountedPrice
    delete formDataCopy.latitude;
    delete formDataCopy.longtitude;

    
    const docRef = await addDoc(collection(db,"listings"),formDataCopy)
    setLoading(false);
    toast.success("listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    // console.log(imgUrls);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Crete a List</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold ">Sell / Rent</p>
        <div className="flex  ">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength={32}
          minLength={10}
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 "
        />
        <div className="mt-6 flex space-x-6">
          <div>
            <p className="text-lg font-semibold ">Beds</p>
            <input
              type="number"
              name="bedrooms"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 text-center transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              min="1"
              max="15"
              required
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              name="bathrooms"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 text-center transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              min="1"
              max="15"
              required
            />
          </div>
        </div>

        <p className="text-lg mt-6 font-semibold ">Parking Spot</p>
        <div className="flex  ">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold ">Furnished</p>
        <div className="flex  ">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 "
        />
        <p className="text-lg mt-6 font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 "
        />
        {geoLocationEnabled && (
          <div className="mt-6 flex space-x-6 justify-start">
            <div>
              <p className="text-lg font-semibold ">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                min="-90"
                max="90"
                className="w-full px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center "
              />
            </div>
            <div>
              <p className="text-lg font-semibold ">Longtitude</p>
              <input
                type="number"
                id="longtitude"
                value={longtitude}
                onChange={onChange}
                min="-180"
                max="180"
                className="w-full px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center "
              />
            </div>
          </div>
        )}

        <p className="text-lg mt-6 font-semibold ">Offer</p>
        <div className="flex  ">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <div className="mt-6 flex items-center ">
          <div>
            <p className="text-lg font-semibold ">Regular Price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="40000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div>
                  <p className="text-md w-full whitespace-nowrap ">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {offer && (
          <div className="mt-6 flex items-center ">
            <div>
              <p className="text-lg font-semibold ">Discounted Price </p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="40000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap ">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-lg font-semibold ">Images</p>
          <p className="text-gray-600 ">
            the first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="my-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-200 ease-in-out"
        >
          Create Listing{" "}
        </button>
      </form>
    </main>
  );
};
