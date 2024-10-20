import Image from 'next/image';

export default function FeaturesShowcase() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="relative w-full h-[500px] overflow-hidden rounded-xl">
        <Image
          src="https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/en-us/test/homepageredesign2024/hero/all-files-desktop.png?id=75a3b2c3-59ab-45f6-bdaa-fa64bac618e7&width=2880&output_type=png"
          alt="Dropbox hero image"
          fill
          style={{ objectFit: 'contain' }}
          priority
          sizes="(min-width: 1920px) 32vw, (min-width: 1440px) 43vw, (min-width: 1280px) 57vw, (min-width: 1024px) 64vw, (min-width: 768px) 80vw, 100vw"
          className="shadow-lg rounded-xl"
        />
      </div>
    </div>
  );
}
