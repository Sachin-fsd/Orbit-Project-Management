import Pusher from "pusher-js";
import { createContext, useContext } from "react";

const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  forceTLS: true,
});

const PusherContext = createContext(pusher);

export const PusherProvider = ({ children }: React.PropsWithChildren<{}>) => (
  <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
);

export const usePusher = () => useContext(PusherContext);