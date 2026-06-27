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
  { label: "Auto-Edited", sublabel: "Professional gameplay highlights", gradient: "linear-gradient(160deg,#08142e 0%,#0f2e6e 55%,#1d6cef 100%)", accentGlow: "rgba(29,108,239,0.5)" },
  { label: "Geo-Branded", sublabel: "Your FEC logo and location watermarked", gradient: "linear-gradient(160deg,#0a1638 0%,#143a8c 55%,#3f86f0 100%)", accentGlow: "rgba(63,134,240,0.45)" },
  { label: "Local Traffic", sublabel: "Every share acts as a local referral", gradient: "linear-gradient(160deg,#07112a 0%,#0d2c6b 55%,#2a6ee6 100%)", accentGlow: "rgba(42,110,230,0.45)" },
  { label: "Zero-Cost Acquisition", sublabel: "Turn player reach into free marketing", gradient: "linear-gradient(160deg,#081530 0%,#0f2f72 55%,#246ae0 100%)", accentGlow: "rgba(36,106,224,0.45)" },
];

/* S5 — Locations: international reels (provided by business) */
const venueReels: ReelItem[] = [
  { videoSrc: "/video/social_media/1.mp4", account: "hypergrid.ai", caption: "The crowd reaction says it all! Watch players step onto the LED floor and start moving. ⚡🔥 #activegaming #hypergrid", likes: "2.4K", comments: "112" },
  { videoSrc: "/video/social_media/2.mp4", account: "hypergrid.ai", caption: "Zero staff, infinite fun! The first fully unattended multiplayer LED arena. #arcade #futureofplay", likes: "1.8K", comments: "94" },
  { videoSrc: "/video/social_media/3.mp4", account: "hypergrid.ai", caption: "Gameplay footage from our new level! Replayability is off the charts. 🎮👾 #indiegamedev #gamers", likes: "986", comments: "47" },
  { videoSrc: "/video/social_media/4.mp4", account: "hypergrid.ai", caption: "Installed in under 2 days. Request a brochure to bring this to your venue today. 📍🚀 #amusementpark #fec", likes: "3.2K", comments: "156" },
  { videoSrc: "/video/social_media/5.mp4", account: "hypergrid.ai", caption: "Automatically auto-edited clips direct to player phones! Pure marketing power. 📱✨ #socialmedia #viral", likes: "4.1K", comments: "210" },
  { videoSrc: "/video/social_media/6.mp4", account: "hypergrid.ai", caption: "1-6 players, all age groups. The perfect attraction for family entertainment centers! 👨‍👩‍👧‍👦🎮 #familyfun", likes: "1.5K", comments: "72" },
  { videoSrc: "/video/social_media/8.mp4", account: "hypergrid.ai", caption: "Another packed weekend! Watch our game grid attract massive queues. 📈💰 #operatorgoals #amusements", likes: "2.7K", comments: "89" },
];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <NavBar />

      <main className="page-canvas min-h-screen relative">
        <HeroSection />
        {/* <VideoSection /> */}
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
