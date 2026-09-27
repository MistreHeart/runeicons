import { BEAM_PIPE_LOWER_D, BEAM_PIPE_UPPER_D } from "./constants";

const HeroDefs = () => (
  <defs>
    <mask id="pipeRevealMask" maskUnits="userSpaceOnUse">
      <rect className="pipeRevealRect" x="336" y="395" width="0" height="110" fill="white" />
    </mask>
    <clipPath id="rocketFlameClip" clipPathUnits="userSpaceOnUse">
      <rect x="-200" y="-1000" width="1164" height="1490" />
    </clipPath>
    <pattern
      id="hazardStripesPattern"
      patternUnits="userSpaceOnUse"
      width="8"
      height="8"
      patternTransform="rotate(45)"
    >
      <rect width="8" height="8" className="hazardStripeYellow" />
      <rect width="4" height="8" className="hazardStripeDark" />
    </pattern>
    <filter id="cloudBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" />
    </filter>
    <linearGradient id="rocketCoreGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style={{ stopColor: "var(--scene-flame-1)" }} stopOpacity="0.95" />
      <stop offset="30%" style={{ stopColor: "var(--scene-flame-2)" }} stopOpacity="0.85" />
      <stop offset="70%" style={{ stopColor: "var(--scene-flame-3)" }} stopOpacity="0.55" />
      <stop offset="100%" style={{ stopColor: "var(--scene-flame-3)" }} stopOpacity="0" />
    </linearGradient>
    <linearGradient id="rocketPlumeGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style={{ stopColor: "var(--scene-flame-3)" }} stopOpacity="0.8" />
      <stop offset="45%" style={{ stopColor: "var(--scene-flame-4)" }} stopOpacity="0.55" />
      <stop offset="85%" style={{ stopColor: "var(--scene-beam-3)" }} stopOpacity="0.18" />
      <stop offset="100%" style={{ stopColor: "var(--scene-beam-3)" }} stopOpacity="0" />
    </linearGradient>
    <linearGradient id="rocketHaloGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style={{ stopColor: "var(--scene-flame-3)" }} stopOpacity="0.35" />
      <stop offset="50%" style={{ stopColor: "var(--scene-beam-3)" }} stopOpacity="0.25" />
      <stop offset="100%" style={{ stopColor: "var(--scene-beam-3)" }} stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="beamPipeFlow"
      x1="340"
      y1="395"
      x2="610"
      y2="500"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" style={{ stopColor: "var(--scene-beam-1)" }} stopOpacity="0.55" />
      <stop offset="35%" style={{ stopColor: "var(--scene-beam-2)" }} stopOpacity="0.75" />
      <stop offset="70%" style={{ stopColor: "var(--scene-beam-3)" }} stopOpacity="0.6" />
      <stop offset="100%" style={{ stopColor: "var(--scene-beam-1)" }} stopOpacity="0.35" />
    </linearGradient>
    <filter id="rocketHaloBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <clipPath id="bgblur_0_4_2_clip_path" transform="translate(-336.094 -391.609)">
      <path d={BEAM_PIPE_UPPER_D} />
    </clipPath>
    <clipPath id="bgblur_1_4_2_clip_path" transform="translate(-331.681 -408.46)">
      <path d={BEAM_PIPE_LOWER_D} />
    </clipPath>
    <linearGradient
      id="paint0_linear_4_2"
      x1="50"
      y1="83.1921"
      x2="50"
      y2="-7.21073"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint1_linear_4_2"
      x1="50"
      y1="0"
      x2="50"
      y2="93.2218"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint2_linear_4_2"
      x1="50"
      y1="80.515"
      x2="50"
      y2="-6.9787"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint3_linear_4_2"
      x1="50"
      y1="0"
      x2="50"
      y2="90.222"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint4_linear_4_2"
      x1="105"
      y1="149.39"
      x2="105"
      y2="-12.9484"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint5_linear_4_2"
      x1="105"
      y1="0"
      x2="105"
      y2="167.4"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint6_linear_4_2"
      x1="105"
      y1="150.083"
      x2="105"
      y2="-13.0085"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint7_linear_4_2"
      x1="105"
      y1="0"
      x2="105"
      y2="168.177"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint8_linear_4_2"
      x1="633.257"
      y1="558.226"
      x2="633.257"
      y2="458.826"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint9_linear_4_2"
      x1="633.257"
      y1="466.754"
      x2="633.257"
      y2="548.489"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint10_linear_4_2"
      x1="682.39"
      y1="569.441"
      x2="682.39"
      y2="483.39"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint11_linear_4_2"
      x1="682.39"
      y1="490.254"
      x2="682.39"
      y2="578.988"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="0.794342" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint12_linear_4_2"
      x1="731.523"
      y1="558.226"
      x2="731.523"
      y2="458.826"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint13_linear_4_2"
      x1="731.523"
      y1="466.754"
      x2="731.523"
      y2="569.254"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="0.723228" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint14_linear_4_2"
      x1="84.5"
      y1="165.988"
      x2="84.5"
      y2="-14.3871"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint15_linear_4_2"
      x1="84.5"
      y1="0"
      x2="84.5"
      y2="186"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint16_linear_4_2"
      x1="20"
      y1="165.988"
      x2="20.0001"
      y2="-14.3871"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint17_linear_4_2"
      x1="20"
      y1="0"
      x2="20"
      y2="186"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint18_linear_4_2"
      x1="20"
      y1="165.497"
      x2="20.0001"
      y2="-14.3446"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint19_linear_4_2"
      x1="20"
      y1="0"
      x2="20"
      y2="185.45"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint20_linear_4_2"
      x1="20"
      y1="165.642"
      x2="20.0001"
      y2="-14.3571"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="1" stopColor="#DDDDDD" />
    </linearGradient>
    <linearGradient
      id="paint21_linear_4_2"
      x1="20"
      y1="0"
      x2="20"
      y2="185.612"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="1" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint22_linear_4_2"
      x1="433.156"
      y1="429.364"
      x2="424.874"
      y2="447.97"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0.3" />
      <stop offset="1" stopColor="white" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint23_linear_4_2"
      x1="445.318"
      y1="446.58"
      x2="437.952"
      y2="466.091"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0.3" />
      <stop offset="1" stopColor="white" stopOpacity="0" />
    </linearGradient>
    <linearGradient
      id="paint24_linear_4_2"
      x1="611.96"
      y1="523.409"
      x2="611.961"
      y2="116.725"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="0.0830524" stopColor="white" />
      <stop offset="1" stopColor="white" />
    </linearGradient>
    <linearGradient
      id="paint25_linear_4_2"
      x1="611.96"
      y1="149.163"
      x2="611.96"
      y2="568.528"
      gradientUnits="userSpaceOnUse"
    >
      <stop />
      <stop offset="0.827612" />
      <stop offset="0.934325" stopColor="#666666" stopOpacity="0" />
    </linearGradient>
  </defs>
);

export default HeroDefs;
