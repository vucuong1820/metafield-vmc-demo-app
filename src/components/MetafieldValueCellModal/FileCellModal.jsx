import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Avatar,
  Button,
  Checkbox,
  DropZone,
  InlineError,
  Modal
} from "@shopify/polaris";
import { CircleUpMajor } from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  GET_FILES,
  GET_FILE_BY_ID,
  QUERY_FILE_TIME,
  STAGED_UPLOADS_CREATE,
  UPLOAD_FILES
} from "../../gql";
import { uploadFiles } from "../../gql/uploadFiles";
FileCellModal.propTypes = {};

function FileCellModal({ onSetValue, value, error }) {
  const [imgUrl, setImgUrl] = useState("");
  const [filesList, setfilesList] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checked, setChecked] = useState("");
  const [imgError, setImgError] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(() => {
    return !!value;
  });

  const [getListFiles] = useLazyQuery(GET_FILES);
  const [generateUrl] = useMutation(STAGED_UPLOADS_CREATE);
  const [uploadFile] = useMutation(UPLOAD_FILES);
  const [queryFileById] = useLazyQuery(GET_FILE_BY_ID);
  const [queryFileByTime] = useLazyQuery(QUERY_FILE_TIME);
  // console.log(typeof value)
  useEffect(() => {
    (async () => {
      // console.log('re-fetch')
      if (value) {
        const fileInfo = await queryFileById({
          variables: {
            id: value,
          },
        });
        if (!fileInfo.loading && !fileInfo.data.node?.image?.url) {
          setImgError(true);
        } else {
          setImgError(false);
          setImgUrl(fileInfo.data.node?.image?.url);
        }
      }
      setIsBtnLoading(false);
    })();

  }, [value]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { loading, data } = await getListFiles();
      if (!loading) {
        setIsLoading(false);
        setfilesList(
          data.files.edges.map((item) => ({
            id: item.node.id,
            url: item.node.image?.url,
          }))
        );
      }
    })();
  }, []);

  const handleDropZoneDrop = useCallback(
    async (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setIsLoading(true);
      const { fileUploadedId, fileUploadedUrl } = await uploadFiles(
        acceptedFiles,
        generateUrl,
        uploadFile,
        queryFileById,
        queryFileByTime
      );
      setfilesList((prev) => {
        prev.unshift({ id: fileUploadedId, url: fileUploadedUrl });
        return prev;
      });
      setIsLoading(false);
    },
    []
  );

  const fileUpload = <DropZone.FileUpload />;
  const activator = (
    <>
      <Button
        key={value}
        loading={isBtnLoading}
        fullWidth
        icon={
          imgUrl ? <Avatar customer source={imgUrl || ""} /> : CircleUpMajor
        }
        onClick={() => setOpen(true)}
        disclosure="select"
      >
        Select files
      </Button>
      {imgError && <InlineError message="File not found" />}
    </>
  );
  return (
    <>
      <Modal
        large
        primaryAction={{
          content: "Select",
          onAction: () => {
            setIsBtnLoading(true);
            onSetValue(checked);
            setOpen(false);
          },
        }}
        activator={activator}
        open={open}
        title="Select file"
        onClose={() => setOpen(false)}
        loading={isLoading}
      >
        <Modal.Section>
          <DropZone accept="image/*" onDrop={handleDropZoneDrop}>
            {fileUpload}
          </DropZone>
        </Modal.Section>
        <div className="files-section-wrapper">
          <Modal.Section className="file-section-modal">
            <div className="list-files-wrapper">
              {filesList.length > 0 &&
    filesList.map((item, index) => (
      <div className="item" key={index}>
        <div className="preview" onClick={() => setChecked(item.id)}>
          <div className="preview-box">
            <div className="image-container">
              <img src={item.url} alt={item.id} />
            </div>
            <div className="checkbox">
              <Checkbox checked={checked === item.id ? true : false} />
            </div>
          </div>
        </div>
      </div>
    ))}
            </div>
          </Modal.Section>
        </div>
      </Modal>
      <InlineError message={error || ""} />
    </>
  );
}

export default FileCellModal;
