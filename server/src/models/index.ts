import sequelize from '@db/database';
import User from '@models/userModel';
import TerminalLog from '@models/terminalLogModel';

const setupAssociations = () => {
  User.hasMany(TerminalLog, { 
    foreignKey: 'userId',
    sourceKey: 'id'  
  });

  TerminalLog.belongsTo(User, { 
    foreignKey: 'userId',
    targetKey: 'id'   
  });
};

setupAssociations();

// Export models
export {
 sequelize,
 User,
 TerminalLog,
};

export default sequelize;