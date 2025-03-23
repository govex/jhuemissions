import Modal from "../../components/modal/modal";
import ModalBody from "../../components/modal/ModalBody";
import ModalHeader from "../../components/modal/ModalHeader";
import ModalFooter from "../../components/modal/ModalFooter";

function TestModal(props) {
    return (
        <Modal>
          <ModalHeader>
            <h3>Test Modal #1</h3>
          </ModalHeader>
          <ModalBody>
            <p>Body of modal #1</p>
          </ModalBody>
          <ModalFooter>
            <button onClick={ props.close } className="btn btn-primary">Close Modal</button>
          </ModalFooter>
        </Modal>
      );
}

export default TestModal