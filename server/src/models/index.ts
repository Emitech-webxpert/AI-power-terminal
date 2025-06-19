import sequelize from '@db/database';
import User from '@models/user';
import TerminalLog from '@models/terminalLog';

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