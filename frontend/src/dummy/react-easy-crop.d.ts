
declare module 'react-easy-crop' {
  import { ComponentType } from 'react';

  export interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface CropperProps {
    image: string;
    crop: { x: number; y: number };
    zoom: number;
    aspect: number;
    onCropChange: (crop: { x: number; y: number }) => void;
    onZoomChange: (zoom: number) => void;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  }

  const Cropper: ComponentType<CropperProps>;
  export default Cropper;
}