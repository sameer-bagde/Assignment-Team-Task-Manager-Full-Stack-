import React from "react";
import SignupForm from "./SignupForm";

const Signup: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120] transition-colors relative overflow-hidden p-4">
    {/* Abstract background blobs */}
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
    
    <div className="w-full max-w-[420px] relative z-10 my-8">
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs tracking-widest shadow-lg shadow-indigo-500/20">
            TTM
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-2xl font-bold leading-tight text-slate-800 dark:text-white tracking-tight">Team Task</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 -mt-0.5">Manager</p>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create an account</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Join your team and start collaborating</p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 backdrop-blur-xl transition-all">
        <SignupForm />
      </div>
    </div>
  </div>
);

export default Signup;
