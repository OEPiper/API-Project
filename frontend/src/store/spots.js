import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECIEVE_SPOT = 'spots/RECIEVE_SPOTS';

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

export const recieveSpot = (spot) => ({
    type: RECIEVE_SPOT,
    spot
})

export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
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
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData)
    });
    if(res.ok){
        const newSpot = await res.json();
        dispatch(recieveSpot(newSpot))
        return newSpot
    }else{
        const errors = await res.json();
        return errors
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
        default:
            return state
    }
};

export default spotsReducer