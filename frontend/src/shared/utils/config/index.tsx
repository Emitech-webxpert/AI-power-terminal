import fs from 'fs'
import path from 'path'

const findConfigFile = (startDir: string): string | null => {
  let currentDir = startDir
  
  while (currentDir !== path.dirname(currentDir)) {
    const configPath = path.join(currentDir, 'config.json')
    if (fs.existsSync(configPath)) {
      return configPath
    }
    currentDir = path.dirname(currentDir)
  }
  
  return null
}

const isPkg = 
  typeof process !== 'undefined' &&
  typeof (process as NodeJS.Process & { pkg?: unknown }).pkg !== 'undefined'

const getConfigPath = (): string => {
  if (isPkg) {
    return path.join(path.dirname(process.execPath), 'config.json')
  } else {
    return findConfigFile(__dirname) || ''
  }
}

let configPath: string
let configData: any

try {
  configPath = getConfigPath()
  
  if (!configPath || !fs.existsSync(configPath)) {
    throw new Error(`config.json not found at: ${configPath}`)
  }
  
  console.log('[Config] Using config.json at:', configPath)
  configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
} catch (error) {
  console.error('[Config] Error loading config:', error)
  configData = {}
}

export const getEnv = (key: string, fallback?: string): string => {
  return configData[key] ?? fallback ?? ''
}