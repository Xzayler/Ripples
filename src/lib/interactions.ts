import { getCurrentUser } from "./server";
import { addPost } from "./database";

export const submitPost = async (formData: FormData) => {
  const id = (await getCurrentUser()).id;
  const body = formData.get("body")?.toString();

  await addPost({
    content: body ?? "",
    author: id,
  });
};
