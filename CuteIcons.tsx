import React from "react";
import type { TaskCategory } from "../types/butter";

interface IconProps {
  className?: string;
  active?: boolean;
}

/* BETTER Logo: cute pastel pebble companion with a gentle sprout & sparkle */
export const BetterLogoIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <ellipse cx="32" cy="53" rx="18" ry="4.5" fill="#C9E0D0" opacity="0.55" />
    {/* Soft leaf sprout on top */}
    <path d="M32 18V12" stroke="#4D7C5D" strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M32 14.5C27 14.5 23.5 11.2 24.5 7.5C28.5 7.5 32 10.2 32 14.5Z"
      fill="#B8DEC4"
      stroke="#3D3832"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path
      d="M32 13.5C37 13.5 40.5 10.2 39.5 6.5C35.5 6.5 32 9.2 32 13.5Z"
      fill="#9BC8AA"
      stroke="#3D3832"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    {/* Soft matte pastel rounded cloud-pebble body */}
    <path
      d="M14 34C14 23.5 21.5 17.5 32 17.5C42.5 17.5 50 23.5 50 34C50 43.5 43.5 49.5 32 49.5C20.5 49.5 14 43.5 14 34Z"
      fill="#FDF1C7"
      stroke="#3D3832"
      strokeWidth="2.3"
      strokeLinejoin="round"
    />
    {/* Subtle soft glass highlight */}
    <path d="M21 24.5C23.5 22.5 26.5 21.8 29.5 21.8" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
    {/* Cute friendly face */}
    <circle cx="25.5" cy="34" r="2.1" fill="#3D3832" />
    <circle cx="38.5" cy="34" r="2.1" fill="#3D3832" />
    <path
      d="M29 38C30.6 39.8 33.4 39.8 35 38"
      stroke="#3D3832"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
    <ellipse cx="21" cy="37" rx="2.7" ry="1.6" fill="#F4A7B9" opacity="0.72" />
    <ellipse cx="43" cy="37" rx="2.7" ry="1.6" fill="#F4A7B9" opacity="0.72" />
    {/* Tiny sparkle */}
    <path
      d="M52 17L53 19.6L55.6 20.6L53 21.6L52 24.2L51 21.6L48.4 20.6L51 19.6L52 17Z"
      fill="#DCEEF8"
      stroke="#3D3832"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/* Home: tiny cute house with a small plant */
export const HomeIcon: React.FC<IconProps> = ({ className = "w-6 h-6", active }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M5.5 14.5L16 5.5L26.5 14.5V25C26.5 26.3807 25.3807 27.5 24 27.5H8C6.61929 27.5 5.5 26.3807 5.5 25V14.5Z"
      fill={active ? "#FDF1C7" : "#F6F3EC"}
      stroke="#3D3832"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 15.2L16 4.5L28.5 15.2"
      stroke="#3D3832"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="11" y="18" width="6.5" height="9.5" rx="3.2" fill="#DCEEF8" stroke="#3D3832" strokeWidth="1.6" />
    {/* Tiny plant beside the door */}
    <path d="M22.5 27.5V23.5" stroke="#4D7C5D" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M22.5 24C20.5 24 19.5 22.5 19.8 21C21.5 21 22.5 22.2 22.5 24Z" fill="#9BC8AA" stroke="#3D3832" strokeWidth="1.3" />
    <path d="M22.5 23.5C24.5 23.5 25.5 22 25.2 20.5C23.5 20.5 22.5 21.7 22.5 23.5Z" fill="#B8DEC4" stroke="#3D3832" strokeWidth="1.3" />
  </svg>
);

/* Planner: cute rounded calendar */
export const PlannerIcon: React.FC<IconProps> = ({ className = "w-6 h-6", active }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect
      x="5"
      y="7"
      width="22"
      height="20"
      rx="5.5"
      fill={active ? "#DCEEF8" : "#F6F3EC"}
      stroke="#3D3832"
      strokeWidth="1.9"
    />
    <path
      d="M5 12.5C5 9.46243 7.46243 7 10.5 7H21.5C24.5376 7 27 9.46243 27 12.5V14H5V12.5Z"
      fill="#FCE6EC"
      stroke="#3D3832"
      strokeWidth="1.9"
    />
    <path d="M11 4.8V8.5M21 4.8V8.5" stroke="#3D3832" strokeWidth="2" strokeLinecap="round" />
    <circle cx="11" cy="18.5" r="1.4" fill="#3D3832" />
    <circle cx="16" cy="18.5" r="1.4" fill="#3D3832" />
    <circle cx="21" cy="18.5" r="1.4" fill="#3D3832" />
    <circle cx="11" cy="23" r="1.4" fill="#3D3832" />
    <circle cx="16" cy="23" r="2" fill="#E8BE4B" />
  </svg>
);

