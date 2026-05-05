import React, { createContext, useContext, useReducer } from 'react';
import { reducer, initialState, DashboardState, DashboardActions } from './reducer';

const DashboardStateContext    = createContext<DashboardState | undefined>(undefined);
const DashboardDispatchContext = createContext<React.Dispatch<DashboardActions> | undefined>(undefined);

export const useDashboardState    = () => useContext(DashboardStateContext);
export const useDashboardDispatch = () => useContext(DashboardDispatchContext);

export const DashboardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DashboardStateContext.Provider value={state}>
      <DashboardDispatchContext.Provider value={dispatch}>
        {children}
      </DashboardDispatchContext.Provider>
    </DashboardStateContext.Provider>
  );
};
