import fs from 'fs';
import path from 'path';

const isPkg =
  typeof process !== 'undefined' &&
  typeof (process as NodeJS.Process & { pkg?: unknown }).pkg !== 'undefined';

// Function to find config.json by walking up directories
const findConfigPath = (startDir: string): string | null => {
  let currentDir = startDir;
  
  while (currentDir !== path.dirname(currentDir)) {
    const configPath = path.join(currentDir, 'config.json');
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
};

const configPath = isPkg
  ? path.join(path.dirname(process.execPath), 'config.json')
  : findConfigPath(__dirname);

if (!configPath || !fs.existsSync(configPath)) {
  throw new Error(`config.json not found starting from: ${__dirname}`);
}

console.log('[Config] Using config.json at:', configPath);

const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

export const getEnv = (key: string, fallback?: string): string => {
  return configData[key] ?? fallback ?? '';
};