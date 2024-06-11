import { ArrowLeft, ChatsCircle } from 'phosphor-react';
import React from 'react';

const SideBar = ({ selectedNode, onNodeUpdate, closeNodeSelect }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleChange = (event) => {
    const newText = event.target.value;
    onNodeUpdate(selectedNode.id, { label: newText });
  };

  return (
    <div className='side-bar'>

      {selectedNode ? (
        <div className="edit-box">
          <div className='edit-header' onClick={closeNodeSelect}> <ArrowLeft /> Message </div>
          <p>Edit Text  Box</p>
          <textarea
            value={selectedNode.data.label}
            onChange={handleChange}
            placeholder="Enter Text Here"
          />
        </div>
      ) : (
        <div className='message-box' onDragStart={(event) => onDragStart(event, 'text')} draggable>
          <p><ChatsCircle color='#215bfb' /></p>
          <p>Messages</p>
        </div>
      )}
    </div>
  );
};

export default SideBar;
