import API from ".";

export const getEventList = async () => {
  const res = await API.get("/api/events");
  return res.data;
};

export const getEventTypeList = async () => {
  const res = await API.get("/api/event_types");
  return res.data;
};

export const createEvent = async (data: any) => {
  const res = await API.post("/api/events", data);
  return res.data;
};

// TODO: make generate endpoint
export const generateMessageForEvent = async (eventId: string) => {
  const res = await API.get(`/api/events/${eventId}/generate`, {
    params: {
      populate: "*",
    },
  });
  return res.data;
};
