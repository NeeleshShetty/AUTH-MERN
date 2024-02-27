import { useSelector } from "react-redux"
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";

const Profile = () => {
  const [image, setImage] = useState(undefined)
  const [imagePercent,setImagePercent] = useState(0)
  const [imageError, setImageError] = useState(null)
  const [formData,setFormData] = useState({})
  const fileRef = useRef(null)
  const { currentUser } = useSelector(state => state.user)
    console.log(formData);

  useEffect(() => {
    if (image) {
     handleFileUpload(image)
   }
  }, [image])

  const handleFileUpload = async (image) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name
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
  

  return (
		<div className="w-110 flex flex-col items-center ">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form className="flex flex-col gap-y-4 ">
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={(e) => setImage(e.target.files[0])}
				/>
				<img
					onClick={() => fileRef.current.click()}
					src={formData.profilePicture ||  currentUser.profilePicture}
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
				/>
				<input
					defaultValue={currentUser.email}
					type="email"
					id="email"
					placeholder="Email"
					className="bg-slate-100 rounded-lg p-3"
				/>
				<input
					type="password"
					id="password"
					placeholder="Password"
					className="bg-slate-100 rounded-lg p-3"
				/>

				<button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
					Update
				</button>
			</form>

			<div className="flex justify-between mt-5 gap-7">
				<span className="text-red-700 cursor-pointer ">Delete Account</span>
				<span className="text-red-700 cursor-pointer">Sign Out</span>
			</div>
		</div>
	);
}

export default Profile