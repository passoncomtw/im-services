const { saltHashPassword } = require("../../helpers/utils");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        field: "name",
        type: DataTypes.STRING,
        length: 20,
      },
      phone: {
        field: "phone",
        type: DataTypes.STRING,
        length: 20,
      },
      email: {
        field: "email",
        type: DataTypes.STRING,
        length: 50,
        unique: true,
      },
      password: {
        field: "password",
        type: DataTypes.STRING,
        length: 200,
        set(value) {
          this.setDataValue("password", saltHashPassword(value));
        },
      },
    }, {
    sequelize,
    tableName: "users",
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  });

  User.associate = function (models) {
    // User.hasMany(models.Contract, {
    //   as: 'contracts',
    //   foreignKey: {
    //     name: 'user_id'
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE',
    // });
  };

  return User;
};