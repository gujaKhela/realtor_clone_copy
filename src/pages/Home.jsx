import { toast } from "react-toastify";
import { useEffect } from "react";

export const Home = () => {
  useEffect(() => {
    toast.warning("still working on this PROJECT!");
  }, []);
  return (
    <>
      <div>
        <a href="/" target="_blank">
          {/* <img src={siteLogo} className="" alt="logo to my site" /> */}
        </a>
      </div>
      <h1>Vite + React</h1>
    </>
  );
};
