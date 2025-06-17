// hooks/useSessionManager.ts
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import {
    selectIsSessionsExpanded,
    selectIsSessionsExpandedInner,
    selectIsSessionWizadOpen,
    selectIsQuickConnectOpen,
    selectIsDuplicateOpen,
    selectIsSessionContextOpen,
    selectIsSessionContextOpenFile,
    selectSelectedFileId,
    selectIsRenameOpen,
    selectIsDeleteOpen,
    selectDeleteTitle,
    selectSessions,
    selectSessionsLoading,
    selectSessionsError,
    clearError
} from '@renderer/store/slices/sessionList'
import { fetchSessions } from '@renderer/store/slices/sessionThunks'

const useSessionManager = (onContextMenuToggle?: (isOpen: boolean) => void) => {
    const dispatch = useAppDispatch()

    // All selectors
    const isSessionsExpanded = useAppSelector(selectIsSessionsExpanded)
    const isSessionsExpandedInner = useAppSelector(selectIsSessionsExpandedInner)
    const isSessionWizadOpen = useAppSelector(selectIsSessionWizadOpen)
    const isQuickConnectOpen = useAppSelector(selectIsQuickConnectOpen)
    const isDuplicateOpen = useAppSelector(selectIsDuplicateOpen)
    const isSessionContextOpen = useAppSelector(selectIsSessionContextOpen)
    const isSessionContextOpenFile = useAppSelector(selectIsSessionContextOpenFile)
    const selectedFileId = useAppSelector(selectSelectedFileId)
    const isRenameOpen = useAppSelector(selectIsRenameOpen)
    const isDeleteOpen = useAppSelector(selectIsDeleteOpen)
    const deleteTitle = useAppSelector(selectDeleteTitle)
    const sessions = useAppSelector(selectSessions)
    const sessionsLoading = useAppSelector(selectSessionsLoading)
    const sessionsError = useAppSelector(selectSessionsError)

    // Fetch sessions on mount
    useEffect(() => {
        dispatch(fetchSessions())
    }, [dispatch])

    // Handle context menu toggle
    useEffect(() => {
        if (onContextMenuToggle) {
            onContextMenuToggle(isSessionContextOpen || isSessionContextOpenFile)
        }
    }, [isSessionContextOpen, isSessionContextOpenFile, onContextMenuToggle])

    // Clear error on unmount
    useEffect(() => {
        return () => {
            if (sessionsError) {
                dispatch(clearError())
            }
        }
    }, [sessionsError, dispatch])

    return {
        // State
        isSessionsExpanded,
        isSessionsExpandedInner,
        isSessionWizadOpen,
        isQuickConnectOpen,
        isDuplicateOpen,
        isSessionContextOpen,
        isSessionContextOpenFile,
        selectedFileId,
        isRenameOpen,
        isDeleteOpen,
        deleteTitle,
        sessions,
        sessionsLoading,
        sessionsError,
        dispatch
    }
}

export default
    useSessionManager
