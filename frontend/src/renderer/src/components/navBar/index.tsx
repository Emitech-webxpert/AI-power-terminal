import React, { useEffect, useState } from 'react'
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
const NavBar: React.FC<NavBarProps> = ({ isDarkMode = true, onThemeToggle, userName = 'User' }) => {
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false)
  const [isQuickConnectOpen, setIsQuickConnectOpen] = useState(false)
  const [isShareScreenOpen, setIsShareScreenOpen] = useState(false)
  const [isShareCopyOpen, setIsShareCopyOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isUpdatePassword, setIsUpdatePassword] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) 
  const userEmail = 'abc@yopmail.com'

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  const handleAccountSettingsClick = () => {
    setIsAccountSettingsOpen(true)
    setIsDropdownOpen(false)
  }

  const handleAccountSettingsClose = () => {
    setIsAccountSettingsOpen(false)
  }

  const handleQuickConnectClick = () => {
    setIsQuickConnectOpen(true)
  }

  const handleQuickConnectClose = () => {
    setIsQuickConnectOpen(false)
  }

  const handleShareScreenClick = () => {
    setIsShareScreenOpen(true)
  }

  const handleShareScreenClose = () => {
    setIsShareScreenOpen(false)
  }

  const handleShareCopyClick = () => {
    setIsShareCopyOpen(true)
    setIsShareScreenOpen(false)
  }

  const handleShareCopyClose = () => {
    setIsShareCopyOpen(false)
  }

  const handleOpenResetPassword = () => {
    setIsResetPasswordOpen(true)
    setIsAccountSettingsOpen(false)
  }

  const handleResetPasswordClose = () => {
    setIsResetPasswordOpen(false)
  }

  const handleOpenUpdatePassword = () => {
    setIsUpdatePassword(true)
    setIsAccountSettingsOpen(false)
    setIsResetPasswordOpen(false)
  }

  const handleUpdatePasswordClose = () => {
    setIsUpdatePassword(false)
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
              <MonitorUp className="text-white" size={14} />{' '}
            </button>
          </button>
        </div>

        <UserDropdown
          userName={userName}
          userEmail={userEmail}
          onAccountSettingsClick={handleAccountSettingsClick}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      </div>

      <AccountSettingsModal
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
