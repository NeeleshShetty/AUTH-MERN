import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [formData,setFormData] = useState('')
  const navigate = useNavigate()
	
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData)
      });
      
		const data = await res.json()
		if (data.success === false) {
			setError(true);
		}
		navigate('/')
		console.log(data);
		
    } catch (error) {
      setLoading(false)
      setError(true)
    }
  }
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id] : e.target.value})
  }
  // console.log(formData);
  return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4"
			>
				
				<input
					type="email"
					placeholder="Email"
					id="email"
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="Password"
					id="password"
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
				>
					{loading ? 'Loading...' : 'Sign In'}
				</button>
				
			</form>
			<div className="flex gap-2 mt-5">
				<p>Have an account?</p>
				<Link to="/sign-up">
					<span className="text-blue-500">Sign up</span>
				</Link>
			</div>
			<p className="text-red-700 mt-5">{error && 'Something went wrong!'}</p>
		</div>
	);
}

export default Signin