import { UseSelector, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


import { fetchSpotReviews } from "../../store/reviews";
import './ReviewsForSpot.css';

const ReviewsForSpot = ({spot}) =>{
    const reviewsList = useSelector((state) => (state.reviews ? state.reviews : []));
    const reviews = Object.values(reviewsList);
    const dispatch = useDispatch();
    console.log(reviews)
    useEffect(() => {
        dispatch(fetchSpotReviews(spot.id))
    },[dispatch, spot.id]);
    if(!reviews.length){
        return null
    }
    return(
        <div>
            <ul>
                {reviews.map((review) => (
                    <li>
                    <p>{review.User.firstName} {review.User.lastName}</p>
                    <p>{review.createdAt}</p>
                    <p>{review.review}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ReviewsForSpot