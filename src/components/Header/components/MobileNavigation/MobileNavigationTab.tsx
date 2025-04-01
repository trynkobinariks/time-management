import Link from 'next/link'
import React from 'react'
import { useClientTranslation } from '@/hooks/useClientTranslation' 
import { NavItem } from '@/components/Header/types'
import { usePathname } from 'next/navigation'

const MobileNavigationTab = ({ item, setIsMenuOpen }: { item: NavItem, setIsMenuOpen: (isMenuOpen: boolean) => void  }) => {
  const { t } = useClientTranslation()
  const pathname = usePathname()

  return (
    <Link
      key={item.name}
      href={item.href}
      className={`block px-4 py-2 rounded-md text-base font-medium ${pathname === item.href
        ? 'bg-[var(--text-primary)] text-[var(--background)]'
        : 'bg-[var(--card-background)] text-[var(--text-primary)] hover:bg-[var(--card-border)]'
        }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {t(item.name)}
    </Link>
  )
}

export default MobileNavigationTab