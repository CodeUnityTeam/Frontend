import { useReducer } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegisterFormData {
  // Step 1 – Meet me
  name: string;
  surname: string;
  position: string;
  photo: File | null;
  // Step 1 additions
  remote?: boolean;
  country?: string;
  city?: string;
  // Step 2 – Your skills
  skills: string[];
  // Step 3 – Experience and projects
  experience: string;
  projects: string;
  // Step 4 – About you
  about: string;
}

export type Step = 1 | 2 | 3 | 4;

export const TOTAL_STEPS = 4;


// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

interface State {
  step: Step;
  data: RegisterFormData;
}

type Action =
  | { type: "next"; patch: Partial<RegisterFormData> }
  | { type: "back" }
  | { type: "patch"; patch: Partial<RegisterFormData> };

const initialData: RegisterFormData = {
  name: "",
  surname: "",
  position: "",
  photo: null,
  remote: false,
  country: "",
  city: "",
  skills: [],
  experience: "",
  projects: "",
  about: "",
};

const initialState: State = {
  step: 1,
  data: initialData,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "next":
      return {
        step: Math.min(state.step + 1, 4) as Step,
        data: { ...state.data, ...action.patch },
      };
    case "back":
      return {
        ...state,
        step: Math.max(state.step - 1, 1) as Step,
      };
    case "patch":
      return {
        ...state,
        data: { ...state.data, ...action.patch },
      };
  }
}

export function useRegisterForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const next = (patch: Partial<RegisterFormData>) =>
    dispatch({ type: "next", patch });
  const back = () => dispatch({ type: "back" });
  const patch = (data: Partial<RegisterFormData>) =>
    dispatch({ type: "patch", patch: data });

  return { state, next, back, patch };
}
