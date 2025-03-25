import Modal from "../../components/modal/modal";
import ModalBody from "../../components/modal/ModalBody";
import ModalHeader from "../../components/modal/ModalHeader";
import ModalFooter from "../../components/modal/ModalFooter";
import Button from "../button/button";
import { ReactComponent as CloseX } from "../icons/close-x";
function TestModal(props) {
    return (
        <Modal>
          <ModalHeader>
            <h3>Filter Menu <CloseX /></h3>
          </ModalHeader>
          <ModalBody>
            <p>Body of modal #1</p>
          </ModalBody>
          <ModalFooter>
          <Button 
            type="solid"
            
            text="Apply"
            color="secondary"
            
            onClick={props.close}
            
          />
          </ModalFooter>
        </Modal>
      );
}

export default TestModal