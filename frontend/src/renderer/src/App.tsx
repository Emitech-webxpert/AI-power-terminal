import React, { useState, useCallback } from 'react'
import NavBar from '@components/navBar'
import Terminal from '@renderer/Terminal'
import Sidebar from '@components/sideBar/sideBarMain'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import { selectIsDark, toggleTheme } from '@renderer/store/slices/themeSlice'

// Custom hook for sidebar drag functionality
const useSidebarDrag = () => {
  const [sidebarOnRight, setSidebarOnRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
    
    // Add visual feedback
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5'
    }
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false)
    
    // Remove visual feedback
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1'
    }
    
    // Determine position based on screen center
    const screenCenter = window.innerWidth / 2
    const shouldBeOnRight = e.clientX > screenCenter
    setSidebarOnRight(shouldBeOnRight)
  }, [])

  const handleContainerDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleContainerDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    // Determine position based on screen center
    const screenCenter = window.innerWidth / 2
    const shouldBeOnRight = e.clientX > screenCenter
    setSidebarOnRight(shouldBeOnRight)
  }, [])

  return {
    sidebarOnRight,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDrop
  }
}

const App: React.FC = () => {
  const [isSidebarClose, setIsSidebarClose] = useState(true)
  const [isButtonClose, setIsButtonClose] = useState(false)
  
  const {
    sidebarOnRight,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDrop
  } = useSidebarDrag()

  const isDark = useAppSelector(selectIsDark)
  const dispatch = useAppDispatch()

  const handleThemeToggle = (): void => {
    dispatch(toggleTheme())
  }

  const getTerminalWidthClass = (): string => {
    if (!isSidebarClose && isButtonClose) return 'width-half'
    if (isSidebarClose && !isButtonClose) return 'width-full-minus'
    return 'width-full-mxxx'
  }

  return (
    <>
      <NavBar isDarkMode={isDark} onThemeToggle={handleThemeToggle} userName="SH" />

      <div 
        className="flex py-4 w-full relative min-h-screen justify-between"
        onDragOver={handleContainerDragOver}
        onDrop={handleContainerDrop}
      >
       

        {/* Sidebar - Left Position */}
        {!sidebarOnRight && (
          <div className="min-w-[250px] flex-shrink-0">
            <div
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="cursor-move select-none transition-all duration-200 hover:shadow-lg"
              title="Drag to move sidebar"
            >
              <Sidebar
                setIsSidebarClose={setIsSidebarClose}
                setIsButtonClose={setIsButtonClose}
                sidebarOnRight={sidebarOnRight}
              />
            </div>
          </div>
        )}

        {/* Terminal */}
        <div className={`flex-1 mx-4 transition-all duration-300 ${getTerminalWidthClass()}`}>
          <Terminal />
        </div>

        {/* Sidebar - Right Position */}
        {sidebarOnRight && (
          <div className="min-w-[250px] flex-shrink-0">
            <div
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="cursor-move select-none transition-all duration-200 hover:shadow-lg"
              title="Drag to move sidebar"
            >
              <Sidebar
                setIsSidebarClose={setIsSidebarClose}
                setIsButtonClose={setIsButtonClose}
                sidebarOnRight={sidebarOnRight}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App