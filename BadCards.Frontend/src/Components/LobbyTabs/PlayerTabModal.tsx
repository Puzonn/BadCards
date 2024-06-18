import { Button, ButtonGroup, Modal } from "react-bootstrap";
import { Player } from "../../Types/Player";

export const PlayerTabModal = ({
  State,
  CloseModal,
  Player,
}: {
  State: boolean;
  CloseModal: () => void;
  Player: Player | undefined;
}) => {
  const PreCloseModal = (e: any) => {
    e.stopPropagation();
    CloseModal();
  };

  if (typeof Player === undefined) {
    return <></>;
  }

  return (
    <Modal
      className="text-white"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={State}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {Player?.Username}
        </Modal.Title>
      </Modal.Header>
      <ButtonGroup className="m-2">
        <Button variant="danger">Kick</Button>
        <Button>Give Ownership</Button>
      </ButtonGroup>
      <Modal.Footer>
        <Button onClick={PreCloseModal} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
