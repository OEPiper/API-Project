const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

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