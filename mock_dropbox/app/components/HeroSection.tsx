import { robotoCondensed } from '../fonts/font';
import { OpacityAnimatedBox, ScaleAnimatedBox } from '../study/AnimatedBox';
export default function HeroSection() {
  return (
    <OpacityAnimatedBox>
      <div className="bg-black  flex items-center justify-center py-20 pt-40 sticky top-0">
        <ScaleAnimatedBox>
          <HeroContentSection />
        </ScaleAnimatedBox>
      </div>
    </OpacityAnimatedBox>
  );
}

function HeroContentSection() {
  return (
    <div className="flex flex-col items-center justify-center space-y-16  max-w-4xl">
      <div className="flex flex-col items-center space-y-6 text-center ">
        <span
          className={`${robotoCondensed.className} font-sharp-grotesk text-4xl md:text-6xl font-bold text-gray-200 `}
        >
          Get to work, with a lot less work
        </span>
        <span className="font-atlas-grotesk text-base md:text-xl leading-relaxed text-gray-300 opacity-80">
          Dropbox delivers tools that help you move your work forward faster, keep it safe, and let
          you collaborate with ease.
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
        <div className="flex flex-col items-center">
          <a
            href="/register"
            className="inline-flex items-center justify-center px-8 py-6 bg-[rgb(57,132,255)] text-black font-atlas-grotesk text-base font-semibold rounded-md hover:bg-blue-700 transition duration-300"
            data-trackingid="home_hero_cta"
          >
            <span>Sign up free</span>
            <svg
              className="w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <span className="text-xs text-gray-400 mt-1">No credit card required.</span>
        </div>
        <a
          href="/plans"
          className="inline-flex items-center text-white underline font-atlas-grotesk text-base font-medium hover:text-gray-300 transition duration-300"
          data-trackingid="home_secondary_hero_cta"
        >
          Find your plan
          <svg
            className="w-5 h-5 ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
