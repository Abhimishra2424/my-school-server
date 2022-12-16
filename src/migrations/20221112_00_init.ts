import { DataTypes } from 'sequelize';
import { Migration } from '../types';

// These two functions get passed the context in migrationConf in db.js
export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID(),
      defaultValue: DataTypes.UUIDV4(),
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    register_date: {
      type: DataTypes.DATEONLY(),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY(),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(5), // Make it six for good measures? :D
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
    },
    is_reset: {
      type: DataTypes.BOOLEAN(),
      defaultValue: true,
    },
    updated_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
  });
  await queryInterface.createTable('admins', {
    serial: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID(),
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('admins');
  await queryInterface.dropTable('users');
};
