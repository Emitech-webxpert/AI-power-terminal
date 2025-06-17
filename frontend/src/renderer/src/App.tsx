import React, { useState, useEffect, useCallback } from 'react'
import NavBar from '@components/navBar'
import Terminal from '@renderer/Terminal'
import Sidebar from '@components/sideBar/sideBarMain'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import { selectIsDark, toggleTheme } from '@renderer/store/slices/themeSlice'
import AuthLayout from '@components/authLayout'

const useSeparateDrag = () => {
  const [sessionOnRight, setSessionOnRight] = useState(false)
  const [workflowOnRight, setWorkflowOnRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedComponent, setDraggedComponent] = useState<'session' | 'workflow' | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, component: 'session' | 'workflow') => {
    setIsDragging(true)
    setDraggedComponent(component)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', component)
    
    // Add visual feedback
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5'
    }
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setIsDragging(false)
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1'
    }

    if (draggedComponent) {
      const screenCenter = window.innerWidth / 2
      const shouldBeOnRight = e.clientX > screenCenter
      
      if (draggedComponent === 'session') {
        setSessionOnRight(shouldBeOnRight)
      } else if (draggedComponent === 'workflow') {
        setWorkflowOnRight(shouldBeOnRight)
      }
    }
    
    setDraggedComponent(null)
  }, [draggedComponent])

  const handleContainerDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleContainerDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const component = e.dataTransfer.getData('text/plain') as 'session' | 'workflow'
    const screenCenter = window.innerWidth / 2
    const shouldBeOnRight = e.clientX > screenCenter
    
    if (component === 'session') {
      setSessionOnRight(shouldBeOnRight)
    } else if (component === 'workflow') {
      setWorkflowOnRight(shouldBeOnRight)
    }
    
    setDraggedComponent(null)
  }, [])

  return {
    sessionOnRight,
    workflowOnRight,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDrop
  }
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isSidebarClose, setIsSidebarClose] = useState(true)
  const [isButtonClose, setIsButtonClose] = useState(false)

  const {
    sessionOnRight,
    workflowOnRight,
    handleDragStart,
    handleDragEnd,
    handleContainerDragOver,
    handleContainerDrop
  } = useSeparateDrag()

  const isDark = useAppSelector(selectIsDark)
  const dispatch = useAppDispatch()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const authStatus = localStorage.getItem('isLoggedIn')
    console.log('authStatus from localStorage:', authStatus)
    setIsLoggedIn(authStatus === 'true')
    setIsAuthLoading(false)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
  }

  const handleThemeToggle = (): void => {
    dispatch(toggleTheme())
  }

  const getTerminalWidthClass = (): string => {
    if (!isSidebarClose && !isButtonClose) return 'width-center' // New class for when components are on both sides
    if (!isSidebarClose && isButtonClose) return 'width-half overflow-auto'
    if (isSidebarClose && !isButtonClose) return 'width-full-minus'
    return 'width-full-mxxx'
  }

  if (isAuthLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <p>Loading...</p>
      </div>
    )
  }

  if (isLoggedIn) {
    return <AuthLayout onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <>
      <NavBar isDarkMode={isDark} onThemeToggle={handleThemeToggle} userName="SH" />

      <div
        className="flex py-4 w-full relative min-h-screen justify-between"
        onDragOver={handleContainerDragOver}
        onDrop={handleContainerDrop}
      >
        {/* Left Sidebar Container */}
        <div className="min-w-[250px] flex-shrink-0 flex flex-col gap-2">
          <Sidebar
            setIsSidebarClose={setIsSidebarClose}
            setIsButtonClose={setIsButtonClose}
            sessionOnRight={sessionOnRight}
            workflowOnRight={workflowOnRight}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            side="left"
          />
        </div>

        {/* Terminal */}
        <div className={`flex-1 mx-4 transition-all duration-300 ${getTerminalWidthClass()}`}>
          <Terminal />
        </div>

        {/* Right Sidebar Container */}
        <div className="min-w-[250px] flex-shrink-0 flex flex-col gap-2">
          <Sidebar
            setIsSidebarClose={setIsSidebarClose}
            setIsButtonClose={setIsButtonClose}
            sessionOnRight={sessionOnRight}
            workflowOnRight={workflowOnRight}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            side="right"
          />
        </div>
      </div>
    </>
  )
}

export default App