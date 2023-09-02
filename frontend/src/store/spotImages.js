import { csrfFetch } from "./csrf";

export const RECIEVE_IMAGES = 'images/RECIEVE_IMAGES'

export const recieveImage = (image) => ({
    type: RECIEVE_IMAGES,
    image
});

export const postImage = (spotId, url, preview) => async (dispatch) =>{
    try{
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({url, preview})
    });
    
        const newImage = await res.json();
        dispatch(recieveImage(newImage))
        return newImage
    }catch(err){
        const errors = err.json();
        return errors
    }
};

const initialState = {};

const imageReducer = (state = initialState, action) =>{
    switch(action.type) {
        case RECIEVE_IMAGES:
            return{...state, [action.image.id]: action.image};
        default:
            return state
    }
};

export default imageReducer