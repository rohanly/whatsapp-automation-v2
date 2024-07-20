import API from ".";

export const getTemplateList = async (populate: string = "*") => {
  const res = await API.get("/api/templates", {
    params: {
      populate,
    },
  });
  return res.data;
};
