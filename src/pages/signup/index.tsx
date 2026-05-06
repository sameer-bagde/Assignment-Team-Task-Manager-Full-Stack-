import React from "react";
import SignupForm from "./SignupForm";

const Signup: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 transition-colors">
    <div className="w-full max-w-md mx-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 px-8 py-10 transition-colors">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl mb-4 shadow-lg">
            ✦
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Create account</h1>

        </div>
        <SignupForm />
      </div>
    </div>
  </div>
);

export default Signup;
