
function Modal(props) {
    return (
        <div className="modal d-block ">
            <div className={`modal-dialog ${props.className || ''}`}>
                
                {props.children}
                
            </div>
        </div>
    );
}

export default Modal