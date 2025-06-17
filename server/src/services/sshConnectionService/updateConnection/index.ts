import Connection from '@models/sshConnectionModel';
import { IConnection, IUpdateConnection } from '@interfaces/sshConnectionInterface';

const updateConnection = async (id: string, updateData: IUpdateConnection): Promise<IConnection | null> => {
  try {
    const [updatedRowsCount] = await Connection.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return null; // Connection not found
    }

    // Return updated connection
    const updatedConnection = await Connection.findByPk(id);
    return updatedConnection ? updatedConnection.toJSON() as IConnection : null;
  } catch (error: any) {
    throw new Error(`Failed to update connection: ${error.message}`);
  }
};

export default updateConnection;