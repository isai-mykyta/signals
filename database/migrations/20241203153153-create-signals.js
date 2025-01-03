"use strict";

const { DataTypes, } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable("Signals", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      strategyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Strategies",
          key: "id",
        },
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tasks",
          key: "id",
        },
      },
      asset: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      marketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Markets",
          key: "id",
        },
      },
      producedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      rulesMet: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
      },
      actionsTriggered: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable("Signals");
  },
};
