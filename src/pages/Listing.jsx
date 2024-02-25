import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { FaShare } from "react-icons/fa";

import { EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);

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
          setTimeout(()=>{
            setLinkCopied(false)
          },2000)
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>

      {linkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-500 rounded-md bg-white p-2 z-10 "  >Link Copied</p>
      )}
    </main>
  );
}
