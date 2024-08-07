module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'users',
    [
      {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        phone: '0987654321',
        password: "6f11a2b6107bac62cb549adf8114326c135dd7fd636be74103c0d4b0ea6996ca2cca66f2de53ea5d12b0b0079998375bb2893bcfcc416b2fe04c82bac5f52b90",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jon Doe',
        email: 'jondoe@example.com',
        phone: '0987654322',
        password: "6f11a2b6107bac62cb549adf8114326c135dd7fd636be74103c0d4b0ea6996ca2cca66f2de53ea5d12b0b0079998375bb2893bcfcc416b2fe04c82bac5f52b90",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};