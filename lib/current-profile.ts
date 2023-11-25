import axios from "axios";
import { auth } from "@clerk/nextjs";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const { data: profiles } = await axios.get(
      `${process.env.API_URL}api/v1/profiles?userId=${userId}`
    );
    return profiles.data[0];
  } catch (e) {
    console.log(e);
  }
};
