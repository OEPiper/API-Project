const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

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

router.delete('/:reviewId', requireAuth, async(req,res) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;
    const deleteReview = await Review.findByPk(reviewId);
    if(!deleteReview){
        res.status(404);
        return res.json({message: "Review couldn't be found"})
    }
    if(deleteReview.userId !== userId){
        res.status(404)
        return res.json({message: 'Forbidden'})
    }
    await deleteReview.destroy();
    res.json({message: 'Successfully deleted'})
})

router.put('/:reviewId', validateReview, requireAuth, async(req,res) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;
    const {review, stars} = req.body
    let updatedReview = await Review.findByPk(reviewId);
    if(!updatedReview) {
        res.status(404);
        return res.json({message: "Review couldn't be found"})
    }
    if(updatedReview.userId !== userId){
        res.status(403);
        return res.json({message: 'Forbidden'})
    };
    if(review) updatedReview.review = review;
    if(stars) updatedReview.stars = stars;
    await updatedReview.save()
    res.json(updatedReview)
    
})

router.post('/:reviewId/images', requireAuth, async(req,res) =>{
    const reviewId = req.params.reviewId;
    const userId = req.user.id;
    const review = await Review.findByPk(reviewId);
    const images = await ReviewImage.findAll({
        where:{
            reviewId: parseInt(reviewId)
        }
    })
    console.log(images.length)
    if(!review){
        res.status(404);
        return res.json({message: "Review couldn't be found"})
    }
    if(review.userId !== userId){
        res.status(403);
        return res.json({message: 'Forbidden'})
    }
    if(images.length >= 10){
        res.status(404);
        return res.json({message: "Maximum number of images for this resourse was reached"})
    }
    const newImage = await ReviewImage.create({
        reviewId: parseInt(reviewId),
        url: "image url"
    })
    res.json({
        id: newImage.id,
        url: newImage.url
    })
    
})

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
    res.json({Reviews:reviewList})   
})

module.exports = router;