import axios from "axios";

const API_URL = "https://vcarbon-e228b1daa9a1.herokuapp.com/";

export async function TreeType() {
  const response = await axios.get(API_URL + "treeType");
  return response.data;
}

export async function CalculateBiomass(type, dbh, number, areaNumber, wbd) {
  const response = await axios.post(
    API_URL +
      "calCacbon?type=" +
      type +
      "&treecount=" +
      number +
      "&area=" +
      areaNumber +
      "&dbh=" +
      dbh + 
      "&wbd=" + 
      wbd
  );
  return response.data;
}