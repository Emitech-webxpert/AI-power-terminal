import React, { useState, useEffect } from 'react';
import { sessionlight, sessionss, work, worklight } from '@renderer/assets';
import {SessionManager, WorkflowManager} from '@renderer/components/sideBar/index'
import { useAppSelector } from '@renderer/store/hooks'
import { selectIsDark } from '@renderer/store/slices/themeSlice'
import { SidebarProps } from '@renderer/type';

const Sidebar: React.FC<SidebarProps> = ({setIsSidebarClose, setIsButtonClose, sidebarOnRight}) => {
  const [isSessionVisible, setIsSessionVisible] = useState(true);
  const [isWorkflowVisible, setIsWorkflowVisible] = useState(true);
  const isDark = useAppSelector(selectIsDark)
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  // Update parent states whenever visibility changes
  useEffect(() => {
    const bothSectionsHidden = !isSessionVisible && !isWorkflowVisible;
    const anyButtonVisible = !isSessionVisible || !isWorkflowVisible;
    
    // Set sidebar close state
    setIsSidebarClose(bothSectionsHidden);
    
    // Set button close state (true when no buttons are visible)
    setIsButtonClose(!anyButtonVisible);
    
  }, [isSessionVisible, isWorkflowVisible, setIsSidebarClose, setIsButtonClose]);

  const toggleSessionVisibility = () => {
    const newSessionVisibility = !isSessionVisible;
    setIsSessionVisible(newSessionVisibility);
  };

  const toggleWorkflowVisibility = () => {
    const newWorkflowVisibility = !isWorkflowVisible;
    setIsWorkflowVisible(newWorkflowVisibility);
  };

  const handleContextMenuToggle = (isOpen: boolean) => {
    setIsContextMenuOpen(isOpen);
  };

  return (
    <div className={`flex ${sidebarOnRight ? 'flex-row-reverse' : ''}`}>
      {/* Vertical Buttons Container (shown when sections are hidden) */}
      {(!isSessionVisible || !isWorkflowVisible) && (
        <div className="flex flex-col items-center w-auto mt-5">
          {!isSessionVisible && (
            <button
              onClick={toggleSessionVisibility}
              className={`flex items-center justify-start h-40 p-0 w-full bg-transparent border-0 cursor-pointer ${sidebarOnRight ? 'rotate-180' : ''}`}
            >
               {isDark ? <img src={sessionss} className="w-full" alt="click" /> : <img src={sessionlight} className="" alt="click" /> }
            </button>
          )}

          {!isWorkflowVisible && (
            <button
              onClick={toggleWorkflowVisibility}
              className={`flex items-center justify-start h-40 p-0 w-full bg-transparent border-0 cursor-pointer ${sidebarOnRight ? 'rotate-180' : ''}`}
            >
              {isDark ? <img src={work} className="w-full" alt="click" /> : <img src={worklight} className="" alt="click" /> }
            </button>
          )}
        </div>
      )}

      {/* Sidebar Content */}
      {(isSessionVisible || isWorkflowVisible) && (
        <div className={`sidebar-container w-64 flex flex-col gap-2 px-3 h-screen ${
          isContextMenuOpen ? 'overflow-x-visible overflow-auto' : 'overflow-auto'
        }`}>
          {isSessionVisible && <SessionManager toggleWorkflowVisibility={toggleSessionVisibility} onContextMenuToggle={handleContextMenuToggle} sidebarOnRight={sidebarOnRight} />}
          {isWorkflowVisible && <WorkflowManager toggleWorkflowVisibility={toggleWorkflowVisibility} sidebarOnRight={sidebarOnRight} />}
        </div>
      )}
    </div>
  );
};

export default Sidebar;