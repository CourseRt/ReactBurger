import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { socketMiddleware } from './middleware/socket-middleware';

import { 
  wsConnect as feedConnect, 
  wsDisconnect as feedDisconnect, 
  wsConnecting as feedConnecting, 
  onOpen as feedOpen, 
  onClose as feedClose, 
  onError as feedError, 
  onMessage as feedMessage 
} from './feedSlice';

import { 
  wsConnect as profileConnect, 
  wsDisconnect as profileDisconnect, 
  wsConnecting as profileConnecting, 
  onOpen as profileOpen, 
  onClose as profileClose, 
  onError as profileError, 
  onMessage as profileMessage 
} from './profileOrdersSlice';

const feedActions = {
  wsConnect: feedConnect,
  wsDisconnect: feedDisconnect,
  wsConnecting: feedConnecting,
  onOpen: feedOpen,
  onClose: feedClose,
  onError: feedError,
  onMessage: feedMessage,
};

const profileOrdersActions = {
  wsConnect: profileConnect,
  wsDisconnect: profileDisconnect,
  wsConnecting: profileConnecting,
  onOpen: profileOpen,
  onClose: profileClose,
  onError: profileError,
  onMessage: profileMessage,
};

const feedMiddleware = socketMiddleware(feedActions);
const profileOrdersMiddleware = socketMiddleware(profileOrdersActions);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;