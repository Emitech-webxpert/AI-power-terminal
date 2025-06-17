import Connection from '@models/sshConnectionModel';
import { IConnection } from '@interfaces/sshConnectionInterface';

const getConnectionById = async (id: string): Promise<IConnection | null> => {
  try {
    const connection = await Connection.findByPk(id);
    return connection ? connection.toJSON() as IConnection : null;
  } catch (error: any) {
    throw new Error(`Failed to fetch connection: ${error.message}`);
  }
};

export default getConnectionById;