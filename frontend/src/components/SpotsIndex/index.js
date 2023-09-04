import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchSpots } from "../../store/spots";
import SpotIndexItem from "./SpotsIndexItem";
import './SpotsIndex.css'

const SpotsIndex = () => {
    const spotsList = useSelector((state) => (state.spots ? state.spots : []));
    const spots = Object.values(spotsList)
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);
    if(!spots.length){
        return null
    }

    return (
        <section>
            <ul className="spot-list">
                {spots.map((spot) => (
                    <div title={spot.name}>
                    <Link exact to={`/spots/${spot.id}`}>
                     <SpotIndexItem spot={spot} key={spot.id}/>
                    </Link>
                    </div>
                ))}
            </ul>
        </section>
    )
}

export default SpotsIndex