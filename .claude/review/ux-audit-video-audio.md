# UX Audit — Video & Audio Controls + Poster Covers
_Generated: 2026-08-14_
_Focus: Video playback state, audio mute/unmute correctness, poster/cover images across all video surfaces_

8 observations across 3 surfaces.

---

## Surface: InstagramEmbed (used inside InstagramCarousel)

- **[BUG] `muted` HTML attribute is hardcoded — audio can never play.** The `<video>` element is rendered with a bare `muted` attribute (`muted` with no binding). The mute toggle correctly sets `video.muted = nextMuted` on the DOM element at runtime, so audio does work after interaction — but the `isMuted` React state starts `true` and the element starts muted, which is correct. However, if the component remounts (e.g. carousel scrolls the card out and back in), the video element is recreated with the hardcoded `muted` attribute, resetting audio to muted even if the user had previously unmuted it. The toggle icon will show unmuted but audio will be silenced.

- **[BUG] Mute toggle icon and actual audio state can desync after re-intersection.** When a card scrolls out of view and back in, the `IntersectionObserver` fires, calls `video.play()`, and resets `isPausedByUser` to `false`. But `isMuted` state is not reset — it retains whatever the user last set. However the video element is remounted (because `src` is cleared on exit via `src={hasIntersected ? videoSrc : undefined}` — actually `hasIntersected` is sticky so src stays). The real risk: the hardcoded `muted` attribute means if `isMuted` is `false` in state but the element just remounted, the element starts muted again while the icon shows the unmuted state.

- **[BUG] No poster images exist on disk.** `InstagramEmbed` derives poster path as `/video/posters/<name>.jpg` from the videoSrc. For social_media videos this resolves to `/video/posters/social_media/1.jpg` etc. The `public/video/posters/` directory is completely empty — no poster files exist. This means every card shows a black frame during the initial load window instead of a cover image, which looks broken and signals slow performance.

- **[MISSING STATE] No error state UI.** The `onError` handler calls `reportPlaying` and clears `isBuffering`, but renders nothing to the user. If a video 404s or the network drops mid-load, the card shows a black rectangle with no feedback. The spinner disappears (good) but nothing replaces it.

---

## Surface: MomentsSection

- **[BUG] No poster image exists on disk for `moments-reel.mp4`.** The `<video>` element references `poster="/video/posters/moments-reel.jpg"` but `public/video/posters/` is empty. On initial load — before `mounted` becomes true and the video element renders — the phone frame shows the raw `bg-slate-900` background. After mount, the video element appears but still shows black until the first frame is decoded. There is no visual cover at any point.

- **[BUG] Spinner shows even after video errors.** `onError` sets `isPlaying(false)` and calls `reportPlaying`, but `isPlaying` staying false means the spinner (`!isPlaying` check) continues to show. If moments-reel.mp4 fails to load entirely, the user sees an infinite spinner in the phone frame with no recovery path.

- **[INCONSISTENCY] `isMuted` state vs actual `video.muted` attribute.** The `<video>` element uses `muted={isMuted}` (correctly bound as a React prop), so this is handled properly here — unlike InstagramEmbed. However `isMuted` initialises to `true` and `reportStalling` is called in the mount `useEffect` unconditionally, even before the video has had a chance to start playing. This means every page load registers a stall immediately, which could trigger the slow-connection toast prematurely on fast connections.

---

## Surface: HeroSection (video modal)

- **[BUG] No poster image exists on disk for `hypergrid-reel.mp4`.** The `<video>` references `poster="/video/posters/hypergrid-reel.jpg"` but `public/video/posters/` is empty. When the modal opens for the first time (`hasOpenedOnce` becomes true), the video element is injected with no poster — the modal background shows black until the spinner clears on `onCanPlay`. On re-opens the element stays mounted so this is a first-open-only issue, but it's the highest-visibility moment.

- **[MISSING STATE] Modal video has no audio control.** The hero modal video renders with native browser `controls`, which includes volume. This is actually fine for the hero — but there is no explicit `muted` attribute, meaning on first open the video will attempt to play with audio. Most browsers block autoplay with audio, so `videoRef.current?.play()` will throw (caught by `.catch(() => {})`) and the video won't autoplay at all. The user must manually press play in the native controls. The spinner shows, `onCanPlay` fires, spinner clears — but the video is paused, leaving a silent static first frame with play controls visible.
