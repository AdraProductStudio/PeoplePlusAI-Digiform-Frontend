import React from 'react'

const CustomButton = ({
    className,
    buttonName,
    onClick,
    title,
}) => {


    return (
        <button title={title} className={className} onClick={onClick}>
            {buttonName}
        </button>
    )
}

export default CustomButton
