import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaParking, FaBed, FaChair, FaBath } from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { Contact } from "../components/Contact";

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [contactLandLord, setContactLandLord] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }

  // console.log(listing.geoLocation.lat);
  // console.log(listing.geoLocation.lng);
  return (
    <main>
      <swiper-container
        slidesPerView={1}
        effect={"fade"}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <swiper-slide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </swiper-slide>
        ))}
      </swiper-container>

      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-10 h-10 flex justify-center items-center "
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setLinkCopied(true);
          setTimeout(() => {
            setLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>

      {linkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-500 rounded-md bg-white p-2 z-10 ">
          Link Copied
        </p>
      )}

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5 ">
        <div className="w-full ">
          <p className="text-2xl font-bold mb-3 text-blue-900 ">
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month " : ""}
          </p>
          <p className="flex flex-row items-center mt-6 mb-3 font-semibold ">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>

          <div className="flex justify-start space-x-4 items-center w-[75%] ">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md ">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>

            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 text-white text-center p-1 rounded-md font-semibold shadow-md ">
                ${+listing.regularPrice - +listing.discountedPrice} Discount
              </p>
            )}
          </div>
          <p className="my-3">
            <span className="font-semibold ">Description - </span>
            {listing.description}
          </p>

          <ul className="flex space-x-2 items-center sm:space-x-10 text-sm font-semibold mb-6 ">
            <li className="flex items-center whitespace-nowrap ">
              <FaBed className="mr-1 text-lg" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap ">
              <FaBath className="mr-1 text-lg" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap ">
              <FaParking className="mr-1 text-lg" />
              {listing.parking ? `Parking spot` : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap ">
              <FaChair className="mr-1 text-lg" />
              {listing.furnished ? `Furnished` : "Not furnished"}
            </li>
          </ul>

          {listing.userRef !== auth.currentUser?.uid && !contactLandLord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandLord(true)}
                className="px-7 py-3 text-center w-full bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg font-medium text-sm uppercase transition duration-200 ease-in-out text-white rounded "
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandLord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.geoLocation.lat, listing.geoLocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geoLocation.lat, listing.geoLocation.lng]}
            >
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
