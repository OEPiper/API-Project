const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get('/current', requireAuth, async(req,res) => {
    const userId = req.user.id;
    let reviews = await Review.findAll({
        where: {
            userId: userId
        },
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Spot, include: {model: SpotImage}, attributes: ["id", "ownerId","address", "city", "state", "country", "lat", "lng", "name", "description", "price"]},
            {model: ReviewImage, attributes: ['id', 'url']}
        ]
    });
    let reviewList = []
    reviews.forEach((review)=>{
        reviewList.push(review.toJSON())
    })
    reviewList.forEach((review) =>{
        let spot = review.Spot;
        if(spot.SpotImages.length > 0){
            for(let image of spot.SpotImages){
                if(image.preview == true)
                spot.previewImage = image.url
            }
        }
        delete spot.SpotImages
    })
    res.json(reviewList)   
})

module.exports = router;