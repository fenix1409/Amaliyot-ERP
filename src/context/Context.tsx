import { createContext, useState } from "react";

export const Context = createContext<any>({});

export const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const data = localStorage.getItem("token")
  const [token, setToken] = useState<string | null>(data ? JSON.parse(data) : null);

  localStorage.setItem("token", JSON.stringify(token))
  return (
    <Context.Provider value={{ token, setToken }}>
      {children}
    </Context.Provider>
  );
};
