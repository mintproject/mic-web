import { CommandLineObject } from "../models/cwl/cwl";

export const uploadFile = async (spec: CommandLineObject) => {
  const username = "upload";
  const password = "HVmyqAPWDNuk5SmkLOK2";
  fetch("https://publisher.mint.isi.edu", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${username}:${password}`),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spec), // This is your file object
  });
};
