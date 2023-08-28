export const LOAD_SPOTS = 'spots/LOAD_SPOTS';

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');
    if(res.ok){
        const spots = await res.json();
        dispatch(loadSpots(spots));
    }
};

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
        default:
            return state
    }
};

export default spotsReducer