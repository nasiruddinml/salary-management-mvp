import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, UploadProps } from "antd";
import React, { useState } from "react";

const UploadCSV = (): React.ReactElement => {
  const [fileList, setFileList] = useState<any[]>([]);

  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "/api/file-upload",
    beforeUpload: (file): boolean => {
      const { size, type: fileType } = file;
      const fileExt = file.name.slice(
        (Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1
      );

      if (size > 1024 * 1024 * 2) {
        return false;
      }

      if (fileExt !== "csv") {
        return false;
      }

      if (!["text/csv"].includes(fileType)) {
        message.error(`${file.name} file upload failed.`);
        return false;
      }

      return true;
    },
    onChange(info) {
      let newFileList = [...info.fileList];
      setFileList(newFileList);
      const { status, response } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        newFileList = newFileList.filter(
          (tFile) => tFile.fileName !== info.file.fileName
        );

        setTimeout(() => {
          setFileList(newFileList);
        }, 2000);
      } else if (status === "error") {
        message.error(`${info.file.name}: ${response}.`);
      }
    },
  };

  return (
    <Dragger {...props} fileList={fileList}>
      <p className="ant-`upload`-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. File size should not exceed max
        size of 2MB.
      </p>
    </Dragger>
  );
};

export default UploadCSV;
