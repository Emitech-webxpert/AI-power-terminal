import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LogIn, Settings } from 'lucide-react'
import { UserDropdownProps } from '@renderer/type'
import { LogoutModal } from '@renderer/components/modals'
import {
  openLogoutModal,
  closeLogoutModal,
  selectIsLogoutModalOpen
} from '@renderer/store/slices/navbarSlice'
import type { RootState, AppDispatch } from '@renderer/store'

const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  userEmail,
  onAccountSettingsClick,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Get logout modal state from Redux
  const isLogoutModalOpen = useSelector((state: RootState) => selectIsLogoutModalOpen(state))

  // Generate user initials
  const getUserInitials = (name: string): string => {
    if (!name || name.trim() === '') return 'U'
    
    const trimmedName = name.trim()
    const words = trimmedName.split(' ')
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
    }
    
    return trimmedName.substring(0, 2).toUpperCase()
  }

  const userInitials = getUserInitials(userName)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Handle opening logout modal using Redux
  const handleSignOutClick = () => {
    dispatch(openLogoutModal())
    setIsDropdownOpen(false) // Close dropdown when modal opens
  }

  // Handle actual logout (called from LogoutModal)
  const handleConfirmLogout = () => {
    try {
      // Clear all localStorage data
      localStorage.clear()
      
      // Close modal using Redux
      dispatch(closeLogoutModal())
      
      // Redirect to sign-in page
      window.location.href = '/signin'
      
      console.log('User logged out successfully')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Handle cancel logout using Redux
  const handleCancelLogout = () => {
    dispatch(closeLogoutModal())
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <div
          className="navbar-avatar navbar-avatar-color bg-primary cursor-pointer text-white font-semibold text-xs flex justify-center items-center rounded-full"
          title={userName}
          onClick={toggleDropdown}
        >
          {userInitials}
        </div>

        {isDropdownOpen && (
          <div className="absolute right-1 top-8 w-64 bg-gray-800 text-white rounded-md shadow-lg z-10 bg-dark border border-gray-light">
            <div className="flex items-center gap-2 border-b-2 border-gray-light m-3 pb-4 mb-0">
              <div className="navbar-avatar-color w-12 h-12 bg-primary text-white font-medium text-base flex justify-center items-center rounded-full bg-red-600 mr-3">
                {userInitials}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-normal m-0 text-white">{userName}</p>
                <p className="text-xs text-normal text-gray m-0">{userEmail}</p>
              </div>
            </div>
            <div className="py-1">
              <button
                className="w-auto text-left px-4 py-2 text-sm bg-transparent border-0 text-white cursor-pointer inline-flex items-center gap-2 hover:bg-gray-700 transition-colors"
                onClick={onAccountSettingsClick}
              >
                <Settings size={18} /> Account Settings
              </button>
              <button
                className="w-auto text-left px-4 py-2 text-sm bg-transparent border-0 text-white cursor-pointer flex items-center gap-2 hover:bg-gray-700 transition-colors"
                onClick={handleSignOutClick}
              >
                <LogIn size={18} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleConfirmLogout}
        onClose={handleCancelLogout}
      />
    </>
  )
}

export default UserDropdown