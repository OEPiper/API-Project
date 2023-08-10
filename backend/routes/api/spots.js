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
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({min:1, max:5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

router.post('/:spotId/reviews', validateReview, requireAuth, async(req,res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if(!spot) {
    res.status(404);
    return res.json({message: "Spot could't be found"})
  }
  const reviews = await Review.findAll({
    where:{
      spotId: parseInt(spotId),
      userId: userId
    }
  })
  if(reviews.length > 0){
    res.status(500);
    return res.json({message: 'User already has a review for this spot'})
  }
  const newReview = await Review.create({
    userId: userId,
    spotId: parseInt(spotId),
    review: "This was an awesome spot!",
    stars: 5
  })

  res.json(newReview)
})

router.get('/:spotId/reviews', async(req,res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if(!spot){
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  }
  const reviews = await Review.findAll({
    where: {
      spotId: spotId
    },
    include: [
      {model: User, attributes: ['id', 'firstName', 'lastName']},
      {model: ReviewImage, attributes: ['id', 'url']}
    ]
  })
  res.json({Reviews:reviews})
})

router.delete('/:spotId', requireAuth, async(req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const deleteSpot = await Spot.findByPk(spotId);
  if(deleteSpot.ownerId !== userId){
    res.status(403);
    return res.json({message: 'Forbidden'})
  }
  if(!deleteSpot){
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  };
  await deleteSpot.destroy()
  res.json({message: 'Successfully deleted'})
})

router.put('/:spotId', validateSpot, requireAuth, async(req,res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const {address, city, state, country, lat, lng, name, description, price} = req.body;
  let updatedSpot = await Spot.findByPk(spotId);
  if(updatedSpot.ownerId !== userId){
    res.status(403);
    return res.json({message: 'Forbidden'});
  };
  if(!updatedSpot){
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  };
  if(address) updatedSpot.address = address;
  if(city) updatedSpot.city = city;
  if(state) updatedSpot.state = state;
  if(country) updatedSpot.country = country;
  if(lat) updatedSpot.lat = lat;
  if(lng) updatedSpot.lng = lng;
  if(name) updatedSpot.name = name;
  if(description) updatedSpot.description = description;
  if(price) updatedSpot.price = price;

  await updatedSpot.save();
  res.json(updatedSpot);
})

router.post('/:spotId/images', requireAuth, async(req, res) => {
  const {url, preview} = req.body
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if(!spot){
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  }
  if(spot.ownerId !== req.user.id){
    res.status(403);
    return res.json({message: 'Forbidden'})
  };
  const newImage = await SpotImage.create({
    spotId: parseInt(spotId),
    url: url,
    preview: preview
  })
  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  })


})

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
    if(spot.SpotImages.length > 0){
      for(let image of spot.SpotImages){
        if(image.preview == true)
        spot.previewImage = image.url
      }
    }
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
      if(spot.SpotImages.length > 0){
        for(let image of spot.SpotImages){
          if(image.preview == true)
          spot.previewImage = image.url
      }
      };
      delete spot.Reviews
      
      delete spot.SpotImages
    })
    res.json({Spots:spotsList})
})

module.exports = router;