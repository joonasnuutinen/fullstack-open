import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
//import /*AddPatientForm, */{ PatientFormValues } from './AddPatientForm';
//import { EntryFormValues } from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  /*onSubmit: (values: EntryFormValues | PatientFormValues) => void;*/
  error?: string;
  entityName: string;
}

const AddEntityModal: React.FC<Props> = ({ modalOpen, onClose, /*onSubmit, */error, entityName, children }) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new {entityName}</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      {children}
      {/**<AddPatientForm onSubmit={onSubmit} onCancel={onClose} />**/}
    </Modal.Content>
  </Modal>
);

export default AddEntityModal;
