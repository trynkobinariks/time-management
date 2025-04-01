import { User } from "@supabase/supabase-js";

export interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  user: User;
  pathname: string;
}