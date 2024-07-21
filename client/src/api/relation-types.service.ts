import API from ".";

export const getRelationTypeList = async () => {
  const res = await API.get("/api/relation_types");
  return res.data;
};
