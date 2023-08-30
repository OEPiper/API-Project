import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spots';
import { postImage } from '../../store/spotImages';



const SpotForm = ({ spot, formType }) => {
  const history = useHistory();
  const [country, setCountry] = useState(spot?.country);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [lat, setLat] = useState(spot?.lat);
  const [lng, setLng] = useState(spot?.lng);
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  const [price, setPrice] = useState(spot?.price)
  const [previewImgUrl, setPreviewImageUrl] = useState('')
  const [imageUrl1, setImageUrl1] = useState('')
  const [imageUrl2, setImageUrl2] = useState('')
  const [imageUrl3, setImageUrl3] = useState('')
  const [imageUrl4, setImageUrl4] = useState('')
  const [preview, setPreview] = useState(false)
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    spot = { 
        ...spot,
        country, 
        address, 
        city, 
        state, 
        lat, 
        lng, 
        description, 
        name, 
        price};
    
      const newSpot = await dispatch(createSpot(spot));
      spot = newSpot;
      if(!spot.id){
          return null
      }
      const newPreview = await dispatch(postImage(spot.id, previewImgUrl, true))
      const newImage1 = await dispatch(postImage(spot.id, imageUrl1, false))
      const newImage2 = await dispatch(postImage(spot.id, imageUrl2, false))
      const newImage3 = await dispatch(postImage(spot.id, imageUrl3, false))
      const newImage4 = await dispatch(postImage(spot.id, imageUrl4, false))

    console.log(spot.errors)
    if (spot.errors) {
      setErrors(spot.errors);
    } else {
      history.push(`/spots/${spot.id}`);
    }
  };

  
    let submitText = 'Create Spot'
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>{formType}</h2>
      <p>Where's your place located?</p>
      <p>Guests will only know your exact address once they booked a reservation</p>
        <label>
            Country
            <input
            type="text"
            placeholder='Country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            />
        </label>
        {errors.country && <p>{errors.country}</p>}
        <label>
            Street address
            <input
            type='text'
            placeholder='Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            />
        </label>
        {errors.address && <p>{errors.address}</p>}
        <label>
            City
            <input
            type='text'
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            />
        </label>
        {errors.city && <p>{errors.city}</p>}
        <label>
            State
            <input
            type='text'
            placeholder='STATE'
            value={state}
            onChange={(e) => setState(e.target.value)}
            />
        </label>
        {errors.state && <p>{errors.state}</p>}
        <label>
            Latitude 
            <input
            type='number'
            placeholder='Latitude'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            />
        </label>
        {errors.lat && <p>{errors.lat}</p>}
        <label>
            Longitude 
            <input
            type='number'
            placeholder='Longitude'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            />
        </label>
        {errors.lng && <p>{errors.lng}</p>}
        <label>
            <h3>Describe your place to guests</h3>
            <p>Mention the best features of your space, any special amendities like fast wifi or parking, and what you love about the neighborhood</p>
            <textarea
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </label>
        {errors.description && <p>{errors.description}</p>}
        <label>
            <h3>Create a title for your spot</h3>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
            type='text'
            placeholder='Name of your spot'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
            <h3>Set a price based on a spot</h3>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            $<input
            type='number'
            placeholder='Price per night (USD)'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />
        </label>
        {errors.price && <p>{errors.price}</p>}
        <label>
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
            value={previewImgUrl}
            type='text'
            placeholder='Preview Image URL'
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            />
            <input
            value={imageUrl1}
            type='text'
            placeholder='Image URL'
            onChange={(e) => setImageUrl1(e.target.value)}
            />
            <input
            value={imageUrl2}
            type='text'
            placeholder='Image URL'
            onChange={(e) => setImageUrl2(e.target.value)}
            />
            <input
            value={imageUrl3}
            type='text'
            placeholder='Image URL'
            onChange={(e) => setImageUrl3(e.target.value)}
            />
            <input
            value={imageUrl4}
            type='text'
            placeholder='Image URL'
            onChange={(e) => setImageUrl4(e.target.value)}
            />
        </label>
        <button type='submit'>{submitText}</button>

    </form>
  )
}

export default SpotForm
