import React, { useEffect, useRef } from 'react'
import { LogIn, Settings } from 'lucide-react'
import { UserDropdownProps } from '@renderer/type'

const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  userEmail,
  onAccountSettingsClick,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
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
    <div className="relative" ref={dropdownRef}>
      <div
        className="navbar-avatar navbar-avatar-color bg-primary cursor-pointer text-white font-semibold text-xs flex justify-center items-center rounded-full"
        title={userName}
        onClick={toggleDropdown}
      >
        SH
      </div>

      {isDropdownOpen && (
        <div className="absolute right-1 top-8 w-64 bg-gray-800 text-white rounded-md shadow-lg z-10 bg-dark border border-gray-light">
          <div className="flex items-center gap-2 border-b-2 border-gray-light m-3 pb-4 mb-0">
            <div className="navbar-avatar-color w-12 h-12 bg-primary text-white font-medium text-base flex justify-center items-center rounded-full bg-red-600 mr-3">
              SH
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal m-0 text-white">{userName}</p>
              <p className="text-xs text-normal text-gray m-0">{userEmail}</p>
            </div>
          </div>
          <div className="py-1">
            <button
              className="w-auto text-left px-4 py-2 text-sm bg-transparent border-0 text-white cursor-pointer inline-flex items-center gap-2"
              onClick={onAccountSettingsClick}
            >
              <Settings size={18} /> Account Settings
            </button>
            <button
              className="w-auto text-left px-4 py-2 text-sm bg-transparent border-0 text-white cursor-pointer flex items-center gap-2"
              onClick={() => setIsDropdownOpen(false)}
            >
              <LogIn size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDropdown
