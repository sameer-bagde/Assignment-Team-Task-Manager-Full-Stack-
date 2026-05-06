import React from "react";
import SignupForm from "./SignupForm";

const Signup: React.FC = () => (
<<<<<<< HEAD
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120] transition-colors relative overflow-hidden p-4">
    {/* Abstract background blobs */}
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
    
    <div className="w-full max-w-[420px] relative z-10 my-8">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="font-serif font-bold text-3xl text-indigo-600 dark:text-indigo-400 mb-6 drop-shadow-sm">Smarter Tasker</h2>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create an account</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Join your team and start collaborating</p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 backdrop-blur-xl transition-all">
=======
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 transition-colors">
    <div className="w-full max-w-md mx-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 px-8 py-10 transition-colors">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl mb-4 shadow-lg">
            ✦
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Create account</h1>

        </div>
>>>>>>> 1978db6c7bc8e3ec64dc6038bf813c48f00bae27
        <SignupForm />
      </div>
    </div>
  </div>
);

export default Signup;
