import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthStatus = () => {
  const [logIn, setLogin] = useState(false);
  const [checkStatus, setCheckStatus] = useState(true);

useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user=>{
        if(user){
            setLogin(true);
        }
        setCheckStatus(false);
    }))
},[])

  return {logIn,checkStatus}
};
