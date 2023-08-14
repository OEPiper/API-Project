const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage, Booking } = require('../../db/models');
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
const validateQuery = [
  check('page')
    .optional()
    .isInt({min:1, max:10})
    .withMessage("Page must be greater than or equal to 1"),
  check('size')
    .optional()
    .isInt({min:1, max:20})
    .withMessage("Size must be greater than or equal to 1"),
  check('minLat')
    .optional()
    .isDecimal()
    .withMessage('Minimum latitude is invalid'),
  check('maxLat')
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  check('minLng')
    .optional()
    .isDecimal()
    .withMessage("Minimum longitude is invalid"),
  check('maxLng')
    .optional()
    .isDecimal()
    .withMessage("Maximum longitude is invalid"),
  check('minPrice')
    .optional()
    .isDecimal({min: 0})
    .withMessage("Minimum price must be greater than or equal to 0"),
  check('maxPrice')
    .optional()
    .isDecimal({min: 0})
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors
];


router.post('/:spotId/bookings', requireAuth, async(req,res) =>{
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const {startDate, endDate} = req.body;
  let errors = {}
  const spot = await Spot.findByPk(spotId);
  if(!spot) {
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  }
  if(spot.ownerId === userId){
    res.status(403);
    return res.json({message: 'Forbidden'})
  }
  const startTime = new Date(startDate).getTime();
  const endTime =  new Date(endDate).getTime();
  if(startTime >= endTime) {
    res.status(400);
    return res.json({
      "message": "Bad Request",
      "errors": {
        "endDate": "endDate cannot be on or before startDate"
      }
    })
  }
  let bookings = await Booking.findAll({
    where: {spotId: parseInt(spotId)}
  })
  let bookingsList = [];
  bookings.forEach((booking) => {
    bookingsList.push(booking.toJSON())
  });
  bookingsList.forEach((booking) => {
    //let start = booking.startDate.toDateString();
    let bookingStartTime = booking.startDate.getTime();
    
    // let end = booking.endDate.toDateString();
    let bookingEndTime = booking.endDate.getTime();
    if(startTime >= bookingStartTime && startTime <= bookingEndTime){
      errors.startDate = "Start date conflicts with an existing booking"
    }
    if(endTime >= bookingStartTime && endTime <= bookingEndTime){
      errors.endDate = "End date conflicts with an existing booking"
    }
  
  })
  if(Object.keys(errors).length > 0){
    res.status(403);
    return res.json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: errors
    })
  }
  const newBooking = await Booking.create({
    spotId: parseInt(spotId),
    userId: userId,
    startDate: new Date(startDate),
    endDate: new Date(endDate)
  })

  res.json(newBooking)
})

router.get('/:spotId/bookings', requireAuth, async(req,res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if(!spot){
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  }
  if(spot.ownerId === userId){
    let bookings = await Booking.findAll({
      where:{
        spotId: parseInt(spotId)
      },
      include: {model: User, attributes: ['id', 'firstName', 'lastName']}
    })
    return res.json({Bookings: bookings})
  }
  if(spot.ownerId !== userId){
    let bookings = await Booking.findAll({
      where:{
        spotId: parseInt(spotId)
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })
    return res.json({Bookings: bookings})
  }
})

router.post('/:spotId/reviews', validateReview, requireAuth, async(req,res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const {review, stars} = req.body
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
    review: review,
    stars: stars
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
  if(!deleteSpot){
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  };
  if(deleteSpot.ownerId !== userId){
    res.status(403);
    return res.json({message: 'Forbidden'})
  }
  await deleteSpot.destroy()
  res.json({message: 'Successfully deleted'})
})

router.put('/:spotId', validateSpot, requireAuth, async(req,res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const {address, city, state, country, lat, lng, name, description, price} = req.body;
  let updatedSpot = await Spot.findByPk(spotId);
  if(!updatedSpot){
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  };
  if(updatedSpot.ownerId !== userId){
    res.status(403);
    return res.json({message: 'Forbidden'});
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

router.get('/', validateQuery, async(req,res) => {
  where = {}
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
  if(!page) page = 1;
  if(!size) size = 20;
  page = parseInt(page);
  size = parseInt(size);

  let pagination = {};
  if(page >= 1 && size >= 1){
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }
  if(minLat) where.lat = {[Op.gte]: minLat};
  if(maxLat) where.lat = {[Op.lte]: maxLat};
  if(minLng) where.lng = {[Op.gte]: minLng};
  if(maxLng) where.lng = {[Op.lte]: maxLng};
  if(minPrice) where.price = {[Op.gte]: minPrice};
  if(maxPrice) where.price = {[Op.lte]: maxPrice};
    const spots = await Spot.findAll({
      where,
      include:[{
        model: Review
      }, {
        model: SpotImage
      }],
      ...pagination
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
      spot.page = page;
      spot.size = size;
      delete spot.Reviews
      
      delete spot.SpotImages
    })
    res.json({Spots:spotsList})
})

module.exports = router;