import { useMutation } from "@apollo/client";
import axios from "axios";
import { STAGED_UPLOADS_CREATE, UPLOAD_FILES } from ".";
import { delay } from "../util"
export const uploadFiles = async (files,generateUrl,uploadFile,queryFileUploaded,queryFileByTime) => {

  const {name, type, size} = files[0]
  const dataStaged = await generateUrl({
    variables: {
      input: {
        resource: "FILE",
        filename: name,
        mimeType: type,
        fileSize: size.toString(),
        httpMethod: "POST",
      },
    },
  });

  const target = dataStaged.data.stagedUploadsCreate.stagedTargets[0];
  const params = target.parameters;
  const url = target.url;
  const resourceUrl = target.resourceUrl;

  const form = new FormData()
  params.forEach(({ name, value }) => {
    form.append(name, value);
  });

  form.append("file", files[0]);

  await axios.post(url, form, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
    
  const dataUploaded = await uploadFile({
    variables: {
      files: {
        alt: "something alt",
        contentType: "IMAGE",
        originalSource: resourceUrl
      }
    }
  })

  const fileId = dataUploaded.data.fileCreate.files[0].id

  // wait 1.5s for processing uploading file (otherwise, cdn img is null)
  await delay(1500)
  const fileUpload = await queryFileUploaded({
      variables: {
          id: fileId
      }
  })
  if(!fileUpload.loading) {
    return {
        fileUploadedId:  fileUpload.data.node.id,
        fileUploadedUrl: fileUpload.data.node.image?.url
      }
  }
  
}