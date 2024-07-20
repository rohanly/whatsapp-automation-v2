import API from ".";

export const getPeopleList = async (populate: string = "*") => {
  const res = await API.get("/api/people", {
    params: {
      populate,
    },
  });
  return res.data;
};
