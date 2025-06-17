import Connection from '@models/sshConnectionModel';
import { IConnection } from '@interfaces/sshConnectionInterface';

const getAllConnections = async (): Promise<IConnection[]> => {
  try {
    const connections = await Connection.findAll({
      order: [['createdAt', 'DESC']]
    });
    return connections.map(conn => conn.toJSON() as IConnection);
  } catch (error: any) {
    throw new Error(`Failed to fetch connections: ${error.message}`);
  }
};

export default getAllConnections;