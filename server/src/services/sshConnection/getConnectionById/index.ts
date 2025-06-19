import Connection from '@models/sshConnection';
import { IConnection } from '@interfaces/sshConnection';

const getConnectionById = async (id: string): Promise<IConnection | null> => {
  try {
    const connection = await Connection.findByPk(id);
    return connection ? connection.toJSON() as IConnection : null;
  } catch (error: any) {
    throw new Error(`Failed to fetch connection: ${error.message}`);
  }
};

export default getConnectionById;