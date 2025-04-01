import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import { NavItem } from '@/components/Header/types';

const DesktopNavigationTab = ({ item }: { item: NavItem }) => {
  const { t } = useClientTranslation()
  const pathname = usePathname()

  return <Link
    key={item.name}
    href={item.href}
    className={`px-6 py-2 text-sm font-medium transition-all rounded-md ${pathname === item.href
      ? 'bg-[var(--card-border)] text-[var(--text-primary)]'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:shadow-md dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
      }`}
  >
    {t(item.name)}
  </Link>
};

export default DesktopNavigationTab;