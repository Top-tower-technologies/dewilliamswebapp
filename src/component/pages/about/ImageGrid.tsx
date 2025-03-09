import Image from "next/image";
import gym from "../../../../public/bg/about/ImageGrid1.png";
import spa from "../../../../public/bg/about/ImageGrid2.png";

interface GridImageProps {
  image: any;
  title: string;
}

const GridImage: React.FC<GridImageProps> = ({ image, title }) => {
  return (
    <div className="relative w-full h-[300px]">
      <Image
        src={image}
        alt={title}
        width={400}
        height={400}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h3 className="text-white text-[20px] ">{title}</h3>
      </div>
    </div>
  );
};

const ImageGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-14">
      <GridImage image={gym} title="Stay Fit, Get Fit" />
      <GridImage image={spa} title="Relax & Recharge" />
    </div>
  );
};

export default ImageGrid;
