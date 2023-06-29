import React, { useEffect, useState } from 'react';
import './App.css';
import { SchemaModal } from './component/SchemaModal';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [success]);

  return (
    <div className='backgroundPattern'>
      {success && <div class="alert alert-success" role="alert">
        Successfully added !
      </div>}
      <SchemaModal showModal={showModal} handleModalClose={handleModalClose} setSuccess={setSuccess} />
      <button className="btn btn-primary m-5" onClick={handleModalOpen} >
        Add Segment
      </button>
    </div>
  );
}

export default App;
