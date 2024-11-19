// src/EventBus.js
import mitt from "mitt";

type Events = {
  notify: { text: string; duration?: number };
};

const EventBus = mitt<Events>();

export default EventBus;
