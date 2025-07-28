import { useStorageState } from "@/hooks/useSecureStorage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

type UserProps = User | null;

interface AuthContextType {
  session?: AuthModel | undefined;
  user: UserProps;
  token: string | undefined;
  authenticate: (token: string, user: UserProps) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
  isAuthReady: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: undefined,
  authenticate: async () => {},
  logout: async () => {},
  session: undefined,
  updateUser: async () => {},
  isAuthReady: false,
});

// This hook can be used to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useAuth must be wrapped in a <AuthProvider />");
    }
  }

  return value;
}

// Helper function to serialize/deserialize user data
const storeUserData = async (key: string, user: User) => {
  await SecureStore.setItemAsync(key, JSON.stringify(user));
};

const getUserData = async (key: string): Promise<User | null> => {
  const userString = await SecureStore.getItemAsync(key);
  return userString ? JSON.parse(userString) : null;
};

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [[_, session], setSession] = useStorageState("_authState");
  const [isAuthReady, setIsAuthReady] = useState(false);

  // useEffect(() => {
  //   const debugStorage = async () => {
  //     const token = await SecureStore.getItemAsync("authToken");
  //     const user = await getUserData("authUser");
  //     console.log("Persisted Auth:",{ token, user }); // Check Expo DevTools
  //   };
  //   debugStorage();
  // }, [session]);

  // Sync token from SecureStore on mount
  useEffect(() => {
    const loadPersistedAuth = async () => {
      const [token, user] = await Promise.all([
        SecureStore.getItemAsync("authToken"),
        getUserData("authUser"),
      ]);

      if (token && user) {
        setSession({ token, user });
      }
      setIsAuthReady(true);
    };
    loadPersistedAuth();
  }, []);

  const updateUser = async (updatedUser: Partial<User>) => {
    if (!session?.user) throw new Error("No authenticated user");
    if (!updatedUser) throw new Error("Invalid user data");
    const user = { ...session.user, ...updatedUser };
    setSession({ ...session, user });
    await storeUserData("authUser", user);
  };

  const authenticate = async (token: string, user: UserProps) => {
    try {
      if (!token || !user) throw new Error("Token and user required");
      await Promise.all([
        SecureStore.setItemAsync("authToken", token),
        storeUserData("authUser", user),
      ]);
      setSession({ token, user });
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync("authToken"),
      SecureStore.deleteItemAsync("authUser"),
    ]);
    setSession(null);
  };

  const value = {
    user: session?.user || null,
    token: session?.token,
    authenticate,
    logout,
    updateUser,
    isAuthReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
