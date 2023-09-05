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
        <li className='spot-tile'>
            <img className='spot-img' src={spot.previewImage} />
            <div>
                <div>
            <p>{spot.city}, {spot.state}</p>
            {spot.avgRating ? (<p><i class="fa-solid fa-star"></i>{spot.avgRating}</p> ):
            (<p><i class="fa-solid fa-star"></i>New</p>)}
                </div>
            <p>${spot.price} per night</p>
            </div>
        </li>
    )
}

export default SpotIndexItem