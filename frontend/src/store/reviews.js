import { csrfFetch } from "./csrf";

export const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';
export const RECIEVE_REVIEW = 'reviews/RECIEVE_REVIEW'

export const loadSpotReviews = (reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
});

export const recieveReview = (review) => ({
    type: RECIEVE_REVIEW,
    review
})

export const fetchSpotReviews = (spotId) => async(dispatch) =>{
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    if(res.ok){
        const reviews = await res.json();
        dispatch(loadSpotReviews(reviews));
    }else{
        const errors = res.json()
        return errors
    }
}

export const createReview = (review, spotId) => async (dispatch) => {
    try{
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });
        const newReview = await res.json();
        dispatch(recieveReview(newReview));
        return newReview
    }catch(err){
        const errors = await err.json();
        return errors
    }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type){
        case LOAD_SPOT_REVIEWS:
            const reviewsState = {};
            const reviewsAction = action.reviews;
            reviewsAction.Reviews.forEach((review) =>{
                reviewsState[review.id] = review;
            });
            return reviewsState
        case RECIEVE_REVIEW:
            return { ...state, [action.review.id]: action.review };
        default: 
            return state
    }
}

export default reviewReducer