const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete('/:bookingId', requireAuth, async(req,res) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;
    const deleteBooking = await Booking.findByPk(bookingId);
    if(!deleteBooking) {
        res.status(404);
        return res.json({message: "Booking couldn't be found"})
    }
    const spot = await Spot.findByPk(deleteBooking.spotId);
    if(deleteBooking.userId !== userId && spot.ownerId !== userId){
        res.status(403);
        return res.json({message: "Forbidden"})
    }
    let rightNow = Date.now();
    const startTime = deleteBooking.startDate.getTime();
    if(rightNow > startTime){
        res.status(403);
        return res.json({message: "Bookings that have been started can't be deleted"})
    }
    await deleteBooking.destroy()
    res.json({message: "Successfully deleted"})
})

router.put('/:bookingId', requireAuth, async(req,res) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;
    const {startDate, endDate} = req.body
    let errors = {}
    const updatedBooking = await Booking.findByPk(bookingId);
    if(!updatedBooking){
        res.status(404);
        return res.json({message: "Booking couldn't be found"})
    }
    if(updatedBooking.userId !== userId){
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
    const checkEnd = updatedBooking.endDate.getTime()
    let rightNow = Date.now();
    if(checkEnd < rightNow){
        res.status(403);
        return res.json({message: "Past bookings can't be modified"})
    }
    let bookings = await Booking.findAll({
        where: {spotId: updatedBooking.spotId}
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
      if(startDate) updatedBooking.startDate = new Date(startDate);
      if(endDate) updatedBooking.endDate = new Date(endDate);
      await updatedBooking.save();
      res.json(updatedBooking)
})

router.get('/current', requireAuth, async(req,res) => {
    const userId = req.user.id;
    let bookings = await Booking.findAll({
        where: {
            userId: userId
        },
        include: [
            {model: Spot, include: {model: SpotImage}, attributes: ["id", "ownerId","address", "city", "state", "country", "lat", "lng", "name", "description", "price"]}
        ]
    });
    let bookingList = []
    bookings.forEach((booking)=>{
        bookingList.push(booking.toJSON())
    })
    bookingList.forEach((booking) =>{
        let spot = booking.Spot;
        if(spot.SpotImages.length > 0){
            for(let image of spot.SpotImages){
                if(image.preview == true)
                spot.previewImage = image.url
            }
        }
        delete spot.SpotImages
    })
    res.json({Bookings:bookingList})   
})

module.exports = router;