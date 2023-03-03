import Image from 'next/image';

const loader = ({ src }: { src: string }) => {
  return `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/${src}`;
};

export default function Product({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}) {
  return (
    <Image
      loader={loader}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
