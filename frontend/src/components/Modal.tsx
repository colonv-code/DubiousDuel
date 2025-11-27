import "./Modal.css";

export interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

export function Modal({ children, visible, onClose }: ModalProps) {
  if (!visible) return null;
  return (
    <>
      <div className="modalBackdrop" onClick={onClose} />
      <div className="modal">{children}</div>
    </>
  );
}
