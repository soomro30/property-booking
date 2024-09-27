import React, { useState } from 'react';

const ActionCell = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  console.log("ActionCell rendered for row:", props.rowIndex, "with data:", props.data);

  const toggleMenu = (event) => {
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsOpen(!isOpen);
    console.log("Menu toggled for row:", props.rowIndex, "isOpen:", !isOpen);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <button
        onClick={toggleMenu}
        style={{
          background: 'none',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          padding: '5px 10px',
          fontSize: '14px'
        }}
      >
        Actions ⋮
      </button>
      {/* Menu items rendering code... */}
    </div>
  );
};

export default ActionCell;
