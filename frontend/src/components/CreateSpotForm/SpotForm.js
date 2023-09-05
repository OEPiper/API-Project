import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpot, updateSpot } from '../../store/spots';
import { postImage } from '../../store/spotImages';
import './CreateSpotForm.css'



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
  const [previewImgUrl, setPreviewImageUrl] = useState(spot?.SpotImages[0].url)
  const [imageUrl1, setImageUrl1] = useState(spot?.SpotImages[1]?.url)
  const [imageUrl2, setImageUrl2] = useState(spot?.SpotImages[2]?.url)
  const [imageUrl3, setImageUrl3] = useState(spot?.SpotImages[3]?.url)
  const [imageUrl4, setImageUrl4] = useState(spot?.SpotImages[4]?.url)
  const [noPreviewImgUrl, setNoPreviewImgUrl] = useState(false);
  const [imageFormat, setImageFormat] = useState(false);
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
      
      if(formType === 'Create a Spot'){
        if(!previewImgUrl){
          errors.previewImage = 'Preview image is required'
          setNoPreviewImgUrl(true)
        }
        if(previewImgUrl && (!(previewImgUrl.endsWith('.png')||previewImgUrl.endsWith('.jpg')||previewImgUrl.endsWith('.jpeg')))){
          errors.url1 = 'Image must end with .png, .jpg, .jpeg'
          setImageFormat(true)
        }
        if(imageUrl1 && (!(imageUrl1.endsWith('.png')||imageUrl1.endsWith('.jpg')||imageUrl1.endsWith('.jpeg')))){
          errors.url2 = 'Image must end with .png, .jpg, .jpeg'
          setImageFormat(true)
        }
        if(imageUrl2 && (!(imageUrl2.endsWith('.png')||imageUrl2.endsWith('.jpg')||imageUrl2.endsWith('.jpeg')))){
          errors.url3 = 'Image must end with .png, .jpg, .jpeg'
          setImageFormat(true)
        }
        if(imageUrl3 && (!(imageUrl3.endsWith('.png')||imageUrl3.endsWith('.jpg')||imageUrl3.endsWith('.jpeg')))){
          errors.url4 = 'Image must end with .png, .jpg, .jpeg'
          setImageFormat(true)
        }
        if(imageUrl4 && (!(imageUrl4.endsWith('.png')||imageUrl4.endsWith('.jpg')||imageUrl4.endsWith('.jpeg')))){
          errors.url5 = 'Image must end with .png, .jpg, .jpeg'
          setImageFormat(true)
        }
        if (Object.values(errors).length > 0) {
          return
        }else{
        const newSpot = await dispatch(createSpot(spot));
        spot = newSpot;
        if(spot.errors){
          errors.spot = spot.errors
        }
        if (Object.values(errors).length > 0) {
          setErrors(errors);
        }
        if(!spot.id){
        return null
      }
      const newPreview = await dispatch(postImage(spot.id, previewImgUrl, true))
      if(imageUrl1)  await dispatch(postImage(spot.id, imageUrl1, false))
      if(imageUrl2) await dispatch(postImage(spot.id, imageUrl2, false))
      if(imageUrl3) await dispatch(postImage(spot.id, imageUrl3, false))
      if(imageUrl4) await dispatch(postImage(spot.id, imageUrl4, false))
        history.push(`/spots/${spot.id}`);
    }
    }else if(formType === 'Update your Spot'){
      const updatedSpot = await dispatch(updateSpot(spot));
      history.push(`/spots/${spot.id}`);
    }
      
    };

  
    let submitText
    if(formType === 'Create a Spot'){
      submitText = 'Create Spot'
    }else{
      submitText = 'Update Spot'
    }
  
  return (
    <form onSubmit={handleSubmit} className='spot-form'>
      <h2>{formType}</h2>
      <p>Where's your place located?</p>
      <p>Guests will only know your exact address once they booked a reservation</p>
        <label className='other-inputs'>
            Country
            <input
            type="text"
            placeholder='Country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            />
        </label>
        {errors.spot && <p className='errors'>{errors.spot.country}</p>}
        <label className='other-inputs'>
            Street address
            <input
            type='text'
            placeholder='Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            />
        </label>
        {errors.spot && <p className='errors'>{errors.address}</p>}
        <label className='city-state'>
          <div className='city'>
            City
            <input
            type='text'
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            />     
        {errors.spot && <p className='errors'>{errors.spot.city}</p>}
            </div>
            <p>,</p>
            <div className='state'>
            State
            <input
            type='text'
            placeholder='STATE'
            value={state}
            onChange={(e) => setState(e.target.value)}
            />
            </div>
        </label>
        {errors.spot && <p className='errors'>{errors.spot.state}</p>}
        <label className='lat-lng'>
          <div>

            Latitude 
            <input
            type='number'
            placeholder='Latitude'
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            />
        
        {errors.spot && <p className='errors'>{errors.spot.lat}</p>}
            </div>
            <p>,</p>
            <div>
            Longitude 
            <input
            type='number'
            placeholder='Longitude'
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            />
            </div>
        </label>
        {errors.spot && <p className='errors'>{errors.spot.lng}</p>}
        <label className='description'>
            <h3>Describe your place to guests</h3>
            <p>Mention the best features of your space, any special amendities like fast wifi or parking, and what you love about the neighborhood</p>
            <textarea
            placeholder='Please write atleast 30 characters'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </label>
        {errors.spot && <p className='errors'>{errors.spot.description}</p>}
        <label className='other-inputs'>
            <h3>Create a title for your spot</h3>
            <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
            <input
            type='text'
            placeholder='Name of your spot'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </label>
        {errors.spot && <p className='errors'>{errors.spot.name}</p>}
        <label className='price'>
            <h3>Set a price based on a spot</h3>
            <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            <div>
            $<input
            type='number'
            placeholder='Price per night (USD)'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />
            </div>
        </label>
        {errors.spot && <p className='errors'>{errors.spot.price}</p>}
        {formType==='Create a Spot' &&
        <label className='create-imgs'>
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot</p>
            <input
            value={previewImgUrl}
            type='text'
            placeholder='Preview Image URL'
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            />
            {noPreviewImgUrl && <p className='errors'>Preview image is required</p>}
            {imageFormat && <p className='errors'>Image must end in .png, .jpg, or .jpeg</p>}
            {errors.url && <p className='errors'>{errors.url}</p>}
            <input
            value={imageUrl1}
            type='text'
            placeholder='Image URL'
            onChange={(e) => setImageUrl1(e.target.value)}
            />
            {errors.url && <p className='errors'>{errors.url}</p>}
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
        }
        <div className='submit-area'>
        <button type='submit' className='submit-button'>{submitText}</button>
        </div>

    </form>
  )
}

export default SpotForm
