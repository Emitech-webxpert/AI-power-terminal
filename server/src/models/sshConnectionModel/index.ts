import { DataTypes, Model } from 'sequelize';
import sequelize from '@db/database';
import { IConnection, ICreateConnection, } from '@interfaces/sshConnectionInterface';

class Connection extends Model<IConnection, ICreateConnection> implements IConnection {
  public id!: string;
  public userId!: string;
  public protocol!: string;
  public host!: string;
  public port!: number;
  public username!: string;
  public sessionName!: string;
  public description?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Connection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
       userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    protocol: {
      type: DataTypes.ENUM('SSH', 'Telnet', 'SSH2', 'LocalTerminal'),
      allowNull: false,
    },
    host: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sessionName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Connection',
    tableName: 'Connections',
    timestamps: true,
  }
);

export default Connection;