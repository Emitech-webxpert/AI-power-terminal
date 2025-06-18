import { useCallback } from 'react'
import { parsePromptForTitle } from '@renderer/utils/index'

const useTitleExtractor = (
  onTitleChange?: (title: string) => void,
  terminalType: 'local' | 'ssh' = 'local'
) => {
  const extractTitle = useCallback((data: string) => {
    // Skip title extraction for SSH terminals
    if (terminalType === 'ssh') {
      return
    }

    // Only extract titles for local terminals
    if (!onTitleChange || !(data.includes('$') || data.includes('#'))) {
      return
    }

    const title = parsePromptForTitle(data)
    if (title) {
      onTitleChange(title)
    }
  }, [onTitleChange, terminalType])

  return extractTitle
}

export default useTitleExtractor