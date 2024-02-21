import { toast } from "react-toastify";

export const Home = () => {
  return (
    <>
      <div>
        <a href="/" target="_blank">
          {/* <img src={siteLogo} className="" alt="logo to my site" /> */}
        </a>
      </div>
      <h1>Vite + React</h1>
      {toast.warning("still working on this PROJECT!")}
    </>
  );
};
