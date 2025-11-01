import { TokenProvider } from "./token";
import { useEffect, useState } from "react";

const getInitialToken = () => {
  const token = localStorage.getItem("accessToken_eco");
  return token || "";
};

const TokenProviderWrapper = ({ children }) => {
  const [token, setToken] = useState(getInitialToken);

  useEffect(() => {
    localStorage.setItem("accessToken_eco", token);
  }, [token]);

  return (
    <TokenProvider value={{ tokenId: token, setTokenId: setToken }}>
      {children}
    </TokenProvider>
  );
};

export default TokenProviderWrapper;
