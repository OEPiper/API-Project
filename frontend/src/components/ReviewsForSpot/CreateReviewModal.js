import { useState, useEffect } from "react"
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { fetchSpotReviews } from "../../store/reviews";

const CreateReviewModal = ({spot}) =>{
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});
    const [starErr, setStarErr] = useState(false);
    const [reviewErr, setReviewErr] = useState(false);
    const [disable, setDisable] = useState(false);
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    useEffect(() => {
      if(review.length < 10 || stars < 1){
        setDisable(true)
      }else{
        setDisable(false)
      }
    },[review, stars, disable])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setErrors({});
        let reviewPayload = {
            review,
            stars
        }
        if(review.length < 10){
            errors.review = 'Review must be atleast 10 characters long';
            setReviewErr(true)
        }
        if(stars < 1){
            errors.stars = 'Review must have atleast one star'
            setStarErr(true)
        }
        if(Object.values(errors).length > 0){
            setErrors(errors)
            return
        }else{
            dispatch(createReview(reviewPayload, spot.id))
            .then(dispatch(fetchSpotReviews(spot.id)))
            .then(closeModal());
            window.location.reload()
            
            
        }


    }
    return (
        <form onSubmit={handleSubmit}>
            <h2>How was your stay?</h2>
            {reviewErr && <p>'Review must be atleast 10 characters long'</p>}
            {starErr && <p>'Review must have atleast one star'</p>}
            <label>
            <textarea 
            placeholder="Leave your review here"
            value={review}
            onChange={(e) => setReview(e.target.value)}/>
            </label>
    <div className="rating-input">
        <h3>Stars</h3>
      <div
        className={stars >= 1 ? "filled" : "empty"}
        onMouseEnter={() => {  setStars(1)} }
        //onMouseLeave={() => {  setStars(0)} }
        onClick={() => {  setStars(1)} }
      >
        <i className="fa-solid fa-star"></i>
      </div>
      <div
        className={stars >= 2 ? "filled" : "empty"}
        onMouseEnter={() => {  setStars(2)} }
        //onMouseLeave={() => { setStars(0)} }
        onClick={() => {  setStars(2)} }
      >
        <i className="fa-solid fa-star"></i>
      </div>
      <div
        className={stars >= 3 ? "filled" : "empty"}
        onMouseEnter={() => {setStars(3)} }
       //onMouseLeave={() => { setStars(0)} }
        onClick={() => { setStars(3)} }
      >
        <i className="fa-solid fa-star"></i>
      </div>
      <div
        className={stars >= 4 ? "filled" : "empty"}
        onMouseEnter={() => {  setStars(4)} }
        //onMouseLeave={() => {  setStars(0)} }
        onClick={() => {  setStars(4)} }
      >
        <i className="fa-solid fa-star"></i>
      </div>
      <div
        className={stars >= 5 ? "filled" : "empty"}
        onMouseEnter={() => { setStars(5) }}
        //onMouseLeave={() => {  setStars(0)} }
        onClick={() => {  setStars(5)} }
      >
        <i className="fa-solid fa-star"></i>
      </div>
    </div>
            <button type='submit' disabled={disable} >Submit your review</button>
        </form>
    )
}
export default CreateReviewModal