/* Notes: small paper with a heart */
export const NotesIcon: React.FC<IconProps> = ({ className = "w-6 h-6", active }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M7.5 6.5C7.5 5.11929 8.61929 4 10 4H19.5L24.5 9V25.5C24.5 26.8807 23.3807 28 22 28H10C8.61929 28 7.5 26.8807 7.5 25.5V6.5Z"
      fill={active ? "#EAE4F7" : "#F6F3EC"}
      stroke="#3D3832"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path d="M19.5 4V9H24.5" stroke="#3D3832" strokeWidth="1.8" strokeLinejoin="round" />
    <path
      d="M16 20.8C16 20.8 11.8 18.2 11.8 15.3C11.8 13.8 12.9 12.8 14.2 12.8C15.1 12.8 15.7 13.3 16 14C16.3 13.3 16.9 12.8 17.8 12.8C19.1 12.8 20.2 13.8 20.2 15.3C20.2 18.2 16 20.8 16 20.8Z"
      fill="#F3A6BD"
      stroke="#3D3832"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

/* Avatar / Me: cute character icon */
export const AvatarNavIcon: React.FC<IconProps> = ({ className = "w-6 h-6", active }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle
      cx="16"
      cy="12"
      r="5.5"
      fill={active ? "#FCE6EC" : "#F6F3EC"}
      stroke="#3D3832"
      strokeWidth="1.9"
    />
    <path
      d="M7 26.5C7 21.8 11 19 16 19C21 19 25 21.8 25 26.5"
      fill={active ? "#DCECE1" : "#F6F3EC"}
      stroke="#3D3832"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <circle cx="14.2" cy="11.8" r="1" fill="#3D3832" />
    <circle cx="17.8" cy="11.8" r="1" fill="#3D3832" />
    <path d="M14.7 14C15.4 14.7 16.6 14.7 17.3 14" stroke="#3D3832" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/* Shopping: cute shopping bag */
export const ShoppingIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M11.5 11V8.8C11.5 6.4 13.4 4.5 16 4.5C18.6 4.5 20.5 6.4 20.5 8.8V11"
      stroke="#3D3832"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M6.8 11H25.2L26.5 25C26.7 26.6 25.4 28 23.8 28H8.2C6.6 28 5.3 26.6 5.5 25L6.8 11Z"
      fill="#FDF1C7"
      stroke="#3D3832"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="15" r="1.2" fill="#3D3832" />
    <circle cx="20" cy="15" r="1.2" fill="#3D3832" />
  </svg>
);

/* Money: small wallet */
export const MoneyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="4.5" y="9" width="23" height="16.5" rx="4.5" fill="#DCECE1" stroke="#3D3832" strokeWidth="1.9" />
    <path d="M8 9L19.5 5.5C20.8 5.1 22 6 22.3 7.3L22.8 9" fill="#FBE28A" stroke="#3D3832" strokeWidth="1.8" />
    <rect x="19" y="14.5" width="9" height="5.5" rx="2.75" fill="#FFFDF8" stroke="#3D3832" strokeWidth="1.7" />
    <circle cx="22.3" cy="17.25" r="1.2" fill="#3D3832" />
  </svg>
);

/* Reminder: cute rounded alarm clock */
export const ReminderIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M6.5 8.5L9.5 5.5M25.5 8.5L22.5 5.5" stroke="#3D3832" strokeWidth="2.1" strokeLinecap="round" />
    <circle cx="16" cy="17" r="9.5" fill="#FCE6EC" stroke="#3D3832" strokeWidth="1.9" />
    <circle cx="16" cy="17" r="6.8" fill="#FFFDF9" />
    <path d="M16 12.8V17.2L19 19" stroke="#3D3832" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 25L8 27.5M22 25L24 27.5" stroke="#3D3832" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

/* AI: small magic wand with sparkles */
export const MagicWandIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M6.5 25.5L18.5 13.5" stroke="#3D3832" strokeWidth="2.6" strokeLinecap="round" />
    <path
      d="M21 6.5L22.4 10.1L26 11.5L22.4 12.9L21 16.5L19.6 12.9L16 11.5L19.6 10.1L21 6.5Z"
      fill="#FBE28A"
      stroke="#3D3832"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 7.5L11.2 9.3L13 10L11.2 10.7L10.5 12.5L9.8 10.7L8 10L9.8 9.3L10.5 7.5Z"
      fill="#EAE4F7"
      stroke="#3D3832"
      strokeWidth="1.2"
    />
    <circle cx="24.5" cy="20.5" r="1.4" fill="#F3A6BD" />
  </svg>
);

