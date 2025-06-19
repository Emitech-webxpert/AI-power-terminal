import Connection from '@models/sshConnection';

const deleteConnection = async (id: string): Promise<boolean> => {
  try {
    const deletedRowsCount = await Connection.destroy({
      where: { id }
    });

    return deletedRowsCount > 0;
  } catch (error: any) {
    throw new Error(`Failed to delete connection: ${error.message}`);
  }
};

export default deleteConnection;