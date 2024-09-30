import axios from "axios";

export const QuerySearchAPI = async (query) => {
  const url = "https://pha-project-e88c79436d98.herokuapp.com/query";
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
  };
  const data = {
    query: query,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  //   const response = await axios.post(
  //     `https://project-pha-94b45fee5dec.herokuapp.com/query`,
  //     { query: query },
  //     {
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
};
