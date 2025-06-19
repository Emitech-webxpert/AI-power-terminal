import Connection from '@models/sshConnection';
import { ICreateConnection } from '@interfaces/sshConnection';

const createSShConnection = async (connectionData: ICreateConnection) => {
  try {
    const newConnection = await Connection.create(connectionData);
    return newConnection;
  } catch (error: any) {
    throw new Error(`Error creating SSH connection: ${error.message}`);
  }
};
export default createSShConnection;