import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import KeyFeaturesSection from "@/components/KeyFeaturesSection";
import MomentsSection from "@/components/MomentsSection";
import InstagramCarousel, { ReelItem } from "@/components/InstagramCarousel";
import ProofSection from "@/components/ProofSection";
import ROICalculator from "@/components/ROICalculator";
import CaseStudy from "@/components/CaseStudy";
import BrochureForm from "@/components/BrochureForm";
import { CarouselCard } from "@/components/CardCarousel";
import StickyFooterCTA from "@/components/StickyFooterCTA";
import SmoothScroll from "@/components/SmoothScroll";

/* S3 — Key Features (7 cards). Blue-family gradients. */
const featureCards: CarouselCard[] = [
  { label: "Unattended", sublabel: "Zero staff required, simple UI", gradient: "linear-gradient(160deg,#0a1838 0%,#11317a 55%,#1d6cef 100%)", accentGlow: "rgba(29,108,239,0.45)", image: "/features/unmanned.png" },
  { label: "Turnkey", sublabel: "Just need space and power", gradient: "linear-gradient(160deg,#08142e 0%,#0f2e6e 55%,#2f74e6 100%)", accentGlow: "rgba(47,116,230,0.4)", image: "/features/turnkey.png" },
  { label: "Appealing", sublabel: "Bright, crowd-pulling design", gradient: "linear-gradient(160deg,#0a1638 0%,#143a8c 55%,#3f86f0 100%)", accentGlow: "rgba(63,134,240,0.4)", image: "/features/appealing.png" },
  { label: "Multiplayer", sublabel: "1–6 players of any age group", gradient: "linear-gradient(160deg,#07112a 0%,#0d2c6b 55%,#1f63d8 100%)", accentGlow: "rgba(31,99,216,0.4)", image: "/features/multiplayer.png" },
  { label: "Tutorials", sublabel: "Make the game easy to understand", gradient: "linear-gradient(160deg,#0a1838 0%,#123178 55%,#2a6ee6 100%)", accentGlow: "rgba(42,110,230,0.4)", image: "/features/tutorial.png" },
  { label: "Repeatable", sublabel: "4+ engaging games, high replayability", gradient: "linear-gradient(160deg,#081530 0%,#0f2f72 55%,#246ae0 100%)", accentGlow: "rgba(36,106,224,0.4)", image: "/features/repeatable.png" },
  { label: "Multilingual", sublabel: "Supports all major languages", gradient: "linear-gradient(160deg,#091633 0%,#103079 55%,#2b70e8 100%)", accentGlow: "rgba(43,112,232,0.4)", image: "/features/multilingual.png" },
];

/* S4 — Moments AI (4 cards) */
const momentsCards: CarouselCard[] = [
  { label: "Auto-Edited", sublabel: "Pro VFX and trending music", gradient: "linear-gradient(160deg,#08142e 0%,#0f2e6e 55%,#1d6cef 100%)", accentGlow: "rgba(29,108,239,0.5)" },
  { label: "Auto-Branded", sublabel: "Your logo and location baked in", gradient: "linear-gradient(160deg,#0a1638 0%,#143a8c 55%,#3f86f0 100%)", accentGlow: "rgba(63,134,240,0.45)" },
  { label: "Drives Footfall", sublabel: "Every share brings new players in", gradient: "linear-gradient(160deg,#07112a 0%,#0d2c6b 55%,#2a6ee6 100%)", accentGlow: "rgba(42,110,230,0.45)" },
  { label: "Always On-Trend", sublabel: "Templates refreshed to match trends", gradient: "linear-gradient(160deg,#081530 0%,#0f2f72 55%,#246ae0 100%)", accentGlow: "rgba(36,106,224,0.45)" },
];

/* S5 — Locations: international reels (provided by business) */
const venueReels: ReelItem[] = [
  { url: "https://www.instagram.com/reel/DU4_UL7jINq/", account: "HyperGrid", caption: "HyperGrid in action" },
  { url: "https://www.instagram.com/reel/DXzOcsiADBd/", account: "HyperGrid", caption: "HyperGrid in action" },
  { url: "https://www.instagram.com/reel/DUz6U78jCCm/", account: "HyperGrid", caption: "HyperGrid in action" },
  { url: "https://www.instagram.com/reel/DZs2s1GisOJ/", account: "HyperGrid", caption: "HyperGrid in action" },
  { url: "https://www.instagram.com/reel/DXgE6d3k7gt/", account: "HyperGrid", caption: "HyperGrid in action" },
  { url: "https://www.instagram.com/reel/DKtvvA0zNPg/", account: "HyperGrid", caption: "HyperGrid in action" },
  { url: "https://www.instagram.com/reel/DLRK7AwSp_z/", account: "HyperGrid", caption: "HyperGrid in action" },
  { url: "https://www.instagram.com/reel/DJqjurezDsT/", account: "HyperGrid", caption: "HyperGrid in action" },
];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <NavBar />

      <main className="page-canvas min-h-screen relative">
        <HeroSection />
        <VideoSection />
        <KeyFeaturesSection cards={featureCards} />
        <MomentsSection cards={momentsCards} />
        <InstagramCarousel items={venueReels} title="100+ Locations Worldwide" sectionId="locations" />
        <ProofSection />
        <ROICalculator />
        <CaseStudy />
        <BrochureForm />
      </main>

      {/* <StickyFooterCTA /> */}
    </>
  );
}
