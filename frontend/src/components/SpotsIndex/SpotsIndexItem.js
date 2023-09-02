import {Link} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './SpotsIndex.css'

const SpotIndexItem = ({spot}) => {
    
    
    if(Number.isInteger(spot.avgRating)){
        spot.avgRating = spot.avgRating.toFixed(1)
    }
    if(Number.isInteger(spot.price)){
        spot.price = spot.price.toFixed(2)
    }
    
    return (
        <li>
            <img className='spot-img' src={spot.previewImage} />
            <p>{spot.city}, {spot.state}</p>
            {spot.avgRating ? (<p><i class="fa-solid fa-star"></i>{spot.avgRating} {'\u2022'} ${spot.price} per night</p>):
            (<p><i class="fa-solid fa-star"></i>New ${spot.price} per night</p>)}
        </li>
    )
}

export default SpotIndexItem