const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id;
    const userSpots = await Spot.findAll({
      where: {
        ownerId: userId
      },
      include: [{
        model:Review,
        attributes: ['stars'],
      },{
        model: SpotImage 
      }
    ]
  });
  
  let spotsList = [];
  userSpots.forEach((spot) =>{
    spotsList.push(spot.toJSON())
  })
  spotsList.forEach((spot) => {
    let starSum = 0
    spot.Reviews.forEach((reviews) => {
      starSum += reviews.stars
    })
    let starAvg = starSum/spot.Reviews.length;
    spot.avgRating = starAvg
    spot.previewImage = spot.SpotImages[0].url
    delete spot.Reviews
    
    delete spot.SpotImages
  })
  res.json({Spots:spotsList})
})
  
  
router.get('/:spotId', async(req,res) => {
    const spotId = req.params.spotId;
    let spot = await Spot.findByPk(spotId, {
      include: [{
        model: Review
      }, {model: SpotImage, attributes: ['id', 'url', 'preview']},
    {model: User, attributes: ['id', 'firstName', 'lastName']}]
    });
    if(!spot){
      res.status(404);
      res.json({message: "Spot couldn't be found"})
    }
    //const images = await spot.getSpotImages({})
    spot = spot.toJSON();
    let starSum = 0
      spot.Reviews.forEach((reviews) => {
        starSum += reviews.stars
      })
      let starAvg = starSum/spot.Reviews.length;
      spot.numReviews = spot.Reviews.length
      spot.avgRating = starAvg
      spot.Owner = spot.User
      delete spot.Reviews
      delete spot.User
   
    
    res.json(spot)
      
})

router.get('/', async(req,res) => {
    const spots = await Spot.findAll({
      include:[{
        model: Review
      }, {
        model: SpotImage
      }]
    });

    let spotsList = [];
    spots.forEach((spot) =>{
      spotsList.push(spot.toJSON())
    })
    spotsList.forEach((spot) => {
      let starSum = 0
      spot.Reviews.forEach((reviews) => {
        starSum += reviews.stars
      })
      let starAvg = starSum/spot.Reviews.length;
      spot.avgRating = starAvg
      spot.previewImage = spot.SpotImages[0].url
      delete spot.Reviews
      
      delete spot.SpotImages
    })
    res.json({Spots:spotsList})
})

module.exports = router;