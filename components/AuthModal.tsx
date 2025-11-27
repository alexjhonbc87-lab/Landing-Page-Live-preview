import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  AuthError 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../services/firebase';
import { X, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIsLogin?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 1. Create Authentication User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Create User Document in Firestore
        // This ensures the "users" collection is populated
        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            createdAt: serverTimestamp(),
            plan: "starter", // Default plan
            updatedAt: serverTimestamp()
          });
        } catch (dbError) {
          console.error("Error creating user profile in database:", dbError);
          // We continue even if DB write fails, as Auth succeeded
        }
      }
      onClose(); 
    } catch (err: any) {
      console.error(err);
      let msg = "An unexpected error occurred.";
      if (err.code === 'auth/invalid-email') msg = "Invalid email address.";
      if (err.code === 'auth/user-disabled') msg = "This account has been disabled.";
      if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/email-already-in-use') msg = "Email is already in use.";
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      if (err.code === 'auth/invalid-credential') msg = "Invalid credentials provided.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin 
                ? 'Sign in to access your landing page studio.' 
                : 'Join Project Starlit to build unlimited pages.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-gray-700 rounded-lg focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none text-white text-sm transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-gray-700 rounded-lg focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none text-white text-sm transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-violet-900/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};