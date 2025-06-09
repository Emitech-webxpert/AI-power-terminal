import React from 'react'
import { Copys, Crop, Lightning, terminal } from '@renderer/assets'
import { NavbarLeftProps } from '@renderer/type'

const NavbarLeft: React.FC<NavbarLeftProps> = ({
  isDarkMode,
  onQuickConnectClick,
}) => {
 

  return (
    <div className="navbar-left">
      <button 
        className="navbar-button" 
        title="Fast Boot" 
        onClick={onQuickConnectClick}
      >
        <img src={Lightning} alt="Lightning" />
      </button>

      <button 
        className="navbar-button" 
        title="Stop"
      >
        <img src={Crop} alt="Stop" />
      </button>

      <button 
        className="navbar-button" 
        title="Copy"
    
      >
        <img src={Copys} alt="Copy" />
      </button>

      <button 
        className="navbar-button" 
        title="Connect in local shell"
   
      >
        <img src={terminal} alt="Run" />
      </button>

      <input
          type="search"
          className={`bg-input-new navbar-text text-sm text-gray bg-input-color border-0 border-input h-6 ${isDarkMode ? 'text-white' : 'text-black'}`}
          placeholder="Enter host"
        />


    </div>
  )
}

export default NavbarLeft