import find from 'find-process'
import kill from 'tree-kill'

const killAsync = (pid: number): Promise<void> =>
  new Promise((resolve, reject) => kill(pid, 'SIGKILL', (err) => (err ? reject(err) : resolve())))

export const killPort = async (port: number): Promise<void> => {
  const processes = await find('port', port)
  for (const process of processes) {
    await killAsync(process.pid)
    console.log(`Sent SIGKILL to PID ${process.pid} on port ${port}`)
  }
}

export const killPorts = async (ports: number[]): Promise<void> => {
  for (const port of ports) await killPort(port)
}
