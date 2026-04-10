import { Middleware, MiddlewareAPI } from 'redux';
import { TWSActionTypes } from '../types/ws'; 
import { AppDispatch, RootState } from '../../services/store';

export const socketMiddleware = (wsActions: TWSActionTypes): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const {
        wsConnect,
        wsDisconnect,
        wsConnecting,
        onOpen,
        onClose,
        onError,
        onMessage,
      } = wsActions;

      if (wsConnect.match(action)) {
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
          return next(action);
        }

        socket = new WebSocket(action.payload);
        dispatch(wsConnecting());

        socket.onopen = () => {
          dispatch(onOpen());
        };

        socket.onerror = () => {
          dispatch(onError('WebSocket error'));
        };

        socket.onmessage = (event) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.message === 'Invalid or missing token') {
              dispatch(onError('Token error'));
            } else {
              dispatch(onMessage(parsedData));
            }
          } catch (error) {
            dispatch(onError('Data parse error'));
          }
        };

        socket.onclose = () => {
          dispatch(onClose());
        };
      }

      if (socket && wsDisconnect.match(action)) {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close(1000, 'Socket closed by user');
        }
        socket = null;
      }

      return next(action);
    };
  };
};
