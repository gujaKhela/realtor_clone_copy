import React, { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

//swiper
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
//swiper end

export const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLiSting() {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      const listing = [];

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listing);
      setLoading(false);
      // console.log(listings);
    }

    fetchLiSting();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (listings.length == 0) {
    return <></>;
  }

  return (
    listings && (
      <>
        <swiper-container
          slidesPerView={1}
          pagination="true"
          navigation="true"
          effect="fade"
          modules={[EffectFade]}
          autoplay-delay="3000"
         
        >
          {listings.map(({ data, id }) => (
            <swiper-slide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center, no-repeat`,
                  backgroundSize: "cover",
                }}
                className="relative w-full h-[300px] overflow-hidden"
              ></div>
              <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
                {data.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                ${data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " / month"}
              </p>
            </swiper-slide>
          ))}
        </swiper-container>
      </>
    )
  );
};
