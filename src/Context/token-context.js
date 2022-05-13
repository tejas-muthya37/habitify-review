import { createContext, useContext, useState } from "react";

const TokenContext = createContext();

const TokenProvider = ({ children }) => {
  let encodedTokenLocal = localStorage.getItem("ENCODED_TOKEN_3");

  if (encodedTokenLocal === null) encodedTokenLocal = "";

  const [encodedToken, setEncodedToken] = useState(encodedTokenLocal);

  return (
    <TokenContext.Provider value={{ encodedToken, setEncodedToken }}>
      {children}
    </TokenContext.Provider>
  );
};

const useToken = () => useContext(TokenContext);

export { TokenProvider, useToken };
