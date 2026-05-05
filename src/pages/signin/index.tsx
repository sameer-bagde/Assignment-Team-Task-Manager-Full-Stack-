import React from "react";
import SigninForm from "./SigninForm";

const Signin: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120] transition-colors relative overflow-hidden p-4">
    {/* Abstract background blobs for modern feel */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
    
    <div className="w-full max-w-[420px] relative z-10">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="font-serif font-bold text-3xl text-indigo-600 dark:text-indigo-400 mb-6 drop-shadow-sm">Smarter Tasker</h2>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your account to continue</p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 backdrop-blur-xl transition-all">
        <SigninForm />
      </div>
    </div>
  </div>
);

export default Signin;
