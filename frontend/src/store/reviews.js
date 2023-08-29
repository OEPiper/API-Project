export const LOAD_SPOT_REVIEWS = 'reviews/LOAD_SPOT_REVIEWS';

export const loadSpotReviews = (reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
});

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
        default: 
            return state
    }
}

export default reviewReducer