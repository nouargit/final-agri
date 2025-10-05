import React from "react";
import { SvgProps } from "react-native-svg";
import { Home, Send, Code, ChevronRight,Search,Plus,User,List,Store } from "lucide-react-native";

// Map SF-like names → Lucide icons
const MAPPING = {
  "house.fill": Home,
  "paperplane.fill": Send,
  "chevron.left.forwardslash.chevron.right": Code,
  "chevron.right": ChevronRight,
  "search": Search,
  Plus,
  User,
  List,
  Store

} as const;

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color = "black",
  ...props
}: {
  name: IconSymbolName;
  size?: number;
  color?: string;
} & SvgProps) {
  const LucideIcon = MAPPING[name];
  return <LucideIcon width={size} height={size} color={color} {...props} />;
}
