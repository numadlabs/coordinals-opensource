// import { Global } from "iconsax-react";
// import Image from "next/image";

// const links = [
//   {
//     url: "/collections",
//     isIcon: true,
//     icon: <Global size="32" color="#ffffff" />,
//   },
//   {
//     url: "/collections",
//     // image: "/detail_icon/icon_2.png",
//   },
//   {
//     url: "/collections",
//     // image: "/detail_icon/icon_3.png",
//   },
// ];
// export default function HoverCard() {
//   return (
//     <div className="absolute collection-card right-8 top-1 ">
//       <div className="">
//         <div className="flex flex-col  gap-[10px] pt-8 ">
//           {links.map((link, i) => (
//             <button
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 console.log("asdf");
//               }}
//               key={i}
//               className="h-10 w-10 border border-transparent rounded-lg p-2 bg-neutral500 bg-opacity-[50%]"
//             >
//               <Image
//                 width={24}
//                 height={24}
//                 src={link.icon}
//                 className="aspect-square rounded-3xl"
//                 alt="png"
//               />
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import DiscordIcon from "@/components/icon/hoverIcon";
import ThreadIcon from "@/components/icon/thread";
import { Global } from "iconsax-react";
// import TwiterIcon from "../../icon/hover";

const links = [
  {
    url: "/collections",
    isIcon: true,
    icon: <Global size="24" className={`hover:text-brand text-neutral00`} />,
  },
  {
    url: "/collections",
    isIcon: true,
    icon: <DiscordIcon size={24} className={`iconHover`} />,
  },
  {
    url: "/collections",
    isIcon: false,
    icon: <ThreadIcon size={24} className={`iconHover`} />,
  },
];

export default function HoverCard() {
  return (
    <div className="absolute collection-card right-8 top-1">
      <div className="flex flex-col gap-[10px] pt-8">
        {links.map((link, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Button clicked");
            }}
            className="h-10 w-10 border border-transparent rounded-lg p-2 bg-neutral500 bg-opacity-[50%]"
          >
            <div className="aspect-square rounded-3xl">{link.icon}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
