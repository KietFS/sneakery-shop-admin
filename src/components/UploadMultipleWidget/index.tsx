import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface IUploadMultipleWidgetProps {
  thumbnailUploaded: string[];
  setThumbnailUploaded: (image: string[]) => void;
}

const UploadMultipleWidget: React.FC<IUploadMultipleWidgetProps> = (props) => {
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
        console.log("result multiple widget", result);
        if (result.event == "success") {
          let cloned = props.thumbnailUploaded;
          cloned = [
            ...props.thumbnailUploaded,
            result?.info?.secure_url as string,
          ];
          props.setThumbnailUploaded(cloned);
        //   toast.success("Đăng các ảnh khác thành công");
        } else {
          //   toast.error("Đăng thumbnail thất bại");
        }
      }
    );
  }, []);

  return (
    <button
      className="px-4 py-2 text-sm text-gray-600 bg-gray-200 border-gray-300 rounded-lg mt-2"
      onClick={() => widgetRef.current?.open()}
    >
      {props.thumbnailUploaded?.length > 0 ? "Các ảnh" : "Đăng các ảnh khác"}
    </button>
  );
};

export default UploadMultipleWidget;
