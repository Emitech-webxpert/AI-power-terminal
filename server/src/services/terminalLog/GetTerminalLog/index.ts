import TerminalLogs from '@models/terminalLogModel';

const getTerminalLogById = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Log ID is required');
    }

    const log = await TerminalLogs.findByPk(id);
    return log ? log.toJSON() : null;
  } catch (error: any) {
    throw new Error(`Failed to get terminal log: ${error.message}`);
  }
};

export default getTerminalLogById;