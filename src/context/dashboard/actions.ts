import { API_ENDPOINT } from '../../config/constants';
import { DashboardActions } from './reducer';

type Dispatch = React.Dispatch<DashboardActions>;

export const fetchDashboard = async (
  dispatch: Dispatch,
  filters: { projectId?: string; userId?: string } = {},
) => {
  const token = localStorage.getItem('authToken') ?? '';
  try {
    dispatch({ type: 'FETCH_DASHBOARD_REQUEST' });

    const params = new URLSearchParams();
    if (filters.projectId) params.set('projectId', filters.projectId);
    if (filters.userId)    params.set('userId',    filters.userId);

    const res = await fetch(`${API_ENDPOINT}/dashboard?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch dashboard data');

    const data = await res.json();
    dispatch({ type: 'FETCH_DASHBOARD_SUCCESS', payload: data });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    dispatch({ type: 'FETCH_DASHBOARD_FAILURE', payload: 'Unable to load dashboard.' });
  }
};
