import axios, { AxiosResponse } from "axios";
// import chromajsLib from "chrome"
import axiosClient from "../axios";
import { User } from "../types";
import { getAccessToken } from "../auth";
import { ImageFile } from "@/app/create/launchPad/page";

export type CreateCollectionType = {
  name: string;
  description: string;
  ticker: string;
  supply: number;
  price: number;
  walletLimit: number;
  POStartDate: number; // Unix timestamp
  logo: ImageFile;
};

export async function loginHandler({ walletData }: { walletData: string }) {
  console.log("🚀 ~ loginHandler ~ walletData:", walletData);
  // try {
  return axiosClient
    .post(`/api/v1/users/login`, JSON.stringify({ walletAddress: walletData }))
    .then((response) => {
      // if(respo)
      return response.data.data;
    });
  // } catch (error) {
  //   throw new Error(error);
  // }
}
export async function profileUpdateHandler({ userData }: { userData: User }) {
  try {
    return axiosClient
      .put(`/api/users/profile/edit`, JSON.stringify(userData))
      .then((response) => {
        return response.data.data;
      });
  } catch (error) {
    console.log("Error:", error);
  }
}

// export const createCollectionFormData = (data: UserBoostRequestData) => {
//   const formData = new FormData();

//   Object.keys(data).forEach((key) => {
//     formData.append(key, data[key as keyof UserBoostRequestData]);
//   });

//   return formData;
// };

// export async function createCollectibleHandler({
//   collectionData,
// }: {
//   collectionData: CreateCollectionType;
// }) {
//   return axiosClient
//     .post(`/api/v1/collections`, JSON.stringify({ collectionData }))
//     .then((response) => {
//       // if(respo)
//       if (response.data.success) {
//         return response?.data;
//       } else {
//         throw new Error(response.data.error);
//       }
//     });
// }

export interface CreateCollectibleType {
  file: File; // File object representing the image file
  meta: {
    name: string; // Name of the collectible
    // Add any other metadata fields related to the collectible
  };
  collectionId: string;
}

export interface TestCollection {
  name: string; // Name of the collectible
  // Add any other metadata fields related to the collectible
  collectionId: string;
}
const axiosTest = axios.create({
  baseURL: "http://localhost:3001",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export async function createCollectionHandler({
  collectionData,
}: {
  collectionData: CreateCollectionType;
}): Promise<any> {
  console.log("🚀 ~ collectionData:", collectionData);

  try {
    const formData = new FormData();

    // Check if the logo property is an object with a 'file' property
    if (collectionData.logo && collectionData.logo.file) {
      const fileBlob = new Blob([collectionData.logo.file], {
        type: collectionData.logo.file.type,
      });
      console.log("🚀 ~ fileBlob:", fileBlob);

      // Append the Blob to the FormData
      formData.append("logo", fileBlob, collectionData.logo.file.name);
    }

    // Append other data fields
    formData.append("name", collectionData.name);
    formData.append("description", collectionData.description);
    formData.append("ticker", collectionData.ticker);
    formData.append("supply", collectionData.supply.toString());
    formData.append("price", collectionData.price.toString());
    formData.append("walletLimit", collectionData.walletLimit.toString());
    formData.append("POStartDate", collectionData.POStartDate.toString());

    console.log("🚀 ~ formData:", formData);

    const token = getAccessToken();
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/v1/collections",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
      data: formData,
    };

    const response: AxiosResponse<any> = await axiosTest.request(config);
    console.log("🚀 ~ response:", response);

    // Check if the response has a 'data' property
    if (response.data) {
      return response.data;
    } else {
      // If the response doesn't have a 'data' property, return the entire response
      return response;
    }
  } catch (error) {
    console.error("Error creating collection:", error);

    // Check if the error is an instance of AxiosError
    if (error instanceof AxiosError) {
      // Handle the error response
      const { response } = error;
      if (response) {
        const { data, status, statusText } = response;
        console.log(`Error: ${status} ${statusText}`);
        console.log("Response data:", data);
      } else {
        console.log("Error:", error.message);
      }
    } else {
      // Handle other types of errors
      console.log("Error:", error);
    }

    throw error;
  }
}

export async function createCollectibleHandler({
  collectionData,
  collectionId,
  // testData2,
}: {
  collectionData: CreateCollectibleType[];
  collectionId: string;
  // testData2: TestCollection[];
}): Promise<any> {
  try {
    const formData = new FormData();

    // Loop through the collectionData array
    for (let i = 0; i < collectionData.length; i++) {
      const data = collectionData[i];
      console.log("🚀 ~ data.file:", data.file);

      // Convert the File object to a Blob
      const fileBlob = new Blob([data.file], { type: data.file.type });
      console.log("🚀 ~ fileBlob:", fileBlob);

      // Append the Blob to the FormData
      formData.append("images", fileBlob, data.file.name);
    }

    const data = collectionData.map((collectible) => {
      return {
        name: collectible.meta.name,
        collectionId: collectionId,
      };
    });

    // Append JSON data to the form data
    formData.append("data", JSON.stringify(data));

    const token = getAccessToken();
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/v1/collectibles",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
        // ...formData.,
      },
      data: formData,
    };
    console.log("🚀 ~ config:", config);

    const response: AxiosResponse<any> = await axiosTest.request(config);
    console.log("🚀 ~ response:", response);

    // Check if the response has a 'data' property
    if (response.data) {
      return response.data;
    } else {
      // If the response doesn't have a 'data' property, return the entire response
      return response;
    }
  } catch (error) {
    console.error("Error creating collectible:", error);
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    console.log(errorObject);
    throw error;
  }
}

export async function generateHex(collectionId: string) {
  // console.log("🚀 ~ loginHandler ~ walletData:", walletData);
  // try {
  return axiosClient
    .post(
      `/api/v1/purchase/${collectionId}/generate`,
      // JSON.stringify({ walletAddress: walletData }),
    )
    .then((response) => {
      // if(respo)
      return response.data;
    });
  // } catch (error) {
  //   throw new Error(error);
  // }
}
export async function createPurchase({
  buyerId,
  collectibleId,
  transactionId,
}: {
  collectibleId: string;
  transactionId: string;
  buyerId: string;
}) {
  // try {
  return axiosClient
    .post(
      `/api/v1/purchase`,
      JSON.stringify({ buyerId, collectibleId, transactionId }),
    )
    .then((response) => {
      if (response.data.success) {
        return response.data.data;
      } else {
        return response.data;
      }
    });
  // } catch (error) {
  //   throw new Error(error);
  // }
}
