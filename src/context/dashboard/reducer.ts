import { DashboardStats } from '../../types';

export interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export const initialState: DashboardState = {
  stats:        null,
  isLoading:    false,
  isError:      false,
  errorMessage: '',
};

export type DashboardActions =
  | { type: 'FETCH_DASHBOARD_REQUEST' }
  | { type: 'FETCH_DASHBOARD_SUCCESS'; payload: DashboardStats }
  | { type: 'FETCH_DASHBOARD_FAILURE'; payload: string };

export const reducer = (state: DashboardState, action: DashboardActions): DashboardState => {
  switch (action.type) {
    case 'FETCH_DASHBOARD_REQUEST':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_DASHBOARD_SUCCESS':
      return { ...state, isLoading: false, stats: action.payload };
    case 'FETCH_DASHBOARD_FAILURE':
      return { ...state, isLoading: false, isError: true, errorMessage: action.payload };
    default:
      return state;
  }
};
