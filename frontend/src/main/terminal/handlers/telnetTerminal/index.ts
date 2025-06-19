import { Telnet } from 'telnet-client'
import { BrowserWindow } from 'electron'
import { CreateTerminalOptions } from '@shared/type/terminal'
import { Terminal } from '@shared/index.types'

export class TelnetTerminalHandler {
  create(window: BrowserWindow, terminalId: string, options: CreateTerminalOptions, terminals: Map<string, Terminal>): string {
    const telnetClient = new Telnet()
    const terminal: Terminal = { id: terminalId, type: 'telnet', telnetClient, window }
    terminals.set(terminalId, terminal)

    const connectionParams = {
      host: options.host!,
      port: options.port || 23,
      timeout: 20000,
      negotiationMandatory: false,
      irs: '\r\n',
      ors: '\n'
    }

    window.webContents.send('terminal:data', terminalId, `Connecting to ${options.host}:${options.port || 23}...\r\n`)

    telnetClient.connect(connectionParams)
      .then(() => {
        this.setupTelnetEventHandlers(telnetClient, terminal)
      })
      .catch((error) => {
        window.webContents.send('terminal:data', terminalId, `Connection failed: ${error.message}\r\n`)
      })

    return terminalId
  }

  private setupTelnetEventHandlers(telnetClient: Telnet, terminal: Terminal) {
    const { window } = terminal
    const terminalId = terminal.id

    telnetClient.on('data', (data: Buffer) => {
      window.webContents.send('terminal:data', terminalId, data.toString())
    })

    telnetClient.on('timeout', () => {
      window.webContents.send('terminal:data', terminalId, '\r\nConnection timeout\r\n')
    })

    telnetClient.on('error', (err: Error) => {
      window.webContents.send('terminal:data', terminalId, `Error: ${err.message}\r\n`)
    })
  }
}