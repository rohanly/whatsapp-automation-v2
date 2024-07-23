import API from ".";

export const createTemplate = async (data: any) => {
  const res = await API.post("/api/templates", data);
  return res.data;
};

export const getTemplateList = async () => {
  const res = await API.get("/api/templates");
  return res.data;
};

export const getTemplateById = async (id: string) => {
  const res = await API.get(`/api/templates/${id}`);
  return res.data;
};

export const editTemplate = async (id: string, data: any) => {
  const res = await API.patch(`/api/templates/${id}`, data);
  return res.data;
};

export const deleteTemplate = async (id: string) => {
  const res = await API.delete(`/api/templates/${id}`);
  return res.data;
};
