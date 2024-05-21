import React from 'react';
import PropTypes from 'prop-types';

/**
 * ActionButton component for reusable buttons.
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Function to handle button click
 * @param {string} props.children - The button text
 * @param {Object} [props.style] - Additional styles for the button
 * @returns {JSX.Element}
 */
function ActionButton({ onClick, children, style }) {
  return (
    <button onClick={onClick} style={{ fontSize: '10px', padding: '10px 20px', width: '100px', ...style }}>
      {children}
    </button>
  );
}

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

ActionButton.defaultProps = {
  style: {}
};

export default ActionButton;
