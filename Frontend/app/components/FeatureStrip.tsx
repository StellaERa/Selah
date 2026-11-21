import Image from "next/image";

const FEATURES = [
  {
    icon: "/images/aiPoweredCryptoEdu.png",
    label: "Cited Scripture Study",
  },
  {
    icon: "/images/stellar.png",
    label: "Stellar Blockchain",
  },
  {
    icon: "/images/communitynscoial.png",
    label: "Study Groups",
  },
  {
    icon: "/images/tradingnwallet.png",
    label: "USDC & XLM",
  },
] as const;

export default function FeatureStrip() {
  return (
    <div className="bg-black py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
        {FEATURES.map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-lg font-medium text-white"
          >
            <Image
              src={icon}
              alt={label}
              title={label}
              width={36}
              height={36}
              className="h-9 w-9"
              unoptimized
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
