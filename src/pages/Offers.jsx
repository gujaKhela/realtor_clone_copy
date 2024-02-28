import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Spinner } from "../components/Spinner";
import { ListingItem } from "../components/ListingItem";

export const Offers = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [lastFetchListings, setLastFetchListings] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const listingSnap = await getDocs(q);
        const lastVisable = listingSnap.docs[listingSnap.docs.length - 1];
        setLastFetchListings(lastVisable);
        const listings = [];

        listingSnap.forEach((listing) =>
          listings.push({
            id: listing.id,
            data: listing.data(),
          })
        );
        setListings(listings);
        setLoading(false);
        // console.log(listings)
      } catch (error) {
        toast.error("could not fetch listing");
      }
    }

    fetchListings();
  }, []);

  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchListings),
        limit(4)
      );
      const listingSnap = await getDocs(q);
      const lastVisable = listingSnap.docs[listingSnap.docs.length - 1];
      setLastFetchListings(lastVisable);
      const listings = [];

      listingSnap.forEach((listing) =>
        listings.push({
          id: listing.id,
          data: listing.data(),
        })
      );
      setListings((prevState)=>[...prevState,...listings]);
      setLoading(false);
      // console.log(listings)
    } catch (error) {
      toast.error("could not fetch listing");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center my-6 font-bold">Offers</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          {lastFetchListings && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 my-6 hover:border-slate-600 rounded transition duration-200 ease-in-out "
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};
