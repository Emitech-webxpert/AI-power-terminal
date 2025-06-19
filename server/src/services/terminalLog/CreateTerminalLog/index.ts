import TerminalLog from '@models/terminalLog';
import { ICreateTerminalLog } from '@interfaces/terminalLogIn';

const createTerminalLog = async (commandData: ICreateTerminalLog) => {
  try {
    // Validate required fields
    if (!commandData.userId || !commandData.command || !commandData.status) {
      throw new Error('UserId, command, and status are required');
    }

    // Create terminal log entry
    const log = await TerminalLog.create({
      userId: commandData.userId,
      command: commandData.command,
      time: commandData.time,
      status: commandData.status,
      output: commandData.output || '',
      severity: commandData.severity || 'low'
    });

    return log.toJSON();
  } catch (error: any) {
    throw new Error(`Failed to create terminal session: ${error.message}`);
  }
};

export default createTerminalLog;