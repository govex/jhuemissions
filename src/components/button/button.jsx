const Button = ({ type, color, height, width, children }) => {

    const solidColor = color || '#A15B96';
    const borderColor = color || '#0E2D72';


    const buttonStyle = {
        height: height || '40px',
        width: width || '150px',
        backgroundColor: type === 'solid' ? solidColor : 'transparent',
        border: type === 'border' ? `2px solid ${borderColor}` : 'none',
        color: type === 'solid' ? '#fff' : borderColor,
        padding: '10px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'all 0.3s ease',
        borderRadius: '40px',
        fontFamily: 'Montserrat',
    };


    const hoverStyle = {
        ...buttonStyle,
        backgroundColor: type === 'solid' ? '#A15B96' : 'transparent',
        color: type === 'border' ? '#A15B96' : '#fff',
        border: type === 'border' ? '2px solid #A15B96' : 'none',
    };

    return (
        <button
            style={buttonStyle}

        >
            {children}
        </button>
    );
};

export default Button;
