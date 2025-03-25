

function ModalBody(props) {
    return (
        <div className={`modal-body ${props.className || ''}`}>
            {props.children}
        </div>
    );
}

export default ModalBody