import { useSelector } from "react-redux"
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import { useDispatch } from "react-redux";

const Profile = () => {
  const [image, setImage] = useState(undefined)
  const [imagePercent,setImagePercent] = useState(0)
  const [imageError, setImageError] = useState(null)
	const [formData, setFormData] = useState({})
	const [updateSuccess, setUpdateSuccess] = useState(null)
	const fileRef = useRef(null)
	const dispatch = useDispatch()
  const { currentUser,loading,error } = useSelector(state => state.user)
    // console.log(formData);

  useEffect(() => {
    if (image) {
     handleFileUpload(image)
   }
  }, [image])

  const handleFileUpload = async (image) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name
    // console.log(image.name);
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, image)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImagePercent(progress)
        console.log('Upload is' + progress + '% done');
      },
      (error) => {
        setImageError(true)
      },
      () => (
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, profilePicture: downloadUrl })
        })
      ));
  }
  
	
	const handleChange = (e) => {
		setFormData({...formData , [e.target.id] : e.target.value})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			dispatch(updateUserStart())
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await res.json()
			if (data.success === false) {
				dispatch(updateUserFailure(data))
				setUpdateSuccess(false)
			}
			dispatch(updateUserSuccess(data))
			setUpdateSuccess(true)
			// console.log(data);
		} catch (error) {
			dispatch(updateUserFailure(error))
				setUpdateSuccess(false);

		}
	}
	
	const handleDeleteAccount = async () => {
		try {
			deleteUserStart
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method:"DELETE"
			})
			const data = await res.json()
			if (data.success === false) {
				dispatch(deleteUserFailure(data))
			}

			dispatch(deleteUserSuccess())
		} catch (error) {
			dispatch(deleteUserFailure(error))
		}
	}
  return (
		<div className="w-110 flex flex-col items-center ">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-y-4 "
			>
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={(e) => setImage(e.target.files[0])}
				/>
				<img
					onClick={() => fileRef.current.click()}
					src={formData.profilePicture || currentUser.profilePicture}
					alt="profilepic"
					className="h-24 w-24 rounded-full self-center cursor-pointer object-cover m4-2"
				/>

				<p className="text-sm self-center">
					{imageError ? (
						<span className="text-red-700">
							Error uploading image (file size must be less than 2 MB)
						</span>
					) : imagePercent > 0 && imagePercent < 100 ? (
						<span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
					) : imagePercent === 100 ? (
						<span className="text-green-500">Image uploaded successfully</span>
					) : (
						''
					)}
				</p>

				<input
					defaultValue={currentUser.username}
					type="text"
					id="username"
					placeholder="Username"
					className="bg-slate-100 rounded-lg p-3 text-xl"
					onChange={handleChange}
				/>
				<input
					defaultValue={currentUser.email}
					type="email"
					id="email"
					placeholder="Email"
					className="bg-slate-100 rounded-lg p-3"
					onChange={handleChange}
				/>
				<input
					type="password"
					id="password"
					placeholder="Password"
					className="bg-slate-100 rounded-lg p-3"
					onChange={handleChange}
				/>

				<button
					disabled={loading}
					className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
				>
					{loading ? 'Loading...' : 'Update'}
				</button>
				<p className="text-green-500 self-center">
					{updateSuccess && 'Updated Successfully'}
				</p>
				
			</form>

			<div className="flex justify-between mt-5 gap-7">
				<span
					className="text-red-700 cursor-pointer "
					onClick={handleDeleteAccount}
				>
					Delete Account
				</span>
				<span className="text-red-700 cursor-pointer">Sign Out</span>
			</div>
		</div>
	);
}

export default Profile