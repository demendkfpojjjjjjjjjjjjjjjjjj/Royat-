import {Config} from '@remotion/cli/config';

// Use a locally installed Chrome Headless Shell when provided (e.g. offline machines).
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
// Video defaults; skipped for audio-only QA renders (AUDIO_ONLY=1 ... --codec=wav).
if (!process.env.AUDIO_ONLY) {
  Config.setVideoImageFormat('jpeg');
  Config.setJpegQuality(95);
  Config.setCodec('h264');
  Config.setCrf(16);
  Config.setPixelFormat('yuv420p');
}
Config.setConcurrency(4);