/* Self-care: tiny plant */
export const SelfCareIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M10.5 19H21.5L20 27H12L10.5 19Z" fill="#FCE6EC" stroke="#3D3832" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M16 19V12" stroke="#4D7C5D" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M16 14.5C12.2 14.5 9.5 11.8 10 8.5C13.5 8.5 16 10.8 16 14.5Z"
      fill="#B8DEC4"
      stroke="#3D3832"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M16 13.2C19.8 13.2 22.5 10.5 22 7.2C18.5 7.2 16 9.5 16 13.2Z"
      fill="#9BC8AA"
      stroke="#3D3832"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const SchoolIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="6.5" y="7.5" width="19" height="17" rx="3.5" fill="#DCEEF8" stroke="#3D3832" strokeWidth="1.8" />
    <path d="M16 7.5V24.5" stroke="#3D3832" strokeWidth="1.7" />
    <path d="M9.5 12H13M9.5 15.5H13M19 12H22.5M19 15.5H22.5" stroke="#3D3832" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M8.5 20.5L20.5 8.5C21.5 7.5 23 7.5 24 8.5C25 9.5 25 11 24 12L12 24L7 25.5L8.5 20.5Z"
      fill="#EAE4F7"
      stroke="#3D3832"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M18.5 10.5L22 14" stroke="#3D3832" strokeWidth="1.7" />
  </svg>
);

export const GiftIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="6" y="12" width="20" height="14.5" rx="3" fill="#FCE6EC" stroke="#3D3832" strokeWidth="1.8" />
    <rect x="5" y="10" width="22" height="4.5" rx="2" fill="#FDF1C7" stroke="#3D3832" strokeWidth="1.8" />
    <path d="M16 10V26.5" stroke="#3D3832" strokeWidth="1.8" />
    <path d="M16 10C13.5 10 11.5 8.5 12 6.8C12.5 5.3 14.8 6.2 16 10Z" fill="#F3A6BD" stroke="#3D3832" strokeWidth="1.5" />
    <path d="M16 10C18.5 10 20.5 8.5 20 6.8C19.5 5.3 17.2 6.2 16 10Z" fill="#F3A6BD" stroke="#3D3832" strokeWidth="1.5" />
  </svg>
);

export const FoodIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 18C7 13 11 9.5 16 9.5C21 9.5 25 13 25 18C25 21 22.5 23 19.5 23H12.5C9.5 23 7 21 7 18Z"
      fill="#FBE28A"
      stroke="#3D3832"
      strokeWidth="1.8"
    />
    <path d="M12.5 11.5L13.5 17.5M19.5 11.5L18.5 17.5" stroke="#3D3832" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* Goals: small target with stars */
export const GoalsIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="15" cy="17" r="9.5" fill="#FCE6EC" stroke="#3D3832" strokeWidth="1.8" />
    <circle cx="15" cy="17" r="5.5" fill="#FFFDF9" stroke="#3D3832" strokeWidth="1.6" />
    <circle cx="15" cy="17" r="2.2" fill="#FBE28A" stroke="#3D3832" strokeWidth="1.3" />
    <path
      d="M24.5 5.5L25.4 7.7L27.6 8.6L25.4 9.5L24.5 11.7L23.6 9.5L21.4 8.6L23.6 7.7L24.5 5.5Z"
      fill="#FBE28A"
      stroke="#3D3832"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

/* Memories: tiny photo frame */
export const MemoryIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="5" y="6" width="22" height="20" rx="4.5" fill="#FFFDF9" stroke="#3D3832" strokeWidth="1.9" />
    <rect x="8.2" y="9.2" width="15.6" height="11" rx="2.2" fill="#DCEEF8" stroke="#3D3832" strokeWidth="1.5" />
    <circle cx="12" cy="13" r="1.8" fill="#FBE28A" />
    <path d="M9 19.5L13.5 15.2L17 18.2L20 15.8L23 19.5" fill="#B8DEC4" stroke="#3D3832" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/* Weather: cute cloud and sun */
export const WeatherIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="21" cy="11.5" r="4.5" fill="#FBE28A" stroke="#3D3832" strokeWidth="1.7" />
    <path
      d="M11 23.5H22C24.5 23.5 26.5 21.7 26.5 19.3C26.5 17.1 24.8 15.3 22.7 15.1C22 12.1 19.3 10 16.1 10C12.5 10 9.6 12.7 9.4 16.2C7.4 16.7 6 18.4 6 20.5C6 22.2 7.5 23.5 11 23.5Z"
      fill="#FFFDF9"
      stroke="#3D3832"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const CategoryIcon: React.FC<{ category: TaskCategory; className?: string }> = ({
  category,
  className = "w-6 h-6",
}) => {
  switch (category) {
    case "school":
      return <SchoolIcon className={className} />;
    case "homework":
      return <PencilIcon className={className} />;
    case "shopping":
      return <ShoppingIcon className={className} />;
    case "food":
      return <FoodIcon className={className} />;
    case "selfcare":
      return <SelfCareIcon className={className} />;
    case "errand":
      return <GiftIcon className={className} />;
    case "money":
      return <MoneyIcon className={className} />;
    default:
      return <NotesIcon className={className} />;
  }
};
