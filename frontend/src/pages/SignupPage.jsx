import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare,Mail,User,Lock,EyeOff,Eye,Loader2} from 'lucide-react';
import {Link} from 'react-router-dom'
import AuthImagePattern from '../components/AuthImagePattern';
import toast from "react-hot-toast"

const SignupPage = () => {
  // make state for show password (show/hide) initial state hide
  const [showPassword, setShowPassword] = useState(false);
  // state for the form data for storing
  const [formData , setFormData] = useState({
    fullName:"",
    email:"",
    password:"",
  }) 
  // loading state
  const {signup, isSigningUp} = useAuthStore();

  // and function to validate form
  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    // if the user put in invalid email like (etfeoh@ ...)
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };
// trim to remove white space "  John Doe  " -> "John Doe" , "   " -> "" 

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = validateForm()
    if (success === true) signup(formData); //once we singup successfully so some toast for the success case
  };
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
              <MessageSquare className='size-6 text-primary'/>
              </div>
              <h1 className='text-2x1 font-bold mt-2'>Create Account</h1>
              <p className='text-base-content/60'>Get Started with your free account</p>
            </div>
          </div>
          {/* FORM */}
          {/* FULLNAME */}
          <form onSubmit={handleSubmit} className='space-y-6'>
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                <User className="w-5 h-5 text-gray-500 z-10" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="FullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>
            {/* EMAIL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500  z-20" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-12 relative z-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            {/* FORM CONTROL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500 z-10" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="size-5 text-base-content/40" />
                  ) : (
                    <EyeOff className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>  
            {/* 🔹 disabled={isSigningUp} → If isSigningUp is true, the button cannot be clicked.
            🔹 This prevents users from submitting the form multiple times while the sign-up process is happening. */}
              {/* its going to be disabled while signing up */}
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

            {/* right side */}
            {/* we will use this in two different places so we will make this reusable */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
      
    </div>
  )
}

export default SignupPage
