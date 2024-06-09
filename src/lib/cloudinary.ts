import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "djdafssz0",
  secure: true,
  api_secret: "9v1iLyf9L0wFK1h0fcbRVd5tM7E",
  api_key: "345192242583419",
});

export async function uploadPfp(img: File) {
  const stream = img.stream().getReader();
  const handle = img.name;
  const stuff = (await stream.read()).value;

  return await new Promise<UploadApiResponse | undefined>((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          upload_preset: "profilepics",
          format: "webp",
          public_id: handle,
        },
        (error, uploadResult) => {
          return resolve(uploadResult);
        }
      )
      .end(stuff);
  });

  // new Promise((resolve) => {
  //   cloudinary.uploader
  //     .upload_stream((error, uploadResult) => {
  //       return resolve(uploadResult);
  //     })
  //     .end(byte);
  // }).then((uploadResult) => {
  //   console.log(
  //     `Buffer upload_stream wth promise success - ${
  //       (uploadResult as UploadApiResponse).public_id
  //     }`
  //   );
  // });

  // return await cloudinary.uploader.upload(byte, {
  //   upload_preset: "pfps",
  // });
}
