import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, provider } from "./firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);   // Firebase user object
  const [profile, setProfile] = useState(null);   // Firestore user profile
  const [loading, setLoading] = useState(true);   // waiting for Firebase to restore session

  // ── Listen for auth state (persists across page refresh automatically) ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadOrCreateProfile(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Load existing profile or create one on first sign-in ──
  const loadOrCreateProfile = async (firebaseUser) => {
    const ref  = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setProfile(snap.data());
    } else {
      // First time this Google account has signed in — create their profile
      const newProfile = {
        uid:         firebaseUser.uid,
        email:       firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email,
        photo:       firebaseUser.photoURL    || null,
        role:        "Administrator",
        createdAt:   serverTimestamp(),
        lastLogin:   serverTimestamp(),
      };
      await setDoc(ref, newProfile);
      setProfile(newProfile);
    }

    // Always update lastLogin
    await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true });
  };

  // ── Sign in with Google popup ──
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  // ── Sign out ──
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const value = { user, profile, loading, signInWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}