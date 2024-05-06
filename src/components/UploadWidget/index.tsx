import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface IUploadWidgetProps {
  thumbnailUploaded: string;
  setThumbnailUploaded: (image: string) => void;
}

const UploadWidget: React.FC<IUploadWidgetProps> = (props) => {
  const cloudinaryRef = useRef() as any;
  const widgetRef = useRef() as any;

  useEffect(() => {
    cloudinaryRef.current = (window as any).cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "dfnuzzpe3",
        uploadPreset: "ml_default",
      },
      function (error: any, result: any) {
        console.log("result", result);
        if (result.event == "success") {
          props.setThumbnailUploaded(result?.info?.secure_url);
          toast.success("Đăng thumbnail thành công");
        } else {
          //   toast.error("Đăng thumbnail thất bại");
        }
      }
    );
  }, []);

  console.log("wdiget refg", widgetRef);

  return (
    <button
      className="px-4 py-2 text-sm text-gray-600 bg-gray-200 border-gray-300 rounded-lg mt-4 flex flex-wrap"
      onClick={() => widgetRef.current?.open()}
    >
      {!!props.thumbnailUploaded ? props.thumbnailUploaded : "Đăng thumbnail"}
    </button>
  );
};

export default UploadWidget;
