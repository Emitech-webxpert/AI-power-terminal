const parsePromptForTitle = (data: string): string | null => {
    // Clean the data by removing ANSI color codes first
    const cleanData = data.replace(/\x1b\[[0-9;]*m/g, '')
    
    const lines = cleanData.split('\n')
    
    for (const line of lines) {
        
        // Method 1: Look for user@hostname:path$ pattern
        const promptMatch = line.match(/([^@\s]+)@([^:]+):([^$#\s]+)[\s]*[$#]/)
        if (promptMatch) {
            const [, user, hostname, path] = promptMatch
            console.log('Extracted parts:', { user, hostname, path })
            
            // Create clean title - keep the colon to show path structure
            const shortHostname = hostname.split('.')[0] // Remove domain if present
   
            
            const title = `${shortHostname}:${path}`
            return title
        }
        
        // Method 2: Look for just hostname:path pattern (fallback)
        const simpleMatch = line.match(/([^:\s]+):([^$#\s]+)[\s]*[$#]/)
        if (simpleMatch) {
            const [, hostname, path] = simpleMatch
            console.log('Simple match:', { hostname, path })
            
            const shortPath = path === '~' ? '~' : path.split('/').pop() || path
            return `${hostname}:${shortPath}`
        }
        
        // Method 3: Just extract the current directory if we see a $ or #
        if (line.includes('$') || line.includes('#')) {
            const dirMatch = line.match(/([~/][^$#\s]*)[\s]*[$#]/)
            if (dirMatch) {
                const path = dirMatch[1]
                const shortPath = path === '~' ? '~' : path.split('/').pop() || path
                return `Terminal: ${shortPath}`
            }
        }
    }
    
    return null
}
export default parsePromptForTitle