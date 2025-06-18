import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const azulPrincipal = "#007BFF"; 

interface ModalGenericoProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode; 
  size?: 'sm' | 'lg' | 'xl'; 
  footerButtons?: {
    text: string;
    variant?: string; 
    style?: React.CSSProperties; 
    onClick: () => void;
    disabled?: boolean; 
  }[];
  azulEscuro: string; 
  fundoClaro: string; 
}

const ModalGenerico: React.FC<ModalGenericoProps> = ({
  show,
  onHide,
  title,
  children,
  size,
  footerButtons,
  azulEscuro,
  fundoClaro
}) => {
  return (
    <Modal show={show} onHide={onHide} size={size} centered>
      <Modal.Header closeButton style={{ backgroundColor: fundoClaro, color: azulEscuro, borderBottom: 'none' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: fundoClaro, color: azulEscuro }}>
        {children} 
      </Modal.Body>
      {footerButtons && footerButtons.length > 0 && (
        <Modal.Footer style={{ backgroundColor: fundoClaro, borderTop: 'none' }}>
          {footerButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant}
              onClick={button.onClick}
              style={button.style || { backgroundColor: azulEscuro, borderColor: azulPrincipal }}
              disabled={button.disabled}
            >
              {button.text}
            </Button>
          ))}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ModalGenerico;