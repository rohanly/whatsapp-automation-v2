import API from ".";

export const getMessagesList = async () => {
  const res = await API.get("/api/messages");
  return res.data;
};
