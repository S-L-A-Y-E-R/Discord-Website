import axios from "axios";

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await axios.get(
      `${process.env.API_URL}api/v1/conversations/${memberOneId}/${memberTwoId}`
    );
  } catch (e) {
    console.log(e);
    return null;
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await axios.post(`${process.env.API_URL}api/v1/conversations`, {
      memberOneId,
      memberTwoId,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation?.data.data.data) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }

  return conversation?.data.data.data;
};
