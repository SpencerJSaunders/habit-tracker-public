import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import { setDisplayDeleteHabitModal } from "@/src/redux/slices/modalSlice";
import { deleteHabit } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteHabitConfirmationModal = ({ habitId }) => {
  const dispatch = useDispatch();
  const modalStatus = useSelector(
    (state) => state.modals.displayDeleteHabitConfirmationModal
  );

  const closeModal = () => {
    dispatch(setDisplayDeleteHabitModal(false));
  };

  return (
    <Modal
      open={modalStatus}
      onClose={closeModal}
    >
      <Box sx={style}>
        <div className="modal-content-container">
          <span onClick={closeModal}>
            <CancelIcon
              className="modal-content-container__close-icon"
              variant=""
              fontSize="large"
            />
          </span>
          <p>Are you sure you want to delete the habit?</p>
          <Button
            onClick={() => {
              deleteHabit(habitId);
              dispatch(setDisplayDeleteHabitModal(false));
            }}
            variant="warning"
            size="large"
          >
            Yes
          </Button>
          <Button onClick={closeModal} variant="warning" size="large">
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteHabitConfirmationModal;
