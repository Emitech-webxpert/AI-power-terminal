import fs from 'fs';
import path from 'path';
import findUp from 'find-up';

const isPkg =
  typeof process !== 'undefined' &&
  typeof (process as NodeJS.Process & { pkg?: unknown }).pkg !== 'undefined';

const configPath = isPkg
  ? path.join(path.dirname(process.execPath), 'config.json')
  : findUp.sync('config.json', { cwd: __dirname });

if (!configPath || !fs.existsSync(configPath)) {
  throw new Error(`config.json not found at: ${configPath}`);
}

console.log('[Config] Using config.json at:', configPath);

const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

export const getEnv = (key: string, fallback?: string): string => {
  return configData[key] ?? fallback ?? '';
};
