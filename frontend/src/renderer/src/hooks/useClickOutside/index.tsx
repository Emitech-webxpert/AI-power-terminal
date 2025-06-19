import { useEffect } from 'react'

const useClickOutside = (
  refs: React.RefObject<HTMLDivElement>[],
  conditions: boolean[],
  handlers: (() => void)[]
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      refs.forEach((ref, index) => {
        if (
          ref.current && 
          !ref.current.contains(target) && 
          conditions[index] &&
          handlers[index]
        ) {
          handlers[index]()
        }
      })
    }

    // Only add listener if any condition is true
    if (conditions.some(condition => condition)) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [...conditions, ...handlers]) // Also depend on handlers
}

export default useClickOutside