import Modal from "../../components/modal/modal";
import ModalBody from "../../components/modal/ModalBody";
import ModalHeader from "../../components/modal/ModalHeader";
import ModalFooter from "../../components/modal/ModalFooter";
import Button from "../button/button";
import { ReactComponent as CloseX } from "../icons/close-x";
import { ReactComponent as ChevronDown } from '../icons/chevron-down';
import "./TestModal.css"
import styles from './ModalRoot.module.css';

function TestModal(props) {

    return (
        <Modal className={styles.modalContainer}>
          <ModalHeader>
            <div className="header">

              <h3> Filter Menu </h3>
              <CloseX />
            </div>
          </ModalHeader>
          <ModalBody className={styles.modalBody} >
            <div className=" content department">
                Department <ChevronDown />
                
            </div>
            <div className=" content year ">
                Year
                <ChevronDown  />
                

            </div>
            <div className="content empty">

            </div>
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