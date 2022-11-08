import { useKeycloak } from "@react-keycloak/web";
import { createContext, FC, useEffect, useState } from "react";

interface UserContextState {
  user: User
}

interface User {
  acr?: string;
  aud?: string;
  auth_time?: string;
  azp?: string;
  email_verified?: boolean;
  exp?: number;
  idToken?: string;
  token?: string;
}

const defaultState = {
    user: {} as User    
};

const UserContext = createContext<UserContextState>(defaultState);

const UserContextProvider: FC = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    if (initialized === true && keycloak.authenticated) {
      const tokenParsed = keycloak as User;
      setUser(tokenParsed)
    }
  }, [initialized]);
  
  return <UserContext.Provider value={
    {user: user}
  }>
    {children}
  </UserContext.Provider>;
};

export { UserContextProvider, UserContext };
