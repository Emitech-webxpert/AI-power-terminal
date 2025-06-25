import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MonitorUp } from 'lucide-react'
import '@renderer/assets/css/topbar.css'
import { NavBarProps } from '@renderer/type'
import {
  AccountSettingsModal,
  ChangePasswordModal,
  PasswordUpdatedModal,
  QuickConnectModal,
  ShareCopyModal,
  ShareScreenModal
} from '@modals/index'
import { NavbarLeft, UserDropdown } from '@renderer/components/navbarMain'
import {
  openAccountSettings,
  closeAccountSettings,
  openQuickConnect,
  closeQuickConnect,
  openShareScreen,
  closeShareScreen,
  openShareCopy,
  closeShareCopy,
  openResetPassword,
  closeResetPassword,
  openUpdatePassword,
  closeUpdatePassword,
  setDropdownOpen,
  selectIsAccountSettingsOpen,
  selectIsQuickConnectOpen,
  selectIsShareScreenOpen,
  selectIsShareCopyOpen,
  selectIsResetPasswordOpen,
  selectIsUpdatePassword,
  selectIsDropdownOpen
} from '@renderer/store/slices/navbarSlice'
import type { RootState, AppDispatch } from '@renderer/store'

const NavBar: React.FC<NavBarProps> = ({ isDarkMode = true, onThemeToggle }) => {
  const dispatch = useDispatch<AppDispatch>()

  // Redux selectors
  const isAccountSettingsOpen = useSelector((state: RootState) => selectIsAccountSettingsOpen(state))
  const isQuickConnectOpen = useSelector((state: RootState) => selectIsQuickConnectOpen(state))
  const isShareScreenOpen = useSelector((state: RootState) => selectIsShareScreenOpen(state))
  const isShareCopyOpen = useSelector((state: RootState) => selectIsShareCopyOpen(state))
  const isResetPasswordOpen = useSelector((state: RootState) => selectIsResetPasswordOpen(state))
  const isUpdatePassword = useSelector((state: RootState) => selectIsUpdatePassword(state))
  const isDropdownOpen = useSelector((state: RootState) => selectIsDropdownOpen(state))

  // Get user data from localStorage directly
  const getUserDataFromStorage = () => {
    try {
      const storedUserData = localStorage.getItem('userData')
      return storedUserData ? JSON.parse(storedUserData) : null
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error)
      return null
    }
  }

  const userData = getUserDataFromStorage()
  const UserName = userData?.name
  const userEmail = userData?.email

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  // Action handlers using Redux dispatch
  const handleAccountSettingsClick = () => {
    dispatch(openAccountSettings())
  }

  const handleAccountSettingsClose = () => {
    dispatch(closeAccountSettings())
  }

  const handleQuickConnectClick = () => {
    dispatch(openQuickConnect())
  }

  const handleQuickConnectClose = () => {
    dispatch(closeQuickConnect())
  }

  const handleShareScreenClick = () => {
    dispatch(openShareScreen())
  }

  const handleShareScreenClose = () => {
    dispatch(closeShareScreen())
  }

  const handleShareCopyClick = () => {
    dispatch(openShareCopy())
  }

  const handleShareCopyClose = () => {
    dispatch(closeShareCopy())
  }

  const handleOpenResetPassword = () => {
    dispatch(openResetPassword())
  }

  const handleResetPasswordClose = () => {
    dispatch(closeResetPassword())
  }

  const handleOpenUpdatePassword = () => {
    dispatch(openUpdatePassword())
  }

  const handleUpdatePasswordClose = () => {
    dispatch(closeUpdatePassword())
  }

  const handleSetDropdownOpen = (isOpen: boolean) => {
    dispatch(setDropdownOpen(isOpen))
  }

  return (
    <div className={`navbar bg-dark border-b border-new ${isDarkMode ? 'dark' : 'light'}`}>
      <NavbarLeft isDarkMode={isDarkMode} onQuickConnectClick={handleQuickConnectClick} />

      <div className="navbar-right">
        <div className="theme-toggle">
          <span
            className={`navbar-lig-dar text-lights text-xs ${isDarkMode ? 'active text-white' : 'text-light'}`}
          >
            Dark
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={!isDarkMode}
              onChange={onThemeToggle}
              title="Toggle Theme"
            />
            <span className="slider"></span>
          </label>
          <span
            className={`navbar-lig-dar text-lights text-xs ${!isDarkMode ? 'active text-black' : 'text-light'}`}
          >
            Light
          </span>
        </div>
        <div className="rounded-md">
          <button
            className="navbar-share-button rounded-md px-1.5 py-1 flex items-center gap-1 text-white"
            title="Share"
            onClick={handleShareScreenClick}
          >
            <span className="text-xs font-medium text-white">Share</span>
            <button title="share screen" className="bg-transparent border-0 cursor-pointer">
              <MonitorUp className="text-white" size={14} />
            </button>
          </button>
        </div>

        <UserDropdown
          userName={UserName}
          userEmail={userEmail}
          onAccountSettingsClick={handleAccountSettingsClick}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={handleSetDropdownOpen}
        />
      </div>

      <AccountSettingsModal
        userName={UserName}
        userEmail={userEmail}
        isOpen={isAccountSettingsOpen}
        onClose={handleAccountSettingsClose}
        onOpenResetPassword={handleOpenResetPassword}
      />
      <ChangePasswordModal
        isOpen={isResetPasswordOpen}
        onClose={handleResetPasswordClose}
        onOpenUdatePassword={handleOpenUpdatePassword}
      />
      <PasswordUpdatedModal isOpen={isUpdatePassword} onClose={handleUpdatePasswordClose} />
      <QuickConnectModal isOpen={isQuickConnectOpen} onClose={handleQuickConnectClose} />
      <ShareScreenModal
        isOpen={isShareScreenOpen}
        onClose={handleShareScreenClose}
        onOpenShareCopy={handleShareCopyClick}
      />
      <ShareCopyModal isOpen={isShareCopyOpen} onClose={handleShareCopyClose} />
    </div>
  )
}

export default NavBar