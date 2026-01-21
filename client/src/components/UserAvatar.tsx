import Avatar from "boring-avatars";
import { cn } from "@/lib/utils";

const COLORS = ["#5f6fff", "#764ba2", "#667eea", "#10b981", "#f59e0b"];

export type UserAvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    avatarType?: "initials" | "boring" | "upload" | null;
  };
  /** Size variant matching SleekyAvatar sizes, or custom number for pixel size */
  size?: UserAvatarSize | number;
  /** Show border matching card style */
  bordered?: boolean;
  className?: string;
}

// Size classes matching SleekyAvatar for consistency
const sizeClasses: Record<UserAvatarSize, string> = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-28 h-28",
  "2xl": "w-36 h-36",
};

// Pixel sizes for boring-avatars library
const sizePixels: Record<UserAvatarSize, number> = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 80,
  xl: 112,
  "2xl": 144,
};

// Border radius matching SleekyAvatar (rounded-xl style instead of rounded-full)
const borderRadiusClasses: Record<UserAvatarSize, string> = {
  xs: "rounded-lg",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  "2xl": "rounded-2xl",
};

// Ring sizes for bordered variant
const borderSizeClasses: Record<UserAvatarSize, string> = {
  xs: "ring-1",
  sm: "ring-1",
  md: "ring-2",
  lg: "ring-2",
  xl: "ring-2",
  "2xl": "ring-[3px]",
};

// Helper to get border radius for custom pixel sizes
function getBorderRadiusForSize(size: number): string {
  if (size <= 32) return "rounded-lg";
  if (size <= 56) return "rounded-xl";
  return "rounded-2xl";
}

// Helper to get ring size for custom pixel sizes
function getRingSizeForSize(size: number): string {
  if (size <= 40) return "ring-1";
  if (size <= 112) return "ring-2";
  return "ring-[3px]";
}

export function UserAvatar({
  user,
  size = "md",
  bordered = true,
  className,
}: UserAvatarProps) {
  const getInitials = () => {
    if (user.name) {
      const nameParts = user.name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || "U";
  };

  // Determine if using named size or pixel size
  const isNamedSize = typeof size === "string";
  const pixelSize = isNamedSize ? sizePixels[size] : size;
  const borderRadius = isNamedSize
    ? borderRadiusClasses[size]
    : getBorderRadiusForSize(size);
  const ringSize = isNamedSize
    ? borderSizeClasses[size]
    : getRingSizeForSize(size);

  const baseClasses = cn(
    "overflow-hidden flex items-center justify-center transition-all duration-300",
    borderRadius,
    bordered && [ringSize, "ring-border/40", "hover:ring-border/60"],
    isNamedSize && sizeClasses[size],
    className
  );

  // Style for custom pixel sizes
  const customSizeStyle = !isNamedSize
    ? {
        width: pixelSize,
        height: pixelSize,
        minWidth: pixelSize,
        minHeight: pixelSize,
      }
    : undefined;

  // Upload type - show custom uploaded image
  if (user.avatarType === "upload" && user.avatarUrl) {
    return (
      <div className={baseClasses} style={customSizeStyle}>
        <img
          src={user.avatarUrl}
          alt={user.name || "User avatar"}
          className={cn("w-full h-full object-cover", borderRadius)}
        />
      </div>
    );
  }

  // Boring type - show generated avatar
  if (user.avatarType === "boring" && user.avatarUrl) {
    // Parse avatarUrl format: "style:seed"
    const [variant, seed] = user.avatarUrl.split(":");
    return (
      <div className={baseClasses} style={customSizeStyle}>
        <Avatar
          size={pixelSize}
          name={seed || user.email || user.name || "User"}
          variant={variant as any}
          colors={COLORS}
          square={true} // Use square to match rounded-xl styling
        />
      </div>
    );
  }

  // Default: Initials type or fallback
  return (
    <div
      className={cn(baseClasses, "bg-primary/10 text-primary font-semibold")}
      style={{
        ...customSizeStyle,
        fontSize: isNamedSize
          ? undefined
          : `${Math.max(12, Math.round(((pixelSize * 0.4) / 16) * 10) / 10)}rem`,
      }}
    >
      {getInitials()}
    </div>
  );
}
