import { Link, useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchUserSpots } from "../../store/spots";
import SpotIndexItem from "../SpotsIndex/SpotsIndexItem";

const ManageSpots = () => {
    const spotsList = useSelector((state) => (state.spots ? state.spots : []));
    const spots = Object.values(spotsList)
    const dispatch = useDispatch();
    const history = useHistory()
    
    useEffect(() => {
        dispatch(fetchUserSpots());
    }, [dispatch]);
    if(!spots.length){
        return null
    }
    
    
    return(
        <div>
            <h2>Manage Spots</h2>
            <Link exact to='/spots/new'>
                Create a New Spot
            </Link>
            <ul className="spot-list">
                {spots.map((spot) => (
                    <li>
                    <Link exact to={`/spots/${spot.id}`}>
                     <SpotIndexItem spot={spot} key={spot.id}/>
                    </Link>
                    <button onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>
                    <button>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ManageSpots