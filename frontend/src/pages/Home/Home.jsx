import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import AddEditNotes from './AddEditNotes'
import { useState } from 'react'
import Modal from "react-modal"
import axiosInstance from '../../utils/axiosinstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import addNotesImg from '../../assets/images/add-notes.svg';
import NoDataImg from '../../assets/images/No-data.svg';
const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  })
  //added constants and dont forget the import
  cosnt[allNotes, setAllNotes] = useState([])
  const [userInfo, setuserInfo] = useState(null);
  const [isSearch, setisSearch] = useState(false);
  const navigate = useNavigate();
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });
  };
  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: "",
      type: ""

    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",

    });
  };
  //get user information
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("get-user");
      if (response.date && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  //add this also 
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("get-ALl-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("an unexpected error has occurred please try again later");
    }
  };

  //delete  notes
  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete("/delete-Note/" + noteData, {


      });
      if (response.data && !response.data.error) {
        showToastMessage("note deleted successfully", 'delete')
        getAllNotes()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("an unexpected error occurred");
      }
    }
  }
  //search for note 
  const onSearchNote = async (query)=>{
    try{
      const response = await axiosInstance.get("/search-notes",{
        params:{query}
      });
    
    if(response.data&&response.data.notes) {
      setIsSearch(true);
      setAllNotes(response.data.notes);
    }
  }
    catch(error){
      console.log("an unexpected error has occurred please try again later");
    }
  };


  handleClearSearch = ()=>{
    setIsSearch(false);
    getAllNotes();
  }



  useEffect(() => {
    getAllNotes()
    getUserInfo();
    return () => { };
  }, []);



  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch= {handleClearSearch} />
      <div className='container mx-auto'>
        {allNotes.length > 0 ? <div className='grid grid-cols-3 gap-4 mt-8'>
          {allnotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => { handleEdit(item) }}
              onDelete={() => deleteNote(item)}
              onPinNote={() => { }}
            />
          ))}

        </div> : (<EmptyCard imgSrc={isSearch ? NoDataImg : addNotesImg}
         message={ isSearch ? `Oops no notes found matching you search.`:`start creating your first note ! click the 'add' button to jot down you thoughts,ideas,and reminders. lets get started!!  `} />)}
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
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home