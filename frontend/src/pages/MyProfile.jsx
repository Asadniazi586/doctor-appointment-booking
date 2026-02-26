import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import {assets} from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const {userData,setUserData,token,backendUrl,loadUserProfileData} = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image,setImage] = useState(false)

  const updateUserProfileData = async ()=>{
    try {
      const formData = new FormData()
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)
      image && formData.append('image',image)
      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        toast.success(data.message)
      await loadUserProfileData()
      setIsEdit(false)
      setImage(false)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  // Add a click handler to debug
  const handleProfileClick = (e) => {
    console.log("Profile clicked on mobile");
    // The actual navigation should be handled by your router/link component
  }

  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm w-full mx-auto px-4 py-4' onClick={handleProfileClick}>
      {/* Profile Image Section */}
      <div className='flex justify-center w-full'>
        {isEdit ? (
          <label htmlFor="image" className='cursor-pointer inline-block'>
            <div className='relative'>
              <img 
                className='w-32 h-32 rounded-full object-cover opacity-75' 
                src={image ? URL.createObjectURL(image) : userData.image} 
                alt="profile" 
                onClick={(e) => e.stopPropagation()}
              />
              {!image && (
                <img 
                  className='w-8 absolute bottom-8 right-8' 
                  src={assets.upload_icon} 
                  alt="upload" 
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <input 
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  e.stopPropagation();
                }} 
                type="file" 
                id='image' 
                hidden
              />
            </div>
          </label>
        ) : (
          <img 
            className='w-32 h-32 rounded-full object-cover' 
            src={userData.image} 
            alt="profile" 
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {/* Name Section */}
      <div className='text-center w-full'>
        {isEdit ? (
          <input 
            className='bg-gray-50 text-2xl font-medium w-full max-w-xs mt-4 text-center mx-auto px-2 py-1 border border-gray-300 rounded' 
            value={userData.name} 
            onChange={e => setUserData(prev => ({...prev, name: e.target.value}))} 
            type="text" 
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p 
            className='font-medium text-2xl text-neutral-800 mt-4 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              setIsEdit(true);
            }}
          >
            {userData.name}
          </p>
        )}
      </div>
      
      <hr className='bg-zinc-400 h-[1px] border-none my-2'/>

      {/* Contact Information */}
      <div className='w-full'>
        <p className='text-neutral-500 underline mt-3 text-center'>CONTACT INFORMATION</p>
        <div className='flex flex-col gap-3 mt-3 text-neutral-700 w-full'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4'>
            <p className='font-medium w-full sm:w-24'>Email id:</p>
            <p className='text-blue-500 break-all'>{userData.email}</p>
          </div>
          
          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4'>
            <p className='font-medium w-full sm:w-24'>Phone:</p>
            {isEdit ? (
              <input 
                className='bg-gray-100 w-full sm:max-w-52 px-2 py-1 border border-gray-300 rounded' 
                value={userData.phone} 
                onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))} 
                type="tel" 
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p 
                className='text-blue-400 cursor-pointer'
                onClick={(e) => e.stopPropagation()}
              >
                {userData.phone}
              </p>
            )}
          </div>
          
          <div className='flex flex-col sm:flex-row gap-1 sm:gap-4'>
            <p className='font-medium w-full sm:w-24'>Address:</p>
            {isEdit ? (
              <div className='w-full' onClick={(e) => e.stopPropagation()}>
                <input 
                  className='bg-gray-50 w-full mb-2 px-2 py-1 border border-gray-300 rounded' 
                  onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))} 
                  type="text" 
                  value={userData.address?.line1 || ''} 
                  placeholder="Address line 1"
                />
                <input 
                  className='bg-gray-50 w-full px-2 py-1 border border-gray-300 rounded' 
                  type="text" 
                  onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))} 
                  value={userData.address?.line2 || ''} 
                  placeholder="Address line 2"
                />
              </div>
            ) : (
              <p 
                className='text-gray-500 cursor-pointer'
                onClick={(e) => e.stopPropagation()}
              >
                {userData.address?.line1 || ''}
                <br />
                {userData.address?.line2 || ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className='w-full'>
        <p className='text-neutral-500 underline mt-3 text-center'>BASIC INFORMATION</p>
        <div className='flex flex-col gap-3 mt-3 text-neutral-700 w-full'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4'>
            <p className='font-medium w-full sm:w-24'>Gender:</p>
            {isEdit ? (
              <select 
                className='w-full sm:max-w-20 bg-gray-100 px-2 py-1 border border-gray-300 rounded' 
                onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))} 
                value={userData.gender || ''}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p 
                className='text-gray-400 cursor-pointer'
                onClick={(e) => e.stopPropagation()}
              >
                {userData.gender}
              </p>
            )}
          </div>
          
          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4'>
            <p className='font-medium w-full sm:w-24'>Birthday:</p>
            {isEdit ? (
              <input 
                className='w-full sm:max-w-28 bg-gray-100 px-2 py-1 border border-gray-300 rounded' 
                type="date" 
                onChange={(e) => setUserData(prev => ({...prev, dob: e.target.value}))} 
                value={userData.dob || ''}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p 
                className='text-gray-400 cursor-pointer'
                onClick={(e) => e.stopPropagation()}
              >
                {userData.dob}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='mt-8 text-center w-full'>
        {isEdit ? (
          <button 
            className='border border-primary px-8 py-3 rounded-full bg-[#5f6FFF] text-white font-medium w-full sm:w-auto min-w-[200px] active:bg-[#4a5ae8] transition-colors' 
            onClick={(e) => {
              e.stopPropagation();
              updateUserProfileData();
            }}
          >
            Save Information
          </button>
        ) : (
          <button 
            className='border border-primary px-8 py-3 rounded-full bg-white text-primary font-medium w-full sm:w-auto min-w-[200px] active:bg-gray-100 transition-colors' 
            onClick={(e) => {
              e.stopPropagation();
              setIsEdit(true);
            }}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile