import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {NavbarState} from "@renderer/type"

const initialState: NavbarState = {
  isAccountSettingsOpen: false,
  isQuickConnectOpen: false,
  isShareScreenOpen: false,
  isShareCopyOpen: false,
  isResetPasswordOpen: false,
  isUpdatePassword: false,
  isDropdownOpen: false,
  isLogoutModalOpen: false // Added this new state
}

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    // Account Settings Modal
    openAccountSettings: (state) => {
      state.isAccountSettingsOpen = true
      state.isDropdownOpen = false
    },
    closeAccountSettings: (state) => {
      state.isAccountSettingsOpen = false
    },

    // Quick Connect Modal
    openQuickConnect: (state) => {
      state.isQuickConnectOpen = true
    },
    closeQuickConnect: (state) => {
      state.isQuickConnectOpen = false
    },

    // Share Screen Modal
    openShareScreen: (state) => {
      state.isShareScreenOpen = true
    },
    closeShareScreen: (state) => {
      state.isShareScreenOpen = false
    },

    // Share Copy Modal
    openShareCopy: (state) => {
      state.isShareCopyOpen = true
      state.isShareScreenOpen = false // Close share screen when opening share copy
    },
    closeShareCopy: (state) => {
      state.isShareCopyOpen = false
    },

    // Reset Password Modal
    openResetPassword: (state) => {
      state.isResetPasswordOpen = true
      state.isAccountSettingsOpen = false
    },
    closeResetPassword: (state) => {
      state.isResetPasswordOpen = false
    },

    // Update Password Modal
    openUpdatePassword: (state) => {
      state.isUpdatePassword = true
      state.isAccountSettingsOpen = false
      state.isResetPasswordOpen = false
    },
    closeUpdatePassword: (state) => {
      state.isUpdatePassword = false
    },

    // Logout Modal - Added these new actions
    openLogoutModal: (state) => {
      state.isLogoutModalOpen = true
    },
    closeLogoutModal: (state) => {
      state.isLogoutModalOpen = false
    },

    // Dropdown
    setDropdownOpen: (state, action: PayloadAction<boolean>) => {
      state.isDropdownOpen = action.payload
    },
    toggleDropdown: (state) => {
      state.isDropdownOpen = !state.isDropdownOpen
    },

    // Close all modals (useful for cleanup)
    closeAllModals: (state) => {
      state.isAccountSettingsOpen = false
      state.isQuickConnectOpen = false
      state.isShareScreenOpen = false
      state.isShareCopyOpen = false
      state.isResetPasswordOpen = false
      state.isUpdatePassword = false
      state.isDropdownOpen = false
      state.isLogoutModalOpen = false // Added this to closeAllModals
    }
  }
})

export const {
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
  openLogoutModal, // Export new actions
  closeLogoutModal, // Export new actions
  setDropdownOpen,
  toggleDropdown,
  closeAllModals
} = navbarSlice.actions

// Selectors - Using 'navBar' to match store key
export const selectNavbarState = (state: { navBar: NavbarState }) => state.navBar
export const selectIsAccountSettingsOpen = (state: { navBar: NavbarState }) => state.navBar.isAccountSettingsOpen
export const selectIsQuickConnectOpen = (state: { navBar: NavbarState }) => state.navBar.isQuickConnectOpen
export const selectIsShareScreenOpen = (state: { navBar: NavbarState }) => state.navBar.isShareScreenOpen
export const selectIsShareCopyOpen = (state: { navBar: NavbarState }) => state.navBar.isShareCopyOpen
export const selectIsResetPasswordOpen = (state: { navBar: NavbarState }) => state.navBar.isResetPasswordOpen
export const selectIsUpdatePassword = (state: { navBar: NavbarState }) => state.navBar.isUpdatePassword
export const selectIsDropdownOpen = (state: { navBar: NavbarState }) => state.navBar.isDropdownOpen
export const selectIsLogoutModalOpen = (state: { navBar: NavbarState }) => state.navBar.isLogoutModalOpen // Added new selector

// Export the NavbarState type for use in other files
export type { NavbarState }

export default navbarSlice.reducer