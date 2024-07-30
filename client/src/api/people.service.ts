import API from ".";

export const getPeopleList = async (params?: {
  pageIndex?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await API.get("/api/people", {
    params,
  });
  return res.data;
};

export const createPeople = async (data: any) => {
  const res = await API.post("/api/people", data);
  return res.data;
};

export const getPersonById = async (id: string) => {
  const res = await API.get(`/api/people/${id}`);
  return res.data;
};

export const editPersonById = async (id: string, data: any) => {
  const res = await API.patch(`/api/people/${id}`, data);
  return res.data;
};

export const deletePeople = async (id: string) => {
  const res = await API.delete(`/api/people/${id}`);
  return res.data;
};

export const createPeopleRelation = async (data: any) => {
  const res = await API.post("/api/people_relations", data);
  return res.data;
};

export const deletePeopleRelation = async (personId: string) => {
  const res = await API.delete("/api/people_relations/person/" + personId);
  return res.data;
};

export const getMessagesByPerson = async (id: string) => {
  const res = await API.get(`/api/people/${id}/messages`);
  return res.data;
};
