
export interface AccountSettingsModalProps {
    isOpen: boolean
    onClose: () => void
    onOpenResetPassword: () => void
  }
  
  export interface DuplicateModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm?: () => void
  }
  
  export interface DisconnectModalProps {
    isOpen: boolean
    onClose: () => void
  }
  

  export interface QuickConnectModalProps {
    isOpen: boolean
    onClose: () => void
  }
  
  export interface ShareScreenModalProps {
    isOpen: boolean
    onClose: () => void
    onOpenShareCopy?: () => void
  }
  
  export interface ResetPasswordModalProps {
    isOpen: boolean
    onClose: () => void
    onOpenUdatePassword: () => void
  }
  
  export interface PasswordUpdateModalProps {
    isOpen: boolean
    onClose: () => void
  }



export interface SessionContextModalProps {
    isOpen: boolean
    onClose: () => void
    onDeleteOpen?: () => void
    onOpenQuickConnect?: () => void
    onOpenSessionWizad?: () => void
    onRenameOpen?:() => void
  }
  
export interface SessionContextModalProps {
  isOpen: boolean
  onClose: () => void
  onDeleteOpen?: () => void
  onOpenQuickConnect?: () => void     
  onOpenSessionWizad?: () => void     
  onRenameOpen?: () => void
}
export interface SessionContextFileModalProps {
  isOpen: boolean
  onClose: () => void
  onDeleteOpen?: () => void
  onDuplicate?: () => void
  onRenameOpen?: () => void
}

  
  export interface WorkFlowContextModalProps {
    isOpen: boolean
    onClose: () => void
    onDeleteOpen?: () => void
    onRenameOpen?: () => void
  }
  
  
  export interface DeleteFileFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string; // Optional title prop
  }
  



export interface TabContextModalProps {
    isOpen: boolean
    onClose: () => void
    onRenameOpen?:() => void
    onNameOpen?:() => void
    onDisconnectOpen?:() => void
  }
  
  
  export interface SessionWizadModalProps {
    isOpen: boolean
    onClose: () => void
  }
  