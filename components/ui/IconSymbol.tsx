import React from "react";
import { SvgProps } from "react-native-svg";
import { 
  Home, 
  Send, 
  Code, 
  ChevronRight,
  Search,
  Plus,
  User,
  List,
  Store,
  Handbag,
  Power,
  Camera,
  UserCircle,
  Heart,
  CreditCard,
  MapPin,
  Bell,
  HelpCircle,
  Info,
  Phone
} from "lucide-react-native"; 

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
  Store,
  Handbag,



  "plus": Plus,
  "user": User,
  "list": List,
  "store": Store,
  "handbag": Handbag,
  "power": Power,
  "camera": Camera,
  "person.circle": UserCircle,
  "heart": Heart,
  "bag": Handbag,
  "creditcard": CreditCard,
  "location": MapPin,
  "bell": Bell,
  "questionmark.circle": HelpCircle,
  "info.circle": Info,
  "phone": Phone,
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
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in MAPPING`);
    return null;
  }
  
  return <LucideIcon width={size} height={size} color={color} {...props} />;
}
