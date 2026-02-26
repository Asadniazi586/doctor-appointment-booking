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

  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm px-4 md:px-0 min-h-screen w-full'>
      {/* Profile Image Section */}
      <div className='flex justify-center md:justify-start w-full'>
        {isEdit ? (
          <label htmlFor="image" className='cursor-pointer'>
            <div className='relative inline-block'>
              <img 
                className='w-28 sm:w-32 md:w-36 rounded-full md:rounded opacity-75 mx-auto md:mx-0' 
                src={image ? URL.createObjectURL(image) : userData.image} 
                alt="profile" 
              />
              {!image && (
                <img 
                  className='w-8 sm:w-10 absolute bottom-8 sm:bottom-10 right-8 sm:right-10 md:bottom-12 md:right-12' 
                  src={assets.upload_icon} 
                  alt="upload" 
                />
              )}
              <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden/>
            </div>
          </label>
        ) : (
          <img 
            className='w-28 sm:w-32 md:w-36 rounded-full md:rounded mx-auto md:mx-0' 
            src={userData.image} 
            alt="profile" 
          />
        )}
      </div>

      {/* Name Section */}
      <div className='text-center md:text-left'>
        {isEdit ? (
          <input 
            className='bg-gray-50 text-2xl sm:text-3xl font-medium w-full max-w-xs md:max-w-60 mt-4 text-center md:text-left px-2' 
            value={userData.name} 
            onChange={e=>setUserData(prev => ({...prev, name:e.target.value}))} 
            type="text" 
          />
        ) : (
          <p className='font-medium text-2xl sm:text-3xl text-neutral-800 mt-4'>{userData.name}</p>
        )}
      </div>
      
      <hr className='bg-zinc-400 h-[1px] border-none'/>

      {/* Contact Information */}
      <div>
        <p className='text-neutral-500 underline mt-3 text-center md:text-left'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500 break-words'>{userData.email}</p>
          
          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input 
              className='bg-gray-100 w-full max-w-xs sm:max-w-52 px-2 py-1' 
              value={userData.phone} 
              onChange={e=>setUserData(prev => ({...prev, phone:e.target.value}))} 
              type="tel" 
            />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}
          
          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div className='w-full'>
              <input 
                className='bg-gray-50 w-full mb-2 px-2 py-1' 
                onChange={(e)=>setUserData(prev => ({...prev, address:{...prev.address, line1: e.target.value}}))} 
                type="text" 
                value={userData.address?.line1 || ''} 
                placeholder="Address line 1"
              />
              <input 
                className='bg-gray-50 w-full px-2 py-1' 
                type="text" 
                onChange={(e)=>setUserData(prev => ({...prev, address:{...prev.address, line2: e.target.value}}))} 
                value={userData.address?.line2 || ''} 
                placeholder="Address line 2"
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {userData.address?.line1 || ''}
              <br />
              {userData.address?.line2 || ''}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className='text-neutral-500 underline mt-3 text-center md:text-left'>BASIC INFORMATION</p>
        <div className='grid grid-cols-1 sm:grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select 
              className='w-full max-w-xs sm:max-w-20 bg-gray-100 px-2 py-1' 
              onChange={(e)=> setUserData(prev => ({...prev, gender: e.target.value}))} 
              value={userData.gender || ''}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}
          
          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input 
              className='w-full max-w-xs sm:max-w-28 bg-gray-100 px-2 py-1' 
              type="date" 
              onChange={(e)=> setUserData(prev => ({...prev, dob: e.target.value}))} 
              value={userData.dob || ''}
            />
          ) : (
            <p className='text-gray-400'>{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className='mt-10 text-center md:text-left'>
        {isEdit ? (
          <button 
            className='border border-primary px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all cursor-pointer min-w-[150px] touch-manipulation' 
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button 
            className='border border-primary px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all cursor-pointer min-w-[150px] touch-manipulation' 
            onClick={()=>setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile