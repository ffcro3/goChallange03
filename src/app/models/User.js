import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        userType: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // HOOKS IS USED ONCE WE NEED TO DO SOMETHING BEFORE OR AFTER THE DB NEEDS
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // RELATINSHIP WITH FILES (AVATAR_ID)
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // METHOD TO CHECK IF THE CRYPTOGRAPHY IS THE SAME THAT REGISTRED IN DB
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

export default User;
