import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import AddEditNotes from './AddEditNotes'
import { useState } from 'react'
import Modal from "react-modal"
import axiosInstance from '../../utils/axiosinstance'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  //added constants and dont forget the import

  const [userInfo, setuserInfo] = useState(null);
  const navigate = useNavigate();

  //get user information
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("get-user");
      if (response.date && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error) {
    if (error.response.status === 401) {
      localStorage.clear();
      navigate("/login");
    }
  }

  //add this also 

useEffect(()=>{
  getUserInfo();
  return()=>{};
  }, []);
  


return (
  <>
    <Navbar userInfo={userInfo} />
    <div className='container mx-auto'>
      <div className='grid grid-cols-3 gap-4 mt-8'>

        <NoteCard title="meeting on 7th april" date="3rd apr 2024" content="meeting on 7th april meeting on 7th april"
          tags="#meeting"
          isPinned={true}
          onEdit={() => { }}
          onDelete={() => { }}
          onPinNote={() => { }}
        />
      </div>
    </div>
    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
      onClick={() => { setOpenAddEditModal({ isShown: true, type: "add", data: null }) }}>
      <MdAdd className='text-[32px] text-white' />
    </button>
    <Modal isOpen={openAddEditModal.isShown}
      onRequestClose={() => { }}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
      }}
      contentLabel=""
      className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden"
    >
      <AddEditNotes
        type={openAddEditModal.type}
        noteData={openAddEditModal.data}
        onClose={() => { setOpenAddEditModal({ isShown: false, type: "add", data: null }) }} />
    </Modal>
  </>
)
  }

export default Home