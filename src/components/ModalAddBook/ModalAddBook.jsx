import { Modal, Button } from 'react-bootstrap';

const ModalAddBook = ({ isOpen, onClose, children }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить книгу</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
};

export default ModalAddBook;
