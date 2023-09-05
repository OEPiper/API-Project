import { UseSelector, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchSpotDetails } from "../../store/spots";
import { fetchSpotReviews } from "../../store/reviews";
import './ReviewsForSpot.css';
import CreateReviewModal from "./CreateReviewModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "./DeleteReviewModal";


const ReviewsForSpot = ({spot}) =>{
    const reviewsList = useSelector((state) => (state.reviews ? state.reviews : []));
    const reviews = Object.values(reviewsList);
    const sessionUser = useSelector(state => state.session.user);
    const [reviewBtn, setReviewBtn] = useState(true)
    const dispatch = useDispatch();
    useEffect(() => {
        if(sessionUser){
        if(spot.ownerId === sessionUser.id){
            setReviewBtn(false)
        }else if(reviews.filter((review) => review.userId === sessionUser.id).length > 0){
           setReviewBtn(false)
       }
    }else if(!sessionUser){
        setReviewBtn(false)
    }else{
        setReviewBtn(true)
    }
    },[spot.ownerId, reviewBtn, sessionUser, reviews.length])
    // useEffect(() =>{
    //     if(sessionUser){
            
    // }
    // },[reviews, spot.id, sessionUser, reviewBtn])
    
    
    useEffect(() => {
        dispatch(fetchSpotReviews(spot.id))
        dispatch(fetchSpotDetails(spot.id))
    },[dispatch, spot.id, sessionUser]);

    if(!reviews.length){
        return (<div className="first-review">
        {spot.numReviews < 1 && reviewBtn && 
        <button className="post-review"><OpenModalMenuItem
            itemText='Post a Review'
            modalComponent={<CreateReviewModal spot={spot}/>}/></button>}
        {spot.numReviews < 1 &&<p>
            Be the first to post a review!
        </p>}
    </div>)

    }
    const getYear = (reviewDate) => {
        let date = new Date(reviewDate)
        return date.getFullYear()
    }
    const getMonth = (reviewDate) => {
        let date = new Date(reviewDate)
        let month = date.getMonth()
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return months[month]
    }
    let sortedReviews = reviews.sort((dateA, dateB) => new Date(dateB.createdAt) - new Date(dateA.createdAt))
    
    return(
        <div>
            {reviewBtn && <button className="post-review"><OpenModalMenuItem
                    itemText='Post a Review'
                    modalComponent={<CreateReviewModal spot={spot}/>}/></button>}
            <ul>
                {sortedReviews.map((review) => (
                    <li className="review-item">   
                    <p className="guest-name">{review.User.firstName} {review.User.lastName}</p>
                    <p className="review-date">{getMonth(review.createdAt)} {getYear(review.createdAt)}</p>
                    <p>{review.review}</p>
                    {review.userId === sessionUser?.id && <button className="delete-review"><OpenModalMenuItem
                    itemText='Delete'
                    modalComponent={<DeleteReviewModal review={review}/>}/></button>}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ReviewsForSpot