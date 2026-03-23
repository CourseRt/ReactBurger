import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../services/store';

type TProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.ReactElement;
};

export const ProtectedRouteElement = ({ onlyUnAuth = false, component }: TProtectedProps) => {
  const { user, isAuthChecked } = useSelector((state: RootState) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (location.pathname === '/reset-password' && !location.state?.fromForgotPassword) {
    return <Navigate to="/forgot-password" replace />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: "/" } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return component;
};
