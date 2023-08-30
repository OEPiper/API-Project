import SpotForm from "./SpotForm"

const CreateSpotForm = () => {
    const spot = {
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        name: '',
        price: '',
        }
    return (
        <SpotForm spot={spot} formType='Create a Spot'/>
    )
}

export default CreateSpotForm