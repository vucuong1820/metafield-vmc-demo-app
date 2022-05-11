import { useMutation } from "@apollo/client";
import axios from "axios";
import { STAGED_UPLOADS_CREATE, UPLOAD_FILES } from ".";

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
  console.log('resoure url:', resourceUrl)
  console.log('dataUploaded:', dataUploaded)

  const fileId = dataUploaded.data.fileCreate.files[0].id
  const time = dataUploaded.data.fileCreate.files[0].createdAt
  const fileTimeUpload = await queryFileByTime({
    variables: {
      query: `created_at:${time}`
    }
  })
  console.log('file time upload:',fileTimeUpload)
  const fileUpload = await queryFileUploaded({
      variables: {
          id: fileId
      }
  })
  console.log('file upload:',fileUpload)
  if(!fileUpload.loading) {
    return {
        fileUploadedId:  fileUpload.data.node.id,
        fileUploadedUrl: fileUpload.data.node.image?.url
      }
  }
  
}