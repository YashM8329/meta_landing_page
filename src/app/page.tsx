"use client";

import Script from "next/script";
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
import Footer from "@/components/Footer";
import { useTranslation } from "@/lib/useTranslation";

/* S5 — Locations: international reels (provided by business) */
const venueReels: ReelItem[] = [
  { videoSrc: "/video/social_media/1.mp4", account: "Timezone", caption: "The crowd reaction says it all! Watch players step onto the LED floor and start moving. ⚡🔥 #activegaming #hypergrid", likes: "2.4K", comments: "112", gameZone: "New Zealand" },
  { videoSrc: "/video/social_media/2.mp4", account: "Fun City", caption: "Zero staff, infinite fun! The first fully unattended multiplayer LED arena. #arcade #futureofplay", likes: "1.8K", comments: "94", gameZone: "Dubai" },
  { videoSrc: "/video/social_media/4.mp4", account: "Infinity Park", caption: "Installed in under 2 days. Request a brochure to bring this to your venue today. 📍🚀 #amusementpark #fec", likes: "3.2K", comments: "156", gameZone: "Reunioun Island" },
  { videoSrc: "/video/social_media/5.mp4", account: "Timezone", caption: "Automatically auto-edited clips direct to player phones! Pure marketing power. 📱✨ #socialmedia #viral", likes: "4.1K", comments: "210", gameZone: "Aurstralia" },
  { videoSrc: "/video/social_media/3.mp4", account: "Surfurs Paradise", caption: "Gameplay footage from our new level! Replayability is off the charts. 🎮👾 #indiegamedev #gamers", likes: "986", comments: "47", gameZone: "Main Event, Austin" },
  { videoSrc: "/video/social_media/6.mp4", account: "Timezone", caption: "1-6 players, all age groups. The perfect attraction for family entertainment centers! 👨‍👩‍👧‍👦🎮 #familyfun", likes: "1.5K", comments: "72", gameZone: "Orchard, Singapore" },
  { videoSrc: "/video/social_media/8.mp4", account: "The Zone Dubai", caption: "Another packed weekend! Watch our game grid attract massive queues. 📈💰 #operatorgoals #amusements", likes: "2.7K", comments: "89", gameZone: "Dubai" },
];

export default function Home() {
  const { t } = useTranslation();

  /* S3 — Key Features (7 cards). Blue-family gradients. */
  const featureCards: CarouselCard[] = [
    { label: t.features.cards.unattended.label, sublabel: t.features.cards.unattended.sublabel, gradient: "linear-gradient(160deg,#0a1838 0%,#11317a 55%,#1d6cef 100%)", accentGlow: "rgba(29,108,239,0.45)", image: "/features/unmanned.png" },
    { label: t.features.cards.turnkey.label, sublabel: t.features.cards.turnkey.sublabel, gradient: "linear-gradient(160deg,#08142e 0%,#0f2e6e 55%,#2f74e6 100%)", accentGlow: "rgba(47,116,230,0.4)", image: "/features/turnkey.png" },
    { label: t.features.cards.appealing.label, sublabel: t.features.cards.appealing.sublabel, gradient: "linear-gradient(160deg,#0a1638 0%,#143a8c 55%,#3f86f0 100%)", accentGlow: "rgba(63,134,240,0.4)", image: "/features/appealing.png" },
    { label: t.features.cards.multiplayer.label, sublabel: t.features.cards.multiplayer.sublabel, gradient: "linear-gradient(160deg,#07112a 0%,#0d2c6b 55%,#1f63d8 100%)", accentGlow: "rgba(31,99,216,0.4)", image: "/features/multiplayer.png" },
    { label: t.features.cards.tutorials.label, sublabel: t.features.cards.tutorials.sublabel, gradient: "linear-gradient(160deg,#0a1838 0%,#123178 55%,#2a6ee6 100%)", accentGlow: "rgba(42,110,230,0.4)", image: "/features/tutorial.png" },
    { label: t.features.cards.repeatable.label, sublabel: t.features.cards.repeatable.sublabel, gradient: "linear-gradient(160deg,#081530 0%,#0f2f72 55%,#246ae0 100%)", accentGlow: "rgba(36,106,224,0.4)", image: "/features/repeatable.png" },
    { label: t.features.cards.multilingual.label, sublabel: t.features.cards.multilingual.sublabel, gradient: "linear-gradient(160deg,#091633 0%,#103079 55%,#2b70e8 100%)", accentGlow: "rgba(43,112,232,0.4)", image: "/features/multilingual.png" },
  ];

  /* S4 — Moments AI (4 cards) */
  const momentsCards: CarouselCard[] = [
    { label: t.momentsCards.autoEdited.label, sublabel: t.momentsCards.autoEdited.sublabel, gradient: "linear-gradient(160deg,#08142e 0%,#0f2e6e 55%,#1d6cef 100%)", accentGlow: "rgba(29,108,239,0.5)" },
    { label: t.momentsCards.geoBranded.label, sublabel: t.momentsCards.geoBranded.sublabel, gradient: "linear-gradient(160deg,#0a1638 0%,#143a8c 55%,#3f86f0 100%)", accentGlow: "rgba(63,134,240,0.45)" },
    { label: t.momentsCards.localTraffic.label, sublabel: t.momentsCards.localTraffic.sublabel, gradient: "linear-gradient(160deg,#07112a 0%,#0d2c6b 55%,#2a6ee6 100%)", accentGlow: "rgba(42,110,230,0.45)" },
    { label: t.momentsCards.zeroCost.label, sublabel: t.momentsCards.zeroCost.sublabel, gradient: "linear-gradient(160deg,#081530 0%,#0f2f72 55%,#246ae0 100%)", accentGlow: "rgba(36,106,224,0.45)" },
  ];

  return (
    <>
      {/* Meta Pixel — Home Page */}
      <Script
        id="meta-pixel-home"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1079278694629302');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img height="1" width="1" style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1079278694629302&ev=PageView&noscript=1"
        />
      </noscript>

      <SmoothScroll />
      <NavBar />

      <main className="page-canvas min-h-screen relative">
        <HeroSection />
        <BrochureForm />
        {/* <VideoSection /> */}
        <KeyFeaturesSection cards={featureCards} />
        <MomentsSection cards={momentsCards} />
        <InstagramCarousel items={venueReels} title={t.venues.title} sectionId="locations" />
        <ProofSection />
        <ROICalculator />
        <CaseStudy />
      </main>

      <Footer />

      {/* <StickyFooterCTA /> */}
    </>
  );
}
