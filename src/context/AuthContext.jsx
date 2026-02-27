import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, provider } from "./firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const fallbackProfile = {
          uid:         firebaseUser.uid,
          email:       firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email,
          firstName:   firebaseUser.displayName?.split(" ")[0] || "",
          lastName:    firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
          photo:       firebaseUser.photoURL || null,
          role:        "Administrator",
          phone:       "",
          dept:        "",
          location:    "",
          bio:         "",
        };
        setProfile(fallbackProfile);
        try {
          const ref  = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setProfile({ ...fallbackProfile, ...snap.data() });
          } else {
            const newProfile = { ...fallbackProfile, createdAt: serverTimestamp(), lastLogin: serverTimestamp() };
            await setDoc(ref, newProfile);
            setProfile(newProfile);
          }
          await setDoc(ref, { lastLogin: serverTimestamp() }, { merge: true });
        } catch (err) {
          console.warn("Firestore unavailable:", err.message);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  // ── Email / Password Sign In ──────────────────────────────────────────────
  const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // ── Email / Password Sign Up ──────────────────────────────────────────────
  const signUpWithEmail = async ({ firstName, lastName, email, password, role = "Administrator" }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    const displayName = `${firstName} ${lastName}`.trim();
    await firebaseUpdateProfile(firebaseUser, { displayName });
    const newProfile = {
      uid: firebaseUser.uid, email: firebaseUser.email,
      displayName, firstName, lastName,
      photo: null, role, phone: "", dept: "", location: "", bio: "",
      createdAt: serverTimestamp(), lastLogin: serverTimestamp(),
    };
    try { await setDoc(doc(db, "users", firebaseUser.uid), newProfile); }
    catch (err) { console.warn("Firestore write failed:", err.message); }
    setProfile(newProfile);
    return firebaseUser;
  };

  // ── Update Profile Fields ─────────────────────────────────────────────────
  // Updates Firestore + Firebase Auth displayName
  const updateProfileData = async (fields) => {
    if (!user) throw new Error("Not signed in");
    const displayName = `${fields.firstName || ""} ${fields.lastName || ""}`.trim();
    // Update Firebase Auth display name
    await firebaseUpdateProfile(user, { displayName });
    // Merge into Firestore
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { ...fields, displayName }, { merge: true });
    // Update local state immediately
    setProfile(prev => ({ ...prev, ...fields, displayName }));
  };

  // ── Upload Profile Photo (base64 stored in Firestore) ────────────────────
  const updateProfilePhoto = async (base64DataUrl) => {
    if (!user) throw new Error("Not signed in");
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { photo: base64DataUrl }, { merge: true });
    setProfile(prev => ({ ...prev, photo: base64DataUrl }));
  };

  // ── Change Password (requires re-auth for security) ──────────────────────
  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error("Not signed in");
    // Re-authenticate first
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    // Then update
    await updatePassword(user, newPassword);
  };

  // ── Change Email (requires re-auth) ──────────────────────────────────────
  const changeEmail = async (currentPassword, newEmail) => {
    if (!user) throw new Error("Not signed in");
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { email: newEmail }, { merge: true });
    setProfile(prev => ({ ...prev, email: newEmail }));
  };

  // ── Send Password Reset Email ─────────────────────────────────────────────
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signInWithGoogle, signInWithEmail, signUpWithEmail,
      updateProfileData, updateProfilePhoto,
      changePassword, changeEmail, resetPassword,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}