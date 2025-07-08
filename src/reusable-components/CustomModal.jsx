import React, { useContext } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const CustomModal = ({
    modalHeader,
    show,
    modalTitle,
    handleHideModal,
    modalBody,
    isModalCentered,
    modalBackdropType,
    className,
    modalFooter,
    onHide,
    size,
    centered,
    backdrop,

}) => {


    return (
        <div>
            <Modal
                show={show}
                size={size}
                onHide={onHide}
                centered={centered}
                backdrop={backdrop}
                className={className}
            >
                {(modalHeader || modalTitle) &&
                    <Modal.Header closeButton>
                        <Modal.Title>{modalHeader}</Modal.Title>
                    </Modal.Header>}
                <Modal.Body>
                    {modalBody}
                </Modal.Body>
                {modalFooter &&
                    <Modal.Footer className='d-block'>
                        {modalFooter}
                    </Modal.Footer>
                }

            </Modal>

        </div>
    )
}

export default CustomModal
