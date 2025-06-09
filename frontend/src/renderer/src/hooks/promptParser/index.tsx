import { useCallback } from 'react'
import { parsePromptForTitle } from '@renderer/utils/index'

const useTitleExtractor = (onTitleChange?: (title: string) => void) => {
    const extractTitle = useCallback((data: string) => {
        if (!onTitleChange || !(data.includes('$') || data.includes('#'))) {
            return
        }

        const title = parsePromptForTitle(data)
        if (title) {
            onTitleChange(title)
        }
    }, [onTitleChange])

    return extractTitle
}

export default useTitleExtractor 