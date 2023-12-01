import axios from "axios";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

export const initialProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const { data } = await axios.get(
      `${process.env.API_URL}api/v1/profiles?userId=${user.id}`
    );

    if (data.data[0]) {
      return data.data[0];
    } else {
      const userData = {
        userId: user.id,
        name: `${
          user.firstName
            ? `${user.firstName} ${user.lastName ? user.lastName : ""}`
            : "User"
        }`,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      };

      const { data } = await axios.post(
        `${process.env.API_URL}api/v1/profiles`,
        userData
      );

      return data.data.data;
    }
  } catch (e) {
    console.log(e);
  }
};
