const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50})
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors
];

router.post('/', requireAuth, validateSpot, async(req,res) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body;
  const ownerId = req.user.id;
  
  const newSpot = await Spot.create({
    ownerId: ownerId,
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price
  });
  res.json(newSpot)
  
})

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