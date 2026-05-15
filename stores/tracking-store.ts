import { create } from "zustand";

export type EventType =
  | "pageview"
  | "whatsapp_click"
  | "checkout_init"
  | "purchase"
  | "lead";

export interface TrackingEvent {
  id: string;
  type: EventType;
  source: string;
  campaign?: string;
  value?: number;
  timestamp: number;
}

interface TrackingState {
  events: TrackingEvent[];
  addEvent: (event: Omit<TrackingEvent, "id" | "timestamp">) => void;
}

let counter = 0;

export const useTrackingStore = create<TrackingState>((set) => ({
  events: [],
  addEvent: (event) =>
    set((state) => ({
      events: [
        { ...event, id: `evt_${++counter}`, timestamp: Date.now() },
        ...state.events,
      ].slice(0, 50),
    })),
}));
