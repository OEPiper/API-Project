import { UseSelector, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


import { fetchSpotReviews } from "../../store/reviews";
import './ReviewsForSpot.css';
import CreateReviewModal from "./CreateReviewModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

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
        }
    }
    if(!sessionUser){
        setReviewBtn(false)
    }
    },[spot.ownerId, reviewBtn])
    useEffect(() =>{
        if(sessionUser){
            
         if(reviews.filter((review) => review.userId === sessionUser.id).length > 0){
            setReviewBtn(false)
        }
    }
    },[reviews])
    
    
    useEffect(() => {
        dispatch(fetchSpotReviews(spot.id))
    },[dispatch, spot.id]);
    
    if(!reviews.length){
        return (<>
                {reviewBtn && <button><OpenModalMenuItem
                    itemText='Post a Review'
                    modalComponent={<CreateReviewModal spot={spot}/>}/></button>}
                <p>
                    Be the first to post a review!
                </p>
            </>)
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
            {reviewBtn && <button><OpenModalMenuItem
                    itemText='Post a Review'
                    modalComponent={<CreateReviewModal spot={spot}/>}/></button>}
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