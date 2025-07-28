import { useState } from "react";
import ToastMsg from "@/components/shared/ToastMsg";
import { IMAGE_UPLOAD_PRESET, IMAGE_UPLOAD_URL } from "@env";

const useImageUploader = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>("");
  const [failed, setFailed] = useState<boolean>(false);

  const getFileExtension = (filename: string) => {
    if (filename)
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const uploadImage = async (base64String: string, filePath: string) => {
    if (base64String && filePath) {
      setLoading(true);

      try {
        let base64Img = `data:${
          getFileExtension(filePath) === "mp4" ? "video/mp4" : "image/jpg"
        };base64,${base64String}`;

        const fd = new FormData();
        fd.append("file", base64Img);
        fd.append("upload_preset", IMAGE_UPLOAD_PRESET);

        // Fetch
        const response = await fetch(IMAGE_UPLOAD_URL, {
          method: "POST",
          body: fd,
        });
        const result = await response.json();

        if (result?.secure_url) {
          const url = result.secure_url;
          setUploadedImgUrl(url);
          setFailed(false);
          ToastMsg("Image uploaded successfully", "Image Upload", "success");
        } else setFailed(true);
      } catch (error) {
        console.log(error);
        setFailed(true);
        ToastMsg("Failed to upload image", "Image Upload");
      } finally {
        setLoading(false);
      }
    } else {
      setFailed(true);
      ToastMsg("File or/and identifier not found!", "Image Upload", "warning");
    }
  };

  return { loading, failed, uploadedImgUrl, uploadImage };
};

export default useImageUploader;
