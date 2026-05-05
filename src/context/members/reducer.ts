interface Member {
  id: number;
  name: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  password: any;
}
// Now, I'll rename the interface in the `ProjectList` component from `State`
// to `ProjectsState`. And I'll also export the interface.

export interface MembersState {
  members: Member[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export const initialState: MembersState = {
  members: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};
// Next, I'll comment the `Action` interface

// interface Action {
//   type: string;
//   payload?: any;
// }

// Then I'll define a new type called `ProjectsActions`
// for all possible combimations of action objects.

export type MembersActions =
  | { type: "FETCH_MEMBERS_REQUEST" }
  | { type: "FETCH_MEMBERS_SUCCESS"; payload: Member[] }
  | { type: "FETCH_MEMBERS_FAILURE"; payload: string }
  | { type: "ADD_MEMBERS_SUCCESS"; payload: Member }
  | { type: "REMOVE_MEMBERS_SUCCESS"; payload: number };

// Next, I'll update reducer function accordingly with newly defined types

// export const reducer = (state: State, action: Action): State => {

export const reducer = (
  state: MembersState = initialState,
  action: MembersActions,
): MembersState => {
  switch (action.type) {
    case "FETCH_MEMBERS_REQUEST":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_MEMBERS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        members: action.payload,
      };
    case "FETCH_MEMBERS_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };
    case "ADD_MEMBERS_SUCCESS":
      return { ...state, members: [...state.members, action.payload] };
    case "REMOVE_MEMBERS_SUCCESS":
      return {
        ...state,
        members: state.members.filter((member) => member.id !== action.payload),
      };
    default:
      return state;
  }
};
