const Button = ({ type, color, height, width, children }) => {
  // Default colors if no props are provided
  const solidColor = color || '#A15B96'; // Default color for solid buttons
  const borderColor = color || '#0E2D72'; // Default color for border buttons
  
  // Styles for the button
  const buttonStyle = {
    height: height || '40px', // Default height
    width: width || '150px',  // Default width
    backgroundColor: type === 'solid' ? solidColor : 'transparent',
    border: type === 'border' ? `2px solid ${borderColor}` : 'none',
    color: type === 'solid' ? '#fff' : borderColor,  // Solid buttons have white text
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.3s ease', // Smooth transition for hover effect
    borderRadius: '40px',
    fontFamily: 'Montserrat',
  };

  // Hover effect for the button
  const hoverStyle = {
    ...buttonStyle,
    backgroundColor: type === 'solid' ? '#A15B96' : 'transparent',
    color: type === 'border' ? '#A15B96' : '#fff',
    border: type === 'border' ? '2px solid #A15B96' : 'none',
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => (buttonStyle.backgroundColor = hoverStyle.backgroundColor)}
      onMouseLeave={() => (buttonStyle.backgroundColor = buttonStyle.backgroundColor)}
    >
      {children}
    </button>
  );
};

export default Button;
