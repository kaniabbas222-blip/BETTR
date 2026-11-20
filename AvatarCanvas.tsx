import React from "react";
import type { AvatarConfig } from "../types/butter";

export type AvatarMood =
  | "relaxing"
  | "studying"
  | "shopping"
  | "celebrating"
  | "music"
  | "selfcare";

interface AvatarCanvasProps {
  config: AvatarConfig;
  mood?: AvatarMood;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  config,
  mood = "relaxing",
  animated = true,
  size = "lg",
  className = "",
}) => {
  const {
    style,
    skinTone,
    hairStyle,
    hairColor,
    topStyle,
    topColor,
    bottomStyle,
    bottomColor,
    dressStyle,
    dressColor,
    jacketStyle,
    shoeStyle,
    glasses,
    hat,
    bag,
    headphones,
    smallAcc,
  } = config;

  const sizeClass =
    size === "sm"
      ? "w-16 h-16"
      : size === "md"
        ? "w-32 h-32"
        : "w-48 h-52 sm:w-52 sm:h-56";

  const animClass = !animated
    ? ""
    : mood === "celebrating"
      ? "animate-celebrate-hop"
      : "animate-float-gentle";

  const torsoWidth = style === "round" ? 56 : style === "slender" ? 44 : 50;
  const torsoX = 100 - torsoWidth / 2;
  const headRx = style === "round" ? 31 : style === "slender" ? 27 : 29;
  const headRy = style === "round" ? 29 : 30;

  const jacketFill =
    jacketStyle === "denim"
      ? "#7A9BB8"
      : jacketStyle === "trench"
        ? "#DFC9A6"
        : jacketStyle === "varsity"
          ? "#5C7868"
          : "none";

  const shoeFill =
    shoeStyle === "sneakers"
      ? "#FFFFFF"
      : shoeStyle === "maryjanes"
        ? "#4B3B38"
        : shoeStyle === "boots"
          ? "#7C563E"
          : "#5B544F";

  const showHeadphones = headphones === "pastel" || mood === "music";

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClass} ${animClass} ${className}`}>
      <svg viewBox="0 0 200 220" fill="none" className="w-full h-full overflow-visible" aria-label={`${config.name || "Your"} avatar`}>
        <ellipse cx="100" cy="204" rx="44" ry="8" fill="#2A2724" opacity="0.09" />

        {hairStyle === "wavy" && (
          <path
            d="M62 66C52 88 54 126 64 140C72 148 128 148 136 140C146 126 148 88 138 66C130 44 70 44 62 66Z"
            fill={hairColor}
            stroke="#322A25"
            strokeWidth="2.4"
          />
        )}
        {hairStyle === "bob" && (
          <path
            d="M66 64C60 80 60 106 70 112H130C140 106 140 80 134 64C126 42 74 42 66 64Z"
            fill={hairColor}
            stroke="#322A25"
            strokeWidth="2.4"
          />
        )}
        {hairStyle === "braids" && (
          <g>
            <rect x="61" y="84" width="12" height="52" rx="6" fill={hairColor} stroke="#322A25" strokeWidth="2.2" />
            <rect x="127" y="84" width="12" height="52" rx="6" fill={hairColor} stroke="#322A25" strokeWidth="2.2" />
            <circle cx="67" cy="136" r="4" fill="#F4A7B9" stroke="#322A25" strokeWidth="1.6" />
            <circle cx="133" cy="136" r="4" fill="#F4A7B9" stroke="#322A25" strokeWidth="1.6" />
          </g>
        )}
        {hairStyle === "buns" && (
          <g>
            <circle cx="66" cy="42" r="14" fill={hairColor} stroke="#322A25" strokeWidth="2.4" />
            <circle cx="134" cy="42" r="14" fill={hairColor} stroke="#322A25" strokeWidth="2.4" />
          </g>
        )}
        {hairStyle === "curly" && (
          <g fill={hairColor} stroke="#322A25" strokeWidth="2.2">
            <circle cx="66" cy="54" r="16" />
            <circle cx="134" cy="54" r="16" />
            <circle cx="100" cy="38" r="18" />
            <circle cx="78" cy="40" r="15" />
            <circle cx="122" cy="40" r="15" />
          </g>
        )}

        {bag === "backpack" && (
          <rect x="64" y="108" width="72" height="52" rx="14" fill="#A5C9B1" stroke="#322A25" strokeWidth="2.4" />
        )}

        {dressStyle === "none" ? (
          <g>
            {bottomStyle === "skirt" ? (
              <>
                <rect x="82" y="158" width="13" height="32" rx="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
                <rect x="105" y="158" width="13" height="32" rx="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
                <path
                  d={`M${torsoX} 145H${torsoX + torsoWidth}L${torsoX + torsoWidth + 10} 174C${torsoX + torsoWidth + 10} 177 ${torsoX - 10} 177 ${torsoX - 10} 174L${torsoX} 145Z`}
                  fill={bottomColor}
                  stroke="#322A25"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
              </>
            ) : bottomStyle === "shorts" ? (
              <>
                <rect x="82" y="156" width="13" height="34" rx="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
                <rect x="105" y="156" width="13" height="34" rx="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
                <path
                  d={`M${torsoX} 144H${torsoX + torsoWidth}L${torsoX + torsoWidth + 3} 166H104L100 156L96 166H${torsoX - 3}L${torsoX} 144Z`}
                  fill={bottomColor}
                  stroke="#322A25"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <>
                <path
                  d={`M${torsoX} 144H${torsoX + torsoWidth}L${torsoX + torsoWidth - 2} 190H105L100 162L95 190H${torsoX + 2}L${torsoX} 144Z`}
                  fill={bottomColor}
                  stroke="#322A25"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                {bottomStyle === "joggers" && (
                  <>
                    <rect x={torsoX + 1} y="183" width="17" height="6" rx="3" fill="#FFFFFF" opacity="0.55" />
                    <rect x={torsoX + torsoWidth - 18} y="183" width="17" height="6" rx="3" fill="#FFFFFF" opacity="0.55" />
                  </>
                )}
              </>
            )}
          </g>
        ) : (
          <g>
            <rect x="83" y="162" width="12" height="28" rx="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
            <rect x="105" y="162" width="12" height="28" rx="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
          </g>
        )}

        <g>
          <path d="M76 192C76 187 82 185 89 185C94 185 96 188 96 193C96 197 92 199 86 199C80 199 76 197 76 192Z" fill={shoeFill} stroke="#322A25" strokeWidth="2.2" />
          <path d="M104 193C104 188 106 185 111 185C118 185 124 187 124 192C124 197 120 199 114 199C108 199 104 197 104 193Z" fill={shoeFill} stroke="#322A25" strokeWidth="2.2" />
          {shoeStyle === "sneakers" && (
            <>
              <path d="M77 195H95" stroke="#D7CEBE" strokeWidth="2" />
              <path d="M105 195H123" stroke="#D7CEBE" strokeWidth="2" />
            </>
          )}
        </g>

        <g>
          <path
            d={
              mood === "celebrating"
                ? `M${torsoX + 4} 108C${torsoX - 16} 96 ${torsoX - 18} 78 ${torsoX - 10} 72`
                : `M${torsoX + 4} 108C${torsoX - 12} 118 ${torsoX - 12} 138 ${torsoX - 4} 144`
            }
            stroke={skinTone}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={
              mood === "celebrating"
                ? `M${torsoX + 4} 108C${torsoX - 16} 96 ${torsoX - 18} 78 ${torsoX - 10} 72`
                : `M${torsoX + 4} 108C${torsoX - 12} 118 ${torsoX - 12} 138 ${torsoX - 4} 144`
            }
            stroke="#322A25"
            strokeWidth="2.3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={
              mood === "celebrating"
                ? `M${torsoX + torsoWidth - 4} 108C${torsoX + torsoWidth + 16} 96 ${torsoX + torsoWidth + 18} 78 ${torsoX + torsoWidth + 10} 72`
                : `M${torsoX + torsoWidth - 4} 108C${torsoX + torsoWidth + 12} 118 ${torsoX + torsoWidth + 12} 138 ${torsoX + torsoWidth + 4} 144`
            }
            stroke={skinTone}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d={
              mood === "celebrating"
                ? `M${torsoX + torsoWidth - 4} 108C${torsoX + torsoWidth + 16} 96 ${torsoX + torsoWidth + 18} 78 ${torsoX + torsoWidth + 10} 72`
                : `M${torsoX + torsoWidth - 4} 108C${torsoX + torsoWidth + 12} 118 ${torsoX + torsoWidth + 12} 138 ${torsoX + torsoWidth + 4} 144`
            }
            stroke="#322A25"
            strokeWidth="2.3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {dressStyle !== "none" ? (
          <g>
            {dressStyle === "pinafore" && (
              <rect
                x={torsoX}
                y="98"
                width={torsoWidth}
                height="42"
                rx="14"
                fill={topColor}
                stroke="#322A25"
                strokeWidth="2.3"
              />
            )}
            <path
              d={`M${torsoX + 4} 102H${torsoX + torsoWidth - 4}L${torsoX + torsoWidth + 12} 174C${torsoX + torsoWidth + 12} 178 ${torsoX - 12} 178 ${torsoX - 12} 174L${torsoX + 4} 102Z`}
              fill={dressColor}
              stroke="#322A25"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {dressStyle === "sundress" && (
              <path d={`M${torsoX + 6} 126H${torsoX + torsoWidth - 6}`} stroke="#FFFFFF" strokeWidth="2.5" opacity="0.55" />
            )}
          </g>
        ) : (
          <g>
            <rect
              x={torsoX}
              y="98"
              width={torsoWidth}
              height="52"
              rx="16"
              fill={topColor}
              stroke="#322A25"
              strokeWidth="2.4"
            />
            {topStyle === "hoodie" && (
              <>
                <path d="M84 100C88 109 112 109 116 100" stroke="#322A25" strokeWidth="2.2" fill="none" />
                <rect x="84" y="128" width="32" height="16" rx="6" fill="#FFFFFF" opacity="0.32" stroke="#322A25" strokeWidth="1.6" />
              </>
            )}
            {topStyle === "cardigan" && (
              <g>
                <path d="M100 100V150" stroke="#322A25" strokeWidth="2" />
                <circle cx="95" cy="116" r="1.8" fill="#322A25" />
                <circle cx="95" cy="128" r="1.8" fill="#322A25" />
                <circle cx="95" cy="140" r="1.8" fill="#322A25" />
              </g>
            )}
            {topStyle === "overalls" && (
              <g>
                <rect x={torsoX + 6} y="100" width="7" height="22" fill={bottomColor} stroke="#322A25" strokeWidth="1.8" />
                <rect x={torsoX + torsoWidth - 13} y="100" width="7" height="22" fill={bottomColor} stroke="#322A25" strokeWidth="1.8" />
                <rect x={torsoX + 4} y="118" width={torsoWidth - 8} height="30" rx="6" fill={bottomColor} stroke="#322A25" strokeWidth="2" />
              </g>
            )}
            {topStyle === "sweater" && (
              <path d={`M${torsoX + 8} 102Q100 110 ${torsoX + torsoWidth - 8} 102`} stroke="#322A25" strokeWidth="2" fill="none" />
            )}
          </g>
        )}

        {jacketStyle !== "none" && (
          <g>
            <path
              d={`M${torsoX - 2} 100H88V150H${torsoX - 2}C${torsoX - 6} 150 ${torsoX - 6} 100 ${torsoX - 2} 100Z`}
              fill={jacketFill}
              stroke="#322A25"
              strokeWidth="2.3"
            />
            <path
              d={`M112 100H${torsoX + torsoWidth + 2}C${torsoX + torsoWidth + 6} 100 ${torsoX + torsoWidth + 6} 150 ${torsoX + torsoWidth + 2} 150H112V100Z`}
              fill={jacketFill}
              stroke="#322A25"
              strokeWidth="2.3"
            />
            {jacketStyle === "varsity" && (
              <circle cx="80" cy="116" r="4" fill="#FBE28A" stroke="#322A25" strokeWidth="1.4" />
            )}
          </g>
        )}

        {smallAcc === "scarf" && (
          <g>
            <rect x="80" y="92" width="40" height="12" rx="6" fill="#F4B6C7" stroke="#322A25" strokeWidth="2" />
            <rect x="103" y="98" width="11" height="22" rx="4" fill="#F4B6C7" stroke="#322A25" strokeWidth="2" />
          </g>
        )}

        {bag === "crossbody" && (
          <g>
            <path d={`M${torsoX + 4} 102L${torsoX + torsoWidth - 2} 144`} stroke="#5C4924" strokeWidth="3.5" strokeLinecap="round" />
            <rect x={torsoX + torsoWidth - 10} y="136" width="20" height="18" rx="5" fill="#FBE28A" stroke="#322A25" strokeWidth="2.1" />
          </g>
        )}

        {(bag === "tote" || mood === "shopping") && (
          <g>
            <path d={`M${torsoX - 18} 136C${torsoX - 18} 127 ${torsoX - 8} 127 ${torsoX - 8} 136`} stroke="#322A25" strokeWidth="2.1" fill="none" />
            <rect
              x={torsoX - 24}
              y="136"
              width="22"
              height="24"
              rx="4"
              fill={mood === "shopping" ? "#FDF1C7" : "#DCECE1"}
              stroke="#322A25"
              strokeWidth="2.1"
            />
            {mood === "shopping" && (
              <path d={`M${torsoX - 17} 148H${torsoX - 9}`} stroke="#B58618" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
        )}

        {mood === "studying" && (
          <g transform="translate(114, 124)">
            <rect x="0" y="4" width="28" height="22" rx="4" fill="#DCEEF8" stroke="#322A25" strokeWidth="2.1" />
            <path d="M14 4V26" stroke="#322A25" strokeWidth="1.8" />
            <path d="M4 10H10M4 15H10M18 10H24M18 15H24" stroke="#322A25" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        )}

        {mood === "selfcare" && (
          <g transform="translate(120, 122)">
            <path d="M4 16H18L16 26H6L4 16Z" fill="#FCE6EC" stroke="#322A25" strokeWidth="1.8" />
            <path d="M11 16V7" stroke="#4D7C5D" strokeWidth="2" strokeLinecap="round" />
            <circle cx="7" cy="9" r="4" fill="#9BC8AA" stroke="#322A25" strokeWidth="1.5" />
            <circle cx="15" cy="8" r="4" fill="#B8DEC4" stroke="#322A25" strokeWidth="1.5" />
          </g>
        )}

        <rect x="92" y="88" width="16" height="14" rx="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
        <circle cx={100 - headRx} cy="70" r="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
        <circle cx={100 + headRx} cy="70" r="6" fill={skinTone} stroke="#322A25" strokeWidth="2.2" />
        <ellipse cx="100" cy="68" rx={headRx} ry={headRy} fill={skinTone} stroke="#322A25" strokeWidth="2.4" />

        {(smallAcc === "blush" || smallAcc === "starpin") && (
          <>
            <ellipse cx="81" cy="76" rx="5.2" ry="2.8" fill="#F4A7B9" opacity="0.65" />
            <ellipse cx="119" cy="76" rx="5.2" ry="2.8" fill="#F4A7B9" opacity="0.65" />
          </>
        )}
        {smallAcc === "freckles" && (
          <g fill="#A86B4C" opacity="0.7">
            <circle cx="80" cy="74" r="1.1" />
            <circle cx="84" cy="76" r="1.1" />
            <circle cx="78" cy="77" r="1.1" />
            <circle cx="120" cy="74" r="1.1" />
            <circle cx="116" cy="76" r="1.1" />
            <circle cx="122" cy="77" r="1.1" />
          </g>
        )}

        {mood === "celebrating" ? (
          <>
            <path d="M84 68C86 64 90 64 92 68" stroke="#322A25" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M108 68C110 64 114 64 116 68" stroke="#322A25" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M93 77C96 82 104 82 107 77Z" fill="#F294A8" stroke="#322A25" strokeWidth="2" />
          </>
        ) : (
          <>
            <circle cx="88" cy="68" r="3" fill="#322A25" />
            <circle cx="112" cy="68" r="3" fill="#322A25" />
            <circle cx="89" cy="67" r="1" fill="#FFFFFF" />
            <circle cx="113" cy="67" r="1" fill="#FFFFFF" />
            <path
              d={mood === "relaxing" || mood === "music" ? "M94 78C97 80.5 103 80.5 106 78" : "M95 78C98 80 102 80 105 78"}
              stroke="#322A25"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        )}

        {hairStyle === "short" && (
          <path d="M70 62C70 40 130 40 130 62C125 50 112 49 100 52C88 49 75 50 70 62Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" strokeLinejoin="round" />
        )}
        {hairStyle === "bob" && (
          <path d="M70 64C72 40 128 40 130 64C122 52 108 52 100 55C92 52 78 52 70 64Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" />
        )}
        {hairStyle === "wavy" && (
          <path d="M69 66C70 38 130 38 131 66C122 50 108 49 100 56C92 49 78 50 69 66Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" />
        )}
        {hairStyle === "buns" && (
          <path d="M70 62C72 39 128 39 130 62C120 50 106 50 100 54C94 50 80 50 70 62Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" />
        )}
        {hairStyle === "curly" && (
          <path d="M71 58C76 42 124 42 129 58C120 49 110 51 100 51C90 51 80 49 71 58Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" />
        )}
        {hairStyle === "sweep" && (
          <path d="M69 64C70 37 132 38 131 62C120 48 92 52 76 64H69Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" strokeLinejoin="round" />
        )}
        {hairStyle === "spiky" && (
          <path d="M69 60L76 42L87 48L98 34L109 47L122 39L131 60C120 50 80 50 69 60Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" strokeLinejoin="round" />
        )}
        {hairStyle === "braids" && (
          <path d="M70 62C72 38 128 38 130 62C120 49 104 49 100 54C96 49 80 49 70 62Z" fill={hairColor} stroke="#322A25" strokeWidth="2.3" />
        )}

        {smallAcc === "starpin" && (
          <path d="M119 48L121 52L125 53L122 56L123 60L119 58L115 60L116 56L113 53L117 52L119 48Z" fill="#FBE28A" stroke="#322A25" strokeWidth="1.5" />
        )}

        {glasses === "round" && (
          <g stroke="#3D3832" strokeWidth="2.1" fill="none">
            <circle cx="87" cy="68" r="8.5" fill="rgba(255,255,255,0.22)" />
            <circle cx="113" cy="68" r="8.5" fill="rgba(255,255,255,0.22)" />
            <path d="M95.5 68H104.5" />
          </g>
        )}
        {glasses === "tortoise" && (
          <g stroke="#5A3724" strokeWidth="2.5" fill="rgba(255,255,255,0.18)">
            <rect x="78" y="61" width="18" height="13" rx="4" />
            <rect x="104" y="61" width="18" height="13" rx="4" />
            <path d="M96 66H104" />
          </g>
        )}
        {glasses === "sun" && (
          <g stroke="#322A25" strokeWidth="2.1" fill="#48454A">
            <rect x="77" y="61" width="19" height="13" rx="5" />
            <rect x="104" y="61" width="19" height="13" rx="5" />
            <path d="M96 66H104" fill="none" />
          </g>
        )}

        {showHeadphones && (
          <g>
            <path d="M67 66C67 34 133 34 133 66" stroke="#8CB8D6" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M67 66C67 34 133 34 133 66" stroke="#322A25" strokeWidth="2" strokeLinecap="round" fill="none" />
            <rect x="61" y="60" width="11" height="20" rx="5.5" fill="#DCEEF8" stroke="#322A25" strokeWidth="2.2" />
            <rect x="128" y="60" width="11" height="20" rx="5.5" fill="#DCEEF8" stroke="#322A25" strokeWidth="2.2" />
          </g>
        )}

        {hat === "beanie" && (
          <g>
            <path d="M69 50C71 28 129 28 131 50H69Z" fill="#B8D8C2" stroke="#322A25" strokeWidth="2.3" />
            <rect x="66" y="45" width="68" height="11" rx="5.5" fill="#DCECE1" stroke="#322A25" strokeWidth="2.3" />
            <circle cx="100" cy="28" r="6" fill="#FFFDF8" stroke="#322A25" strokeWidth="2" />
          </g>
        )}
        {hat === "beret" && (
          <g>
            <path d="M68 48C66 32 118 24 134 42C120 48 84 52 68 48Z" fill="#F2C5D3" stroke="#322A25" strokeWidth="2.3" />
            <path d="M100 29L103 24" stroke="#322A25" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}
        {hat === "bucket" && (
          <g>
            <path d="M74 44C76 28 124 28 126 44Z" fill="#FBE28A" stroke="#322A25" strokeWidth="2.3" />
            <path d="M60 48C78 40 122 40 140 48C124 53 76 53 60 48Z" fill="#FDF1C7" stroke="#322A25" strokeWidth="2.3" />
          </g>
        )}
        {hat === "bow" && (
          <g transform="translate(106, 30)">
            <path d="M10 8C4 2 0 6 2 12C4 16 10 12 10 8Z" fill="#F3A6BD" stroke="#322A25" strokeWidth="1.9" />
            <path d="M10 8C16 2 20 6 18 12C16 16 10 12 10 8Z" fill="#F3A6BD" stroke="#322A25" strokeWidth="1.9" />
            <circle cx="10" cy="9" r="3" fill="#FCE6EC" stroke="#322A25" strokeWidth="1.7" />
          </g>
        )}

        {mood === "celebrating" && (
          <g>
            <path d="M36 48L39 55L46 58L39 61L36 68L33 61L26 58L33 55L36 48Z" fill="#FBE28A" stroke="#322A25" strokeWidth="1.5" />
            <path d="M164 42L166 47L171 49L166 51L164 56L162 51L157 49L162 47L164 42Z" fill="#F4A7B9" stroke="#322A25" strokeWidth="1.5" />
          </g>
        )}
        {mood === "music" && (
          <g fill="#9E89C2" stroke="#322A25" strokeWidth="1.5">
            <path d="M156 54V40L168 37V51" fill="none" strokeWidth="2" />
            <circle cx="153" cy="54" r="3.5" />
            <circle cx="165" cy="51" r="3.5" />
          </g>
        )}
        {mood === "relaxing" && (
          <g opacity="0.85">
            <circle cx="154" cy="48" r="6" fill="rgba(220, 238, 248, 0.65)" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="164" cy="34" r="3.5" fill="rgba(234, 228, 247, 0.7)" stroke="#FFFFFF" strokeWidth="1.2" />
          </g>
        )}
      </svg>
    </div>
  );
};
