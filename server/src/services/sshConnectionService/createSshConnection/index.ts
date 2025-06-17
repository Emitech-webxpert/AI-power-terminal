import Connection from '@models/sshConnectionModel';
import { ICreateConnection } from '@interfaces/sshConnectionInterface';

const createSShConnection = async (connectionData: ICreateConnection) => {
  try {
    // return console.log(connectionData,"sadfsfd")
    const newConnection = await Connection.create(connectionData);
    return newConnection;
  } catch (error: any) {
    throw new Error(`Error creating SSH connection: ${error.message}`);
  }
};
export default createSShConnection;