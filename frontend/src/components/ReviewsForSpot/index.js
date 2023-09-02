import { UseSelector, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


import { fetchSpotReviews } from "../../store/reviews";
import './ReviewsForSpot.css';

const ReviewsForSpot = ({spot}) =>{
    const reviewsList = useSelector((state) => (state.reviews ? state.reviews : []));
    const reviews = Object.values(reviewsList);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSpotReviews(spot.id))
    },[dispatch, spot.id]);
    if(!reviews.length){
        return null
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
    console.log(sortedReviews)
    return(
        <div>
            <ul>
                {sortedReviews.map((review) => (
                    <li>   
                    <p>{review.User.firstName} {review.User.lastName}</p>
                    <p>{getMonth(review.createdAt)} {getYear(review.createdAt)}</p>
                    <p>{review.review}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ReviewsForSpot