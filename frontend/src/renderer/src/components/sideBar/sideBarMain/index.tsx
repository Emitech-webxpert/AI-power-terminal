import React, { useState, useEffect } from 'react'
import { sessionlight, sessionss, work, worklight } from '@renderer/assets'
import { SessionManager, WorkflowManager } from '@renderer/components/sideBar/index'
import { useAppSelector } from '@renderer/store/hooks'
import { selectIsDark } from '@renderer/store/slices/themeSlice'
import { SidebarProps } from '@renderer/type'



const Sidebar: React.FC<SidebarProps> = ({
  setIsSidebarClose,
  setIsButtonClose,
  sessionOnRight,
  workflowOnRight,
  handleDragStart,
  handleDragEnd,
  side
}) => {
  const [isSessionVisible, setIsSessionVisible] = useState(true)
  const [isWorkflowVisible, setIsWorkflowVisible] = useState(true)
  const isDark = useAppSelector(selectIsDark)
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)

  // Determine which components should be shown on this side
  const showSession = side === 'left' ? !sessionOnRight : sessionOnRight
  const showWorkflow = side === 'left' ? !workflowOnRight : workflowOnRight

  // Update parent states whenever visibility changes
  useEffect(() => {
    const bothSectionsHidden = !isSessionVisible && !isWorkflowVisible
    const anyButtonVisible = !isSessionVisible || !isWorkflowVisible

    // Set sidebar close state
    setIsSidebarClose(bothSectionsHidden)

    // Set button close state (true when no buttons are visible)
    setIsButtonClose(!anyButtonVisible)
  }, [isSessionVisible, isWorkflowVisible, setIsSidebarClose, setIsButtonClose])

  const toggleSessionVisibility = () => {
    const newSessionVisibility = !isSessionVisible
    setIsSessionVisible(newSessionVisibility)
  }

  const toggleWorkflowVisibility = () => {
    const newWorkflowVisibility = !isWorkflowVisible
    setIsWorkflowVisible(newWorkflowVisibility)
  }

  const handleContextMenuToggle = (isOpen: boolean) => {
    setIsContextMenuOpen(isOpen)
  }

  // Show buttons for hidden components that belong to this side
  const showSessionButton = showSession && !isSessionVisible
  const showWorkflowButton = showWorkflow && !isWorkflowVisible

  return (
    <div className={`flex ${side === 'left' ? '' : 'flex-row-reverse'}`}>
      {/* Vertical Buttons Container (shown when sections are hidden) */}
      {(showSessionButton || showWorkflowButton) && (
        <div className="flex flex-col items-center w-auto mt-5">
          {showSessionButton && (
            <button
              onClick={toggleSessionVisibility}
              className={`flex items-center justify-start h-40 p-0 w-full bg-transparent border-0 cursor-pointer ${side === 'right' ? 'rotate-180' : ''}`}
            >
              {isDark ? (
                <img src={sessionss} className="w-full" alt="click" />
              ) : (
                <img src={sessionlight} className="" alt="click" />
              )}
            </button>
          )}

          {showWorkflowButton && (
            <button
              onClick={toggleWorkflowVisibility}
              className={`flex items-center justify-start h-40 p-0 w-full bg-transparent border-0 cursor-pointer ${side === 'right' ? 'rotate-180' : ''}`}
            >
              {isDark ? (
                <img src={work} className="w-full" alt="click" />
              ) : (
                <img src={worklight} className="" alt="click" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Sidebar Content */}
      <div
        className={`sidebar-container  flex flex-col gap-2  h-screen ${
          isContextMenuOpen ? 'overflow-x-visible overflow-auto w-64 px-3' : 'overflow-auto w-auto'
        }`}
      >
        {/* Session Manager */}
        {showSession && isSessionVisible && (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'session')}
            onDragEnd={handleDragEnd}
            className="cursor-move select-none transition-all duration-200 hover:shadow-lg border-2 border-dashed border-transparent hover:border-blue-300 rounded-lg px-3"
          >
            <SessionManager
              toggleWorkflowVisibility={toggleSessionVisibility}
              onContextMenuToggle={handleContextMenuToggle}
              sidebarOnRight={side === 'right'}
            />
          </div>
        )}

        {/* Workflow Manager */}
        {showWorkflow && isWorkflowVisible && (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, 'workflow')}
            onDragEnd={handleDragEnd}
            className="cursor-move select-none transition-all duration-200 hover:shadow-lg border-2 border-dashed border-transparent hover:border-blue-300 rounded-lg px-3"
          >
            <WorkflowManager
              toggleWorkflowVisibility={toggleWorkflowVisibility}
              sidebarOnRight={side === 'right'}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
