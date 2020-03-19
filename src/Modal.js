import React from "react";
import "./Modal.css";

function Modal({ isDisplayed, header, body, onClose }) {
  return (
    <div className="Modal" style={{ display: isDisplayed }}>
      <input
        className="close-modal"
        type="submit"
        value="X"
        onClick={onClose}
      />
      <h6>{header}</h6>
      {body}
    </div>
  );
}

export default Modal;
