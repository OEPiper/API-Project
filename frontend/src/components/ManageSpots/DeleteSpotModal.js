import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";



const DeleteSpotModal = ({spot}) =>{
    const dispatch = useDispatch()
    const history = useHistory()
    const {closeModal} = useModal()
    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteSpot(spot.id));
        closeModal();
        window.location.reload()
    }
    
    return(
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={handleDelete}>Yes (Delete Spot)</button>
            <button onClick={(e) => closeModal()}>No (Keep Spot)</button>
        </>
    )
}

export default DeleteSpotModal