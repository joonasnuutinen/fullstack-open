import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSES";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      payload: { patientId: string; entry: Entry };
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_DIAGNOSES":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "ADD_ENTRY":
      const id = action.payload.patientId;
      return {
        ...state,
        patients: {
          ...state.patients,
          [id]: {
            ...state.patients[id],
            entries: [...state.patients[id].entries, action.payload.entry]
          }
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (patientList: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patientList };
};

export const addPatient = (patient: Patient): Action => {
  return { type: "ADD_PATIENT", payload: patient };
};

export const updatePatient = (patient: Patient): Action => {
  return { type: "UPDATE_PATIENT", payload: patient };
};

export const setDiagnoses = (diagnoses: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSES", payload: diagnoses };
};

export const addEntry = (patientId: string, entry: Entry): Action => {
  return { type: "ADD_ENTRY", payload: { patientId, entry } };
};
