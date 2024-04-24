import { createContext,useState } from "react";

const userType  = createContext();

const UserContext = ({children}) => {
   const [userId,setUserId] = useState("");
//    const [senderId,setSenderId] = useState("");

   return(
    <userType.Provider value={{userId,setUserId}}>
        {children}
    </userType.Provider>
   )

}


export {userType,UserContext}