import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Check,
  Search,
  Sparkles,
  Truck,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Package,
  Heart,
  Store,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useApp } from '../context/AppContext';

/* =========================================================================
   3D CARTOON DEFINITIONS & SHADERS (SVG Volumetric & Specular Gradients)
   ========================================================================= */

export const Svg3dFilters: React.FC = () => (
  <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
    <defs>
      {/* 3D Skin Glow & Ambient Shadow */}
      <radialGradient id="tontonSkin3D" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#8D5B4C" />
        <stop offset="60%" stopColor="#6D4335" />
        <stop offset="100%" stopColor="#4A281E" />
      </radialGradient>
      <radialGradient id="tifiSkin3D" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#8D5B4C" />
        <stop offset="65%" stopColor="#6D4335" />
        <stop offset="100%" stopColor="#4A281E" />
      </radialGradient>

      {/* 3D Straw Hat (Chapo Pay) Volumetric Gradients */}
      <radialGradient id="hatBrim3D" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="85%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#854D0E" />
      </radialGradient>
      <linearGradient id="hatCrown3D" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#FACC15" />
        <stop offset="80%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </linearGradient>

      {/* 3D Clothing Gradients */}
      <linearGradient id="tontonShirt3D" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#F1F5F9" />
        <stop offset="85%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="tifiDress3D" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="45%" stopColor="#DC2626" />
        <stop offset="85%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>

      {/* 3D Gold Metallic */}
      <linearGradient id="metallicGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="35%" stopColor="#FBBF24" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>

      {/* 3D Crimson Plastic / Shield */}
      <radialGradient id="crimsonShield3D" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="40%" stopColor="#DC2626" />
        <stop offset="80%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#450A0A" />
      </radialGradient>

      {/* 3D Package Craft Paper */}
      <linearGradient id="packageCraft3D" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="40%" stopColor="#D97706" />
        <stop offset="85%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>

      {/* 3D Soft Ambient Occlusion Filter */}
      <filter id="soft3dShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
      </filter>
      <filter id="glow3dGold" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  </svg>
);

/* =========================================================================
   3D CARTOON CHARACTER 1: 👨🏾 TI TONTON (Consistent Appearance Across Scenes)
   ========================================================================= */

interface CharacterProps {
  pose?: 'searching' | 'excited' | 'pointing' | 'happy' | 'receiving';
  className?: string;
  blinking?: boolean;
}

