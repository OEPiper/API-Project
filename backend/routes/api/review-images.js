const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, User, Review, ReviewImage, SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete('/:imageId', requireAuth, async(req,res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    const deleteImage = await ReviewImage.findByPk(imageId);
    if(!deleteImage){
        res.status(404);
        return res.json({message: "Review Image couldn't be found"})
    }
    const review = await Review.findByPk(deleteImage.reviewId);
    if(review.userId !== userId){
        res.status(403);
        return res.json({message: 'Forbidden'})
    }
    await deleteImage.destroy();
    res.json({message: "Successfully deleted"})
})

module.exports = router;