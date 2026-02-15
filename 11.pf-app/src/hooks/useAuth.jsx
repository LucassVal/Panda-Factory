import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

/**
 * User types for Panda Factory
 */
export const UserType = {
  FOUNDER: "founder", // Lucas - full access, Ed25519 signed
  DEV: "dev", // Developers - SDK access
  USER: "user", // Regular users - basic access
  GUEST: "guest", // Not logged in
};

/**
 * Auth methods
 */
export const AuthMethod = {
  GOOGLE: "google",
  EMAIL: "email",
};

/**
 * Mock user data for development
 * 2-tier model: Founder + User (User can toggle Dev Mode in-app)
 */
const MOCK_USERS = {
  "founder@panda.com": {
    uid: "founder-001",
    email: "founder@panda.com",
    displayName: "Lucas Valério",
    userType: UserType.FOUNDER,
    founderPercent: 5,
    ed25519PublicKey: "mock_public_key_hex",
  },
  "user@panda.com": {
    uid: "user-demo",
    email: "user@panda.com",
    displayName: "Demo User",
    userType: UserType.USER,
    pcBalance: 100,
  },
};

/**
 * Auth Context
 */
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("panda_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("panda_user");
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login with Google
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual Firebase Auth
      // const provider = new GoogleAuthProvider();
      // const result = await signInWithPopup(auth, provider);
      // const firebaseUser = result.user;

      // Mock: Simulate Google login
      await new Promise((r) => setTimeout(r, 1000));

      // For demo, login as dev user
      const mockUser = {
        uid: "google-user-001",
        email: "googleuser@gmail.com",
        displayName: "Google User",
        userType: UserType.USER,
        authMethod: AuthMethod.GOOGLE,
        photoURL: null,
      };

      setUser(mockUser);
      localStorage.setItem("panda_user", JSON.stringify(mockUser));
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with Email/Password
   */
  const loginWithEmail = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual Firebase Auth
      // const result = await signInWithEmailAndPassword(auth, email, password);

      // Mock: Check against mock users
      await new Promise((r) => setTimeout(r, 500));

      const mockUser = MOCK_USERS[email.toLowerCase()];

      if (!mockUser) {
        throw new Error("User not found");
      }

      // In real app, verify password with Firebase
      if (password.length < 6) {
        throw new Error("Invalid password");
      }

      const userWithMethod = {
        ...mockUser,
        authMethod: AuthMethod.EMAIL,
      };

      setUser(userWithMethod);
      localStorage.setItem("panda_user", JSON.stringify(userWithMethod));
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      // TODO: Firebase signOut
      // await signOut(auth);

      setUser(null);
      localStorage.removeItem("panda_user");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /**
   * Check if user is Founder
   */
  const isFounder = user?.userType === UserType.FOUNDER;

  /**
   * Check if user is Dev
   */
  const isDev = user?.userType === UserType.DEV || isFounder;

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user;

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    isFounder,
    isDev,
    loginWithGoogle,
    loginWithEmail,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export default useAuth;