export const TontonCharacter3D: React.FC<CharacterProps> = ({
  pose = 'searching',
  className = 'w-24 h-32',
  blinking = false,
}) => {
  return (
    <div className={`relative ${className} select-none pointer-events-none`}>
      <svg viewBox="0 0 130 165" className="w-full h-full filter drop-shadow-xl">
        {/* Soft ground contact shadow */}
        <ellipse cx="65" cy="158" rx="42" ry="7" fill="rgba(0,0,0,0.38)" />

        {/* 3D Torso / Crisp Linen Shirt with 3D Depth */}
        <path
          d="M 38 84 C 36 104 22 144 22 144 L 108 144 C 108 144 94 104 92 84 Z"
          fill="url(#tontonShirt3D)"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />

        {/* 3D Shirt Placket & Fold Shadows */}
        <path d="M 52 84 L 65 102 L 78 84 Z" fill="#E2E8F0" />
        <line x1="65" y1="102" x2="65" y2="144" stroke="#64748B" strokeWidth="2.5" />
        {/* 3D Buttons */}
        <circle cx="65" cy="112" r="2.5" fill="#334155" />
        <circle cx="65" cy="124" r="2.5" fill="#334155" />
        <circle cx="65" cy="136" r="2.5" fill="#334155" />

        {/* 3D Neck */}
        <rect x="56" y="72" width="18" height="15" rx="4" fill="url(#tontonSkin3D)" />

        {/* Arms & Hands according to Pose */}
        {pose === 'searching' && (
          <>
            {/* Left arm bent up holding 3D glowing phone */}
            <path
              d="M 38 90 C 24 106 28 126 44 126"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx="45" cy="126" r="7.5" fill="url(#tontonSkin3D)" />
            {/* 3D Smartphone with glowing bezel */}
            <rect
              x="42"
              y="104"
              width="18"
              height="30"
              rx="4"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="1.5"
              transform="rotate(-15 42 104)"
            />
            <rect
              x="44"
              y="106"
              width="14"
              height="24"
              rx="2"
              fill="#0284C7"
              transform="rotate(-15 42 104)"
            />
            {/* Phone screen reflection */}
            <path
              d="M 46 108 L 56 106 L 54 116 Z"
              fill="rgba(255,255,255,0.4)"
              transform="rotate(-15 42 104)"
            />

            {/* Right arm scratching chin in thoughtful search */}
            <path
              d="M 92 90 C 104 104 102 78 86 76"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="84" cy="74" r="7" fill="url(#tontonSkin3D)" />
          </>
        )}

        {(pose === 'happy' || pose === 'excited') && (
          <>
            {/* Arms raised in 3D celebration */}
            <path
              d="M 38 90 C 16 66 22 46 30 42"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="30" cy="42" r="7.5" fill="url(#tontonSkin3D)" />

            <path
              d="M 92 90 C 114 66 108 46 100 42"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="100" cy="42" r="7.5" fill="url(#tontonSkin3D)" />
          </>
        )}

        {pose === 'receiving' && (
          <>
            {/* Arms carrying 3D package */}
            <path
              d="M 38 92 C 30 118 48 124 56 124"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="56" cy="124" r="7" fill="url(#tontonSkin3D)" />

            <path
              d="M 92 92 C 100 118 82 124 74 124"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="74" cy="124" r="7" fill="url(#tontonSkin3D)" />
          </>
        )}

        {pose === 'pointing' && (
          <>
            {/* Left arm relaxed */}
            <path
              d="M 38 90 C 30 110 34 130 36 136"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="36" cy="136" r="7" fill="url(#tontonSkin3D)" />

            {/* Right arm pointing forward at product */}
            <path
              d="M 92 90 C 108 94 116 88 122 84"
              fill="none"
              stroke="url(#tontonShirt3D)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="124" cy="84" r="7.5" fill="url(#tontonSkin3D)" />
          </>
        )}

        {/* 3D Head with Volumetric Shading */}
        <ellipse cx="65" cy="58" rx="24" ry="26" fill="url(#tontonSkin3D)" />
        {/* Forehead & Cheek 3D Specular Highlight */}
        <ellipse cx="58" cy="48" rx="10" ry="7" fill="rgba(255,255,255,0.14)" />
        <ellipse cx="76" cy="62" rx="5" ry="4" fill="rgba(255,255,255,0.12)" />

        {/* 3D Ears with Depth */}
        <circle cx="41" cy="60" r="5.5" fill="#5D3A2E" />
        <circle cx="89" cy="60" r="5.5" fill="#5D3A2E" />

        {/* Eyes (With Natural Blinking or Joyful Curve) */}
        {blinking ? (
          // Natural blink lid
          <>
            <line x1="50" y1="56" x2="58" y2="56" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="56" x2="80" y2="56" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : pose === 'happy' || pose === 'excited' || pose === 'receiving' ? (
          // Joyful curved anime/cartoon eyes ^^
          <>
            <path d="M 50 56 Q 54 50 58 56" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 72 56 Q 76 50 80 56" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          // Bright expressive 3D eyes with catchlight
          <>
            <ellipse cx="54" cy="55" rx="4" ry="5" fill="#FFFFFF" />
            <circle cx="55" cy="55" r="2.4" fill="#0F172A" />
            <circle cx="56.5" cy="53.5" r="1" fill="#FFFFFF" />

            <ellipse cx="76" cy="55" rx="4" ry="5" fill="#FFFFFF" />
            <circle cx="77" cy="55" r="2.4" fill="#0F172A" />
            <circle cx="78.5" cy="53.5" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Eyebrows */}
        <path d="M 48 48 Q 54 45 60 48" fill="none" stroke="#2D1A13" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 70 48 Q 76 45 82 48" fill="none" stroke="#2D1A13" strokeWidth="2.5" strokeLinecap="round" />

        {/* Friendly Haitian Mustache with 3D Bevel */}
        <path
          d="M 51 68 Q 60 65 65 70 Q 70 65 79 68 Q 65 77 51 68 Z"
          fill="#2D1A13"
        />

        {/* Warm 3D Smile with Teeth glint */}
        <path d="M 55 74 Q 65 82 75 74" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

        {/* =========================================================================
            3D CHAPO PAY AYISYEN (Traditional Haitian Straw Hat with Volumetric Rim)
            ========================================================================= */}
        {/* Hat Rim (3D Ellipse with Ambient Occlusion Underneath) */}
        <ellipse cx="65" cy="40" rx="40" ry="13" fill="url(#hatBrim3D)" stroke="#B45309" strokeWidth="1.5" />
        {/* Hat Crown (3D Dome) */}
        <path
          d="M 45 40 C 47 14 83 14 85 40 Z"
          fill="url(#hatCrown3D)"
          stroke="#B45309"
          strokeWidth="1.5"
        />
        {/* Crown highlight */}
        <ellipse cx="65" cy="22" rx="14" ry="5" fill="rgba(255,255,255,0.28)" />

        {/* Red Ribbon Band (Haitian Flag color) */}
        <path
          d="M 46 36 Q 65 41 84 36"
          fill="none"
          stroke="#DC2626"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 47 35 Q 65 39 83 35"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/* =========================================================================
   3D CARTOON CHARACTER 2: 👧🏾 TI FI (Consistent Appearance Across Scenes)
   ========================================================================= */

export const TifiCharacter3D: React.FC<CharacterProps> = ({
  pose = 'pointing',
  className = 'w-20 h-28',
  blinking = false,
}) => {
  return (
    <div className={`relative ${className} select-none pointer-events-none`}>
      <svg viewBox="0 0 120 155" className="w-full h-full filter drop-shadow-xl">
        {/* Soft ground contact shadow */}
        <ellipse cx="60" cy="148" rx="34" ry="6" fill="rgba(0,0,0,0.35)" />

        {/* 3D Twin Braided Hair Buns with Metallic Gold & Red Ribbons */}
        {/* Left Bun */}
        <circle cx="30" cy="36" r="16" fill="#1C110C" />
        <circle cx="28" cy="34" r="13" fill="#2E1B15" />
        <ellipse cx="26" cy="30" rx="6" ry="4" fill="rgba(255,255,255,0.18)" />
        {/* Left Ribbons & 3D Gold Bead */}
        <circle cx="38" cy="46" r="5.5" fill="#DC2626" />
        <circle cx="36" cy="46" r="3.5" fill="url(#metallicGold3D)" />

        {/* Right Bun */}
        <circle cx="90" cy="36" r="16" fill="#1C110C" />
        <circle cx="92" cy="34" r="13" fill="#2E1B15" />
        <ellipse cx="94" cy="30" rx="6" ry="4" fill="rgba(255,255,255,0.18)" />
        {/* Right Ribbons & 3D Gold Bead */}
        <circle cx="82" cy="46" r="5.5" fill="#DC2626" />
        <circle cx="84" cy="46" r="3.5" fill="url(#metallicGold3D)" />

        {/* 3D Vibrant Haitian Dress */}
        <path
          d="M 38 84 C 36 100 24 136 24 136 L 96 136 C 96 136 84 100 82 84 Z"
          fill="url(#tifiDress3D)"
          stroke="#991B1B"
          strokeWidth="1.5"
        />
        {/* 3D Gold Collar Ornament */}
        <path d="M 48 84 Q 60 98 72 84 Z" fill="url(#metallicGold3D)" />

        {/* 3D Neck */}
        <rect x="52" y="72" width="16" height="15" rx="3.5" fill="url(#tifiSkin3D)" />

        {/* Arms according to Pose */}
        {pose === 'pointing' && (
          <>
            {/* Left hand on hip */}
            <path
              d="M 38 88 C 24 104 34 116 42 116"
              fill="none"
              stroke="url(#tifiDress3D)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="42" cy="116" r="6" fill="url(#tifiSkin3D)" />

            {/* Right arm joyfully pointing up to Mache Yogann */}
            <path
              d="M 82 88 C 104 74 108 56 112 48"
              fill="none"
              stroke="url(#tifiDress3D)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="112" cy="48" r="6.5" fill="url(#tifiSkin3D)" />
          </>
        )}

        {(pose === 'happy' || pose === 'excited') && (
          <>
            {/* Clapping / Cheering arms */}
            <path
              d="M 38 88 C 20 66 36 50 44 48"
              fill="none"
              stroke="url(#tifiDress3D)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="44" cy="48" r="6.5" fill="url(#tifiSkin3D)" />

            <path
              d="M 82 88 C 100 66 84 50 76 48"
              fill="none"
              stroke="url(#tifiDress3D)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="76" cy="48" r="6.5" fill="url(#tifiSkin3D)" />
          </>
        )}

        {pose === 'searching' && (
          <>
            {/* Curious posture */}
            <path
              d="M 38 88 C 46 108 56 110 60 110"
              fill="none"
              stroke="url(#tifiDress3D)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="60" cy="110" r="6" fill="url(#tifiSkin3D)" />

            <path
              d="M 82 88 C 74 108 64 110 60 110"
              fill="none"
              stroke="url(#tifiDress3D)"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </>
        )}

        {/* 3D Head */}
        <ellipse cx="60" cy="60" rx="22" ry="23" fill="url(#tifiSkin3D)" />
        {/* Cheeks & Forehead Glow */}
        <ellipse cx="54" cy="50" rx="9" ry="6" fill="rgba(255,255,255,0.15)" />
        <ellipse cx="70" cy="65" rx="5" ry="4" fill="rgba(239,68,68,0.2)" />

        {/* Natural Black Hair Texture & Fringe */}
        <path
          d="M 40 54 C 52 38 68 38 80 54 C 60 44 40 54 40 54 Z"
          fill="#1C110C"
        />

        {/* 3D Ears with Gold Hoop Earrings */}
        <circle cx="38" cy="62" r="5" fill="#5D3A2E" />
        <circle cx="36" cy="65" r="2.5" fill="none" stroke="url(#metallicGold3D)" strokeWidth="1.5" />

        <circle cx="82" cy="62" r="5" fill="#5D3A2E" />
        <circle cx="84" cy="65" r="2.5" fill="none" stroke="url(#metallicGold3D)" strokeWidth="1.5" />

        {/* Eyes (Expressive with Sparkling Catchlights) */}
        {blinking ? (
          <>
            <line x1="46" y1="58" x2="55" y2="58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="65" y1="58" x2="74" y2="58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="51" cy="58" rx="4.5" ry="5.5" fill="#FFFFFF" />
            <circle cx="52" cy="58" r="2.8" fill="#0F172A" />
            <circle cx="53.5" cy="56" r="1.2" fill="#FFFFFF" />

            <ellipse cx="69" cy="58" rx="4.5" ry="5.5" fill="#FFFFFF" />
            <circle cx="70" cy="58" r="2.8" fill="#0F172A" />
            <circle cx="71.5" cy="56" r="1.2" fill="#FFFFFF" />

            {/* Fluttering Eyelashes */}
            <path d="M 47 53 L 45 50" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 73 53 L 75 50" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}

        {/* Cheerful 3D Cartoon Smile */}
        <path d="M 51 70 Q 60 78 69 70 Z" fill="#991B1B" />
        <path d="M 53 70 Q 60 74 67 70" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

/* =========================================================================
   3D DELIVERY SCOOTER & COURIER (Volumetric Moto with turning wheels)
   ========================================================================= */

export const DeliveryAgent3D: React.FC<{ className?: string }> = ({
  className = 'w-28 h-24',
}) => (
  <div className={`relative ${className} select-none pointer-events-none`}>
    <svg viewBox="0 0 135 105" className="w-full h-full filter drop-shadow-lg">
      {/* Ground contact shadow */}
      <ellipse cx="67" cy="95" rx="55" ry="6" fill="rgba(0,0,0,0.4)" />

      {/* Rear Wheel with 3D tire rim */}
      <circle cx="32" cy="80" r="16" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
      <circle cx="32" cy="80" r="10" fill="#64748B" />
      <circle cx="32" cy="80" r="4" fill="#E2E8F0" />

      {/* Front Wheel with 3D tire rim */}
      <circle cx="102" cy="80" r="16" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
      <circle cx="102" cy="80" r="10" fill="#64748B" />
      <circle cx="102" cy="80" r="4" fill="#E2E8F0" />

      {/* Chassis & Bodywork (Vibrant Red with 3D sheen) */}
      <path
        d="M 32 80 L 52 78 L 70 65 L 92 74 L 102 80"
        fill="none"
        stroke="#DC2626"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M 68 65 L 84 38 L 94 38"
        fill="none"
        stroke="#EF4444"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Handlebar & 3D Headlight beam */}
      <rect x="88" y="34" width="16" height="5" rx="2.5" fill="#0F172A" />
      <circle cx="98" cy="48" r="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
      <path d="M 104 48 L 126 40 L 126 56 Z" fill="rgba(254,240,138,0.25)" />

      {/* 3D Delivery Cargo Trunk on back */}
      <rect
        x="22"
        y="42"
        width="30"
        height="28"
        rx="4"
        fill="url(#packageCraft3D)"
        stroke="#78350F"
        strokeWidth="1.5"
      />
      {/* Red Mache Yogann Tape on trunk */}
      <path d="M 22 56 L 52 56" stroke="#DC2626" strokeWidth="4" />
      <circle cx="37" cy="56" r="3" fill="#FEF08A" />

      {/* Courier Driver with Red Cap */}
      <ellipse cx="70" cy="52" rx="10" ry="16" fill="#DC2626" transform="rotate(-15 70 52)" />
      <circle cx="76" cy="30" r="9" fill="url(#tontonSkin3D)" />
      {/* Red Cap */}
      <path d="M 68 28 Q 78 18 86 28 L 94 30 Z" fill="#DC2626" />
      <path d="M 86 28 L 98 28" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

/* =========================================================================
   STORYBOARD SPECIFICATION (Total Duration: 66.5s — Perfect for 60-75s)
   ========================================================================= */

interface SceneData {
  id: number;
  titleHt: string;
  titleFr: string;
  subtitleHt: string;
  subtitleFr: string;
  badge: string;
  durationMs: number;
}

const STORY_SCENES: SceneData[] = [
  {
    id: 1,
    titleHt: 'Ou bezwen yon pwodwi?',
    titleFr: 'Vous cherchez un produit ?',
    subtitleHt: 'Ti tonton an ap gade telefòn li, li bezwen jwenn yon bon machandiz nan Leyogàn.',
    subtitleFr: 'Notre tonton consulte son téléphone, à la recherche de bons articles locaux.',
    badge: '1 • Pwoblèm nan',
    durationMs: 10000, // 10s
  },
  {
    id: 2,
    titleHt: 'Jwenn li sou Mache Yogann.',
    titleFr: 'Trouvez-le sur Mache Yogann.',
    subtitleHt: 'Ti fi a montre solisyon an : tout mache a, tout boutik yo disponib sou entènèt !',
    subtitleFr: 'La solution moderne : commerçants et artisans haïtiens réunis sur la plateforme !',
    badge: '2 • Dekouvèt la',
    durationMs: 10500, // 10.5s
  },
  {
    id: 3,
    titleHt: 'Chwazi sa w bezwen.',
    titleFr: 'Choisissez ce qu\'il vous faut.',
    subtitleHt: 'Manje lokal, rad, soulye, telefòn, epis... Klike sou pwodwi w vle a.',
    subtitleFr: 'Produits frais, mode, téléphones, livres... Sélectionnez votre article favori.',
    badge: '3 • Chwa pwodwi',
    durationMs: 11500, // 11.5s
  },
  {
    id: 4,
    titleHt: 'Achte fasil.',
    titleFr: 'Achetez en toute simplicité.',
    subtitleHt: 'Mete nan panyen, konfime kòmand ou epi peye ak MonCash, NatCash oswa Kripto.',
    subtitleFr: 'Ajoutez au panier et réglez en sécurité par MonCash, NatCash ou Crypto.',
    badge: '4 • Peman an sekirite',
    durationMs: 9500, // 9.5s
  },
  {
    id: 5,
    titleHt: 'Nou pran li bò kote vandè a... Nou livre li ba ou!',
    titleFr: 'Récupéré chez le vendeur... Livré chez vous !',
    subtitleHt: 'Ajan livrè Mache Yogann rekipere koli a epi livre l lakay ou an sekirite ak kòd PIN.',
    subtitleFr: 'Notre livreur récupère le colis et vous le remet en main propre en toute sécurité.',
    badge: '5 • Livrezon rapid',
    durationMs: 14000, // 14s
  },
  {
    id: 6,
    titleHt: 'Mache Yogann — Achte • Vann • Livre',
    titleFr: 'Mache Yogann — Acheter • Vendre • Livrer',
    subtitleHt: 'Kliyan an kontan, vandè a jwenn kòb li ! Tout moun genyen sou Mache Yogann 🇭🇹',
    subtitleFr: 'Client satisfait, vendeur récompensé ! Vive le commerce local en Haïti.',
    badge: '6 • Siksè & Jwa',
    durationMs: 11000, // 11s
  },
];

const TOTAL_LOOP_DURATION_MS = STORY_SCENES.reduce((sum, s) => sum + s.durationMs, 0); // 66500 ms (~66.5s)

/* =========================================================================
   MAIN 3D ANIMATED HERO STORY COMPONENT
   ========================================================================= */

export const HeroStoryAnimation: React.FC = () => {
  const { language, products, setSelectedProductForDetail } = useApp();
  const prefersReduced = useReducedMotion();

  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneElapsedMs, setSceneElapsedMs] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const activeScene = STORY_SCENES[currentSceneIdx];

  // Pick real products from existing database/seedData
  const sampleProducts = products.length >= 3 ? products.slice(0, 3) : products;

  // Natural eye-blinking interval for 3D realism
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Main high-precision animation loop with exact duration
  useEffect(() => {
    if (!isPlaying || prefersReduced) return;

    const intervalStep = 100; // update progress every 100ms
    const interval = setInterval(() => {
      setSceneElapsedMs((prev) => {
        const next = prev + intervalStep;
        if (next >= activeScene.durationMs) {
          // Advance to next scene seamlessly
          setCurrentSceneIdx((curr) => (curr + 1) % STORY_SCENES.length);
          return 0;
        }
        return next;
      });
    }, intervalStep);

    return () => clearInterval(interval);
  }, [currentSceneIdx, isPlaying, prefersReduced, activeScene.durationMs]);

  // Jump directly to specific scene
  const handleSelectScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    setSceneElapsedMs(0);
  };

  // Calculate global elapsed seconds for the runtime counter (e.g. 0:34 / 1:06)
  const elapsedPriorScenesMs = STORY_SCENES.slice(0, currentSceneIdx).reduce(
    (acc, s) => acc + s.durationMs,
    0
  );
  const totalElapsedSeconds = Math.floor((elapsedPriorScenesMs + sceneElapsedMs) / 1000);
  const totalDurationSeconds = Math.floor(TOTAL_LOOP_DURATION_MS / 1000);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden relative group">
      {/* 3D Global SVG Gradients & Filters */}
      <Svg3dFilters />

      {/* Cinematic Ambient Lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar: Badge + Time Counter + Scrubber Controls */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">
            {activeScene.badge}
          </span>
        </div>

        {/* Runtime Counter & Player Controls */}
        <div className="flex items-center gap-2">
          {/* Time Counter: 0:24 / 1:06 */}
          <span className="text-[11px] font-mono text-slate-400">
            {formatTime(totalElapsedSeconds)} / {formatTime(totalDurationSeconds)}
          </span>

          {/* Scene Selectors */}
          <div className="hidden sm:flex items-center gap-1">
            {STORY_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelectScene(idx)}
                title={language === 'ht' ? scene.titleHt : scene.titleFr}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSceneIdx === idx
                    ? 'w-6 bg-red-500 shadow-sm shadow-red-500/50'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pòz animasyon' : 'Jwe animasyon'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700/60 flex items-center gap-1 text-xs"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          3D CINEMATIC STAGE (Volumetric Shading, Ambient Occlusion, Perspective)
          ========================================================================= */}
      <div className="relative z-10 h-[225px] sm:h-[245px] w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/90 p-3 sm:p-4 overflow-hidden flex flex-col justify-between shadow-inner">
        {/* Stage Perspective Camera Motion */}
        <motion.div
          animate={{ scale: [1, 1.015, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full relative"
        >
          <AnimatePresence mode="wait">
            {/* -------------------------------------------------------------
                SCÈN 1: PWOBLÈM NAN (10s) — Tonton ap chèche pwodwi
                ------------------------------------------------------------- */}
            {currentSceneIdx === 0 && (
              <motion.div
                key="scene-1"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full flex items-center justify-around relative px-2"
              >
                {/* 3D Floating Thought Question Bubble */}
                <motion.div
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: [0, -6, 0], opacity: 1 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1 left-4 bg-slate-800/95 border-2 border-slate-700 rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2 text-xs text-amber-300"
                >
                  <Search size={14} className="text-amber-400 animate-pulse" />
                  <span className="font-bold text-[11px] font-['Outfit']">
                    Kote m ka jwenn sa?
                  </span>
                </motion.div>

                {/* 3D Character: Tonton searching with phone */}
                <motion.div
                  animate={{ y: [0, -3, 0], rotate: [-0.5, 0.5, -0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="mt-5"
                >
                  <TontonCharacter3D pose="searching" blinking={isBlinking} className="w-24 h-32" />
                </motion.div>

                {/* 3D Floating Idea Items with Volumetric Shading */}
                <div className="space-y-2.5 text-right">
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs text-slate-200 inline-flex items-center gap-2 shadow-lg hover:border-amber-400 transition-colors"
                  >
                    <span className="text-base">👟</span>
                    <span className="font-semibold text-[11px]">Soulye & Rad</span>
                  </motion.div>
                  <br />
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs text-slate-200 inline-flex items-center gap-2 shadow-lg hover:border-amber-400 transition-colors"
                  >
                    <span className="text-base">📱</span>
                    <span className="font-semibold text-[11px]">Telefòn & Batri</span>
                  </motion.div>
                  <br />
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.0, duration: 0.6 }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs text-slate-200 inline-flex items-center gap-2 shadow-lg hover:border-amber-400 transition-colors"
                  >
                    <span className="text-base">☕</span>
                    <span className="font-semibold text-[11px]">Kafe & Epis Lokal</span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                SCÈN 2: MACHE YOGANN (10.5s) — Ti fi a antre, montre solisyon an
                ------------------------------------------------------------- */}
            {currentSceneIdx === 1 && (
              <motion.div
                key="scene-2"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full flex items-center justify-between px-2"
              >
                {/* Tonton looking relieved and attentive */}
                <div className="mt-5">
                  <TontonCharacter3D pose="pointing" blinking={isBlinking} className="w-22 h-30" />
                </div>

                {/* Center: 3D Embossed Mache Yogann Badge */}
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: [1, 1.04, 1], opacity: 1 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-red-600 via-red-700 to-red-900 border-3 border-amber-400 shadow-2xl shadow-red-600/40 text-center"
                >
                  <div className="flex items-center gap-1.5 font-black text-white text-base sm:text-lg font-['Outfit']">
                    <span>Mache Yogann</span>
                    <span className="text-sm">🇭🇹</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest mt-0.5">
                    Marketplace Ayisyen
                  </span>
                  <div className="mt-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 border border-amber-400/40 text-[10px] text-amber-200 font-semibold">
                    <Sparkles size={12} className="text-amber-400" />
                    <span>Tout Boutik yo an Liy!</span>
                  </div>
                </motion.div>

                {/* Ti Fi Pointing with joy */}
                <motion.div
                  initial={{ x: 25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-6"
                >
                  <TifiCharacter3D pose="pointing" blinking={isBlinking} className="w-20 h-28" />
                </motion.div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                SCÈN 3: CHWAZI PWODWI (11.5s) — Pwodwi reyèl sou 3D Podiums
                ------------------------------------------------------------- */}
            {currentSceneIdx === 2 && (
              <motion.div
                key="scene-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="h-full flex items-center justify-between gap-3 px-1"
              >
                {/* Characters observing */}
                <div className="flex items-end -space-x-3 shrink-0">
                  <TontonCharacter3D pose="pointing" blinking={isBlinking} className="w-20 h-28" />
                  <TifiCharacter3D pose="excited" blinking={isBlinking} className="w-18 h-24" />
                </div>

                {/* 3 Real Marketplace Products on 3D Pedestals */}
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {sampleProducts.map((prod, idx) => {
                    const isSelected = idx === 1; // Middle one chosen
                    return (
                      <motion.div
                        key={prod.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: isSelected ? -4 : 0,
                          scale: isSelected ? 1.05 : 0.95,
                        }}
                        transition={{ delay: 0.3 + idx * 0.4, duration: 0.5 }}
                        onClick={() => setSelectedProductForDetail(prod)}
                        className={`relative rounded-2xl p-2 flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-2 border-amber-400 shadow-xl shadow-amber-400/20'
                            : 'bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800/90'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute -top-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md uppercase">
                            ✓ Chwazi!
                          </span>
                        )}
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-11 h-11 sm:w-13 sm:h-13 object-cover rounded-xl mb-1 shadow-md"
                          loading="lazy"
                        />
                        <span className="text-[10px] font-bold text-white line-clamp-1">
                          {prod.title}
                        </span>
                        <span className="text-[10px] font-mono font-black text-amber-400">
                          {prod.price} HTG
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                SCÈN 4: ACHTE FASIL (9.5s) — Pwodwi antre nan 3D Shopping Cart
                ------------------------------------------------------------- */}
            {currentSceneIdx === 3 && (
              <motion.div
                key="scene-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="h-full flex items-center justify-around px-2"
              >
                {/* 3D Product item flying with smooth parabolic curve */}
                <motion.div
                  initial={{ x: -40, y: -25, scale: 0.7, opacity: 0 }}
                  animate={{ x: 25, y: 15, scale: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-amber-400 p-1 flex items-center justify-center shadow-xl"
                >
                  <img
                    src={sampleProducts[1]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                    alt="Pwodwi"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.div>

                {/* 3D Metallic Shopping Cart */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
                  className="relative flex flex-col items-center justify-center p-3.5 rounded-3xl bg-emerald-950/70 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/30"
                >
                  <div className="relative">
                    <ShoppingBag size={38} className="text-emerald-400" />
                    {/* 3D Badge Count: 1 */}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring', stiffness: 260 }}
                      className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-red-600 text-white font-black text-xs rounded-full flex items-center justify-center shadow-lg border border-white/80"
                    >
                      1
                    </motion.span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-emerald-300 text-[11px] font-bold">
                    <Check size={13} className="stroke-[3]" />
                    <span>Kòmand Konfime</span>
                  </div>
                </motion.div>

                {/* Authentic Haitian Payment Methods MonCash & NatCash */}
                <div className="space-y-2 text-center">
                  <div className="px-3 py-1 rounded-xl bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-black shadow-md">
                    MonCash (+509)
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-blue-600/30 border border-blue-500 text-blue-300 text-[10px] font-black shadow-md">
                    NatCash (+509)
                  </div>
                  <div className="px-3 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[9px] font-mono">
                    USDT / Crypto
                  </div>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                SCÈN 5: LIVREZON (14s) — 3 Pozisyon: Vandè ➔ Ajan ➔ Kliyan
                ------------------------------------------------------------- */}
            {currentSceneIdx === 4 && (
              <motion.div
                key="scene-5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                className="h-full flex flex-col justify-center space-y-3 px-1"
              >
                {/* 3 Physical Stages: Vandè ➔ Ajan Livrè (Moto) ➔ Kliyan */}
                <div className="flex items-center justify-between relative py-2">
                  {/* 1. Vandè Shop */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
                      <Store size={22} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200 mt-1">1. Vandè Lokal</span>
                  </div>

                  {/* Dynamic Motion Line & Moving Parcel */}
                  <div className="flex-1 relative flex items-center justify-center px-2">
                    <div className="w-full h-1 bg-slate-700 rounded-full relative overflow-hidden">
                      <motion.div
                        animate={{ x: [-40, 40, -40] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-full w-8 bg-red-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* 2. Ajan Livrè Mache Yogann on 3D Scooter */}
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      animate={{ y: [-1, 2, -1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <DeliveryAgent3D className="w-16 h-12" />
                    </motion.div>
                    <span className="text-[10px] font-black text-red-400 mt-0.5">2. Ajan Livrè</span>
                  </div>

                  {/* Delivery Arrow */}
                  <div className="flex-1 relative flex items-center justify-center px-2">
                    <div className="w-full h-1 bg-slate-700 rounded-full relative">
                      <ArrowRight size={14} className="text-emerald-400 absolute -top-1.5 right-0 animate-pulse" />
                    </div>
                  </div>

                  {/* 3. Kliyan Lakay */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg">
                      <Truck size={22} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200 mt-1">3. Kliyan Lakay</span>
                  </div>
                </div>

                {/* 3D Security Code Verification Pill */}
                <div className="p-2 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[11px] font-semibold">Kòd Sekirite Livrezon:</span>
                  </div>
                  <span className="font-mono font-black text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                    #MY-8492 ✓ Sekirize
                  </span>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                SCÈN 6: FINAL & SIKSÈ (11s) — Tonton & Ti fi kontan, Logo
                ------------------------------------------------------------- */}
            {currentSceneIdx === 5 && (
              <motion.div
                key="scene-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="h-full flex items-center justify-between px-2"
              >
                {/* Tonton happily holding his package */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative mt-3"
                >
                  <TontonCharacter3D pose="happy" blinking={isBlinking} className="w-22 h-30" />
                  <Sparkles size={16} className="text-amber-400 absolute -top-2 right-0 animate-spin" style={{ animationDuration: '8s' }} />
                </motion.div>

                {/* Grand Brand Finale */}
                <div className="flex-1 text-center px-2">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-red-400 mb-0.5">
                    <Heart size={13} className="text-red-500 fill-red-500" />
                    <span>Misyon Akonpli !</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] tracking-tight">
                    Mache Yogann
                  </h4>
                  <div className="inline-block mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/30 via-amber-500/30 to-emerald-500/30 border border-amber-400/50 text-amber-300 font-black text-xs tracking-wide">
                    Achte • Vann • Livre
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Leyogàn & tout Ayiti 🇭🇹
                  </p>
                </div>

                {/* Ti Fi smiling and cheering */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="mt-4"
                >
                  <TifiCharacter3D pose="happy" blinking={isBlinking} className="w-20 h-28" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Realtime Smooth Scene Progress Bar */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-1">
          <div
            style={{
              width: `${(sceneElapsedMs / activeScene.durationMs) * 100}%`,
              transition: isPlaying ? 'width 100ms linear' : 'none',
            }}
            className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-400"
          />
        </div>
      </div>

      {/* =========================================================================
          BOTTOM CAPTION: Story Text (Clear, Highly Legible, Haitian Creole & French)
          ========================================================================= */}
      <div className="mt-3 text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={`caption-${activeScene.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-sm font-black text-white font-['Outfit'] flex items-center gap-1.5">
              <span>{language === 'ht' ? activeScene.titleHt : activeScene.titleFr}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {language === 'ht' ? activeScene.subtitleHt : activeScene.subtitleFr}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
