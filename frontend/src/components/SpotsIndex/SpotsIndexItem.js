import {Link} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './SpotsIndex.css'

const SpotIndexItem = ({spot}) => {
    
    if(!spot.avgRating){
        spot.avgRating = 'New'
    }
    if(Number.isInteger(spot.avgRating)){
        spot.avgRating = spot.avgRating.toFixed(1)
    }
    
    return (
        <li>
            <img className='spot-img' src={spot.previewImage} />
            <p>{spot.city}, {spot.state}</p>
            <p>{spot.avgRating}</p>
            <p>${spot.price.toFixed(2)} per night</p>
        </li>
    )
}

export default SpotIndexItem