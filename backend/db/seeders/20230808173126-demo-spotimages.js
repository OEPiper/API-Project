'use strict';
const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: "https://media.wdwnt.com/2021/04/Image-from-iOS-123-7309736-1200x900.jpg",
      preview: true
    },
    {
      spotId: 2,
      url: "https://mondaynightbrewing.com/wp-content/uploads/2023/01/west-midtown-edited-1-jpg.webp",
      preview: true
    },
    {
      spotId: 1,
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Sleeping_Beauty_Castle_2019.jpg/1200px-Sleeping_Beauty_Castle_2019.jpg',
      preview: false
    },
    {
      spotId: 1,
      url: "https://i.insider.com/55a6c783371d22a40e8b6965?width=1000&format=jpeg&auto=webp",
      preview:false
    },
    {
      spotId: 1,
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Sleeping_Beauty_Castle_Disneyland_Anaheim_2013.jpg/1200px-Sleeping_Beauty_Castle_Disneyland_Anaheim_2013.jpg",
      preview:false
    },
    {
      spotId: 1,
      url: "https://media.cnn.com/api/v1/images/stellar/prod/210115095802-01-disneyland-anaheim-file.jpg?q=x_0,y_0,h_1687,w_2997,c_fill/h_720,w_1280/f_webp",
      preview:false
    },
    {
      spotId: 2,
      url: "https://mondaynightbrewing.com/wp-content/uploads/2022/12/49768546903_3d041c9e91_o-1.jpg",
      preview:false
    },
    {
      spotId: 2,
      url: "https://mondaynightbrewing.com/wp-content/uploads/2022/12/50341871687_836fe4ff77_o-1024x768.jpg",
      preview:false
    },
    {
      spotId: 2,
      url: "https://mondaynightbrewing.com/wp-content/uploads/2022/11/garage-section-scaled.jpg",
      preview:false
    },
    {
      spotId: 2,
      url: "https://tswdesign.files.wordpress.com/2013/08/mnb_tastingroom_bt-7-custom.jpg",
      preview:false
    },


   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["image url"] }
    }, {});
  }
};
