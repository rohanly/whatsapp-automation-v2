import API from ".";

export const getEventList = async ({
  pageIndex = 1,
  pageSize = 10,
  startDate,
  endDate,
}: {
  pageIndex?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await API.get("/api/events", {
    params: {
      pageIndex,
      pageSize,
      startDate,
      endDate,
    },
  });
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

export const generateMessageForEvent = async (eventId: string) => {
  const res = await API.post(`/api/events/${eventId}/generate_message`, {});
  return res.data;
};
