import { DataTypes, Model } from 'sequelize';
import sequelize from '@db/database';
import { IUser, IUserCreationAttributes } from '@interfaces/user';

class User extends Model<IUser, IUserCreationAttributes> implements IUser {
  public id!: string;
  public name!: string;
  public email!: string;
  public password?: string;
  public isGoogleLogin!: boolean;
  public resetOTP?: string;
  public resetOTPExpiry?: Date;
  public profileUrl?: string;
  public terminalLogId?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGoogleLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    resetOTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetOTPExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    profileUrl: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      defaultValue: null,
      comment: 'URL to the user profile image',
    },
    // terminalLogId: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   comment: 'Reference to terminal log table',
    // },

  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;