import Connection from '@models/sshConnection';
import { IConnection, IConnectionQuery } from '@interfaces/sshConnection';
import { Op } from 'sequelize';

const searchConnections = async (query: IConnectionQuery): Promise<{
  connections: IConnection[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const where: any = {};
    
    // Build where conditions
    if (query.id) where.id = query.id;
    if (query.hostname) where.hostname = { [Op.iLike]: `%${query.hostname}%` };
    if (query.sessionName) where.sessionName = { [Op.iLike]: `%${query.sessionName}%` };

    const limit = query.limit || 10;
    const offset = query.offset || 0;
    const page = Math.floor(offset / limit) + 1;

    const { count, rows } = await Connection.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      connections: rows.map(conn => conn.toJSON() as IConnection),
      total: count,
      page,
      limit
    };
  } catch (error: any) {
    throw new Error(`Failed to search connections: ${error.message}`);
  }
};

export default searchConnections;