import { useRef, useState, useEffect } from 'react'

export const useTerminalTabs = () => {
  // Scrolling state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const tabBarRef = useRef<HTMLDivElement>(null)

  // Context menu state
  const [isSessionContextOpen, setIsSessionContextOpen] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isNameOpen, setIsNameOpen] = useState(false)
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false)
  const [isCloseOpen, setIsCloseOpen] = useState(false)
  const [terminalToClose, setTerminalToClose] = useState<string | null>(null)
  const sessionModalRef = useRef<HTMLDivElement>(null)

  // Smooth scroll wheel handler
  const handleWheel = (e: React.WheelEvent) => {
    if (tabBarRef.current) {
      e.preventDefault()
      const scrollAmount = e.deltaY * 0.5
      tabBarRef.current.style.scrollBehavior = 'smooth'
      tabBarRef.current.scrollLeft += scrollAmount

      setTimeout(() => {
        if (tabBarRef.current) {
          tabBarRef.current.style.scrollBehavior = 'auto'
        }
      }, 300)
    }
  }

  // Mouse drag scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (tabBarRef.current && e.button === 0) {
      setIsDragging(true)
      setStartX(e.pageX - tabBarRef.current.offsetLeft)
      setScrollLeft(tabBarRef.current.scrollLeft)
      tabBarRef.current.style.cursor = 'grabbing'
      tabBarRef.current.style.userSelect = 'none'
    }
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      if (tabBarRef.current) {
        tabBarRef.current.style.cursor = 'grab'
        tabBarRef.current.style.userSelect = 'auto'
      }
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      if (tabBarRef.current) {
        tabBarRef.current.style.cursor = 'grab'
        tabBarRef.current.style.userSelect = 'auto'
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabBarRef.current) return

    e.preventDefault()
    const x = e.pageX - tabBarRef.current.offsetLeft
    const walk = (x - startX) * 2
    tabBarRef.current.scrollLeft = scrollLeft - walk
  }

  // Context menu handlers
  const handleSessionsRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (tabBarRef.current) {
      const rect = tabBarRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setContextMenuPosition({ x, y })
    }

    setIsSessionContextOpen(true)
  }

  const handleRenameOpen = () => {
    setIsRenameOpen(true)
    setIsSessionContextOpen(false)
  }

  const handleNameOpen = () => {
    setIsNameOpen(true)
    setIsSessionContextOpen(false)
  }

  const handleDisconnectOpen = () => {
    setIsDisconnectOpen(true)
    setIsSessionContextOpen(false)
  }

  const handleCloseOpen = (terminalId: string) => {
    setTerminalToClose(terminalId)
    setIsCloseOpen(true)
  }

  // Set cursor style
  useEffect(() => {
    if (tabBarRef.current) {
      tabBarRef.current.style.cursor = 'grab'
    }
  }, [])

  // Handle click outside context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (sessionModalRef.current && !sessionModalRef.current.contains(target)) {
        setIsSessionContextOpen(false)
      }
    }
    if (isSessionContextOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSessionContextOpen])

  return {
    // Refs
    tabBarRef,
    sessionModalRef,

    isSessionContextOpen,
    contextMenuPosition,
    isRenameOpen,
    isNameOpen,
    isDisconnectOpen,
    isCloseOpen,
    terminalToClose,

    handleWheel,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleSessionsRightClick,
    handleRenameOpen,
    handleNameOpen,
    handleDisconnectOpen,
    handleCloseOpen,
    setIsSessionContextOpen,
    setIsRenameOpen,
    setIsNameOpen,
    setIsDisconnectOpen,
    setIsCloseOpen,
    setTerminalToClose
  }
}
