import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

interface MenuCardProps {
  image: string;
  title: string;
  price: string;
}

export default function MenuCard({
  image,
  title,
  price,
}: MenuCardProps) {
  return (
    <div className="w-[320px] bg-[#fdf7f2] rounded-lg overflow-hidden">

      <Image
        src={image}
        alt={title}
        width={320}
        height={240}
        className="w-full h-[240px] object-cover"
      />

      <div className="p-5">

        <h2 className="text-4xl font-bold text-[#552d1f]">
          {title}
        </h2>

        <div className="flex justify-between items-center mt-3">

          <p className="text-xl font-medium">
            {price}
          </p>

          <div className="w-12 h-12 rounded-full bg-[#552d1f] text-white flex items-center justify-center">
            <FiArrowUpRight size={24} />
          </div>

        </div>

      </div>

    </div>
  );
}