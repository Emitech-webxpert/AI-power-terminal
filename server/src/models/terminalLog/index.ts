import { DataTypes, Model } from 'sequelize';
import sequelize from '@db/database';
import { ITerminalLog, ICreateTerminalLog } from '@interfaces/terminalLog';

class TerminalLog extends Model<ITerminalLog, ICreateTerminalLog> implements ITerminalLog {
  public id!: string;
  public userId!: string;
  public command!: string;
  public time!: Date;
  public status!: 'success' | 'error' | 'running';
  public output!: string;
  public severity!: 'low' | 'medium' | 'high';
  public createdAt!: Date;
  public updatedAt!: Date;
}

TerminalLog.init(
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
    command: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
    status: {
      type: DataTypes.ENUM('success', 'error', 'running'),
      allowNull: false,
    },
    output: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'low',
    }
  },
  {
    sequelize,
    modelName: 'TerminalLog',
    tableName: 'TerminalLogs',
    timestamps: true,
  }
);

export default TerminalLog;