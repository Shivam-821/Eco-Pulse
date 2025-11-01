import { createContext, useContext } from 'react';

const TokenContext = createContext(undefined);

export const TokenProvider = TokenContext.Provider;

export default function useToken() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useToken must be used inside tokenProvider");
  return ctx;
}