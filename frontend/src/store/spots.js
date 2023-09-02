import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECIEVE_SPOT = 'spots/RECIEVE_SPOTS';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT'

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

export const recieveSpot = (spot) => ({
    type: RECIEVE_SPOT,
    spot
});

export const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
})

export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    if(res.ok){
        const spots = await res.json();
        dispatch(loadSpots(spots));
    }
};

export const fetchUserSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current');
    if(res.ok){
        const spots = await res.json();
        dispatch(loadSpots(spots));
    }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`, {method: 'GET'});
    if(res.ok){
        const spotDetails = await res.json();
        dispatch(recieveSpot(spotDetails));
    }else{
        const errors = res.json()
        return errors
    }
};

export const createSpot = (spotData) => async (dispatch) => {
    try{
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData)
    });
   
        const newSpot = await res.json();
        dispatch(recieveSpot(newSpot))
        return newSpot
    }catch(err){
        //console.log('errors')
        const errors = await err.json();
        return errors
    }
};

export const updateSpot = (spot) => async (dispatch) => {
    try{
        const res = await csrfFetch(`/api/spots/${spot.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spot)
        });
        const updatedSpot = await res.json();
        dispatch(editSpot(updatedSpot))
        return updatedSpot
    }catch(err){
        const errors = await err.json();
        return errors
    }
}

export const deleteSpot = (spotId) => async (dispatch) => {
    try{
        const res = await csrfFetch(`/api/spots/${spotId}`,
        {
            method: 'DELETE',
        });
        dispatch(removeSpot(spotId));
    }catch(err){
        const error = err.json();
        return error
    }
}


const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            const spotsState = {};
            const spotsAction = action.spots
            spotsAction.Spots.forEach((spot) => {
                spotsState[spot.id] = spot;
            });
            return spotsState
        case RECIEVE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case UPDATE_SPOT:
            return { ...state, [action.spot.id]: action.spot };
        case RECIEVE_SPOT:
            const newState = {...state};
            delete newState[action.reportId];
            return newState
        default:
            return state
    }
};

export default spotsReducer