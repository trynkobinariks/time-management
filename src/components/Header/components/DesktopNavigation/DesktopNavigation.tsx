import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useClientTranslation } from '@/hooks/useClientTranslation'
import { NavItem } from '../../types'

const DesktopNavigation = (
  {
    navItems,
  }: {
    navItems: NavItem[];
  }
) => {
  const pathname = usePathname()
  const { t } = useClientTranslation()
  
  return (
    <nav className="ml-8 hidden md:flex">
      <div className="flex space-x-0">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-6 py-2 text-sm font-medium transition-all rounded-md ${pathname === item.href
                  ? 'bg-[var(--card-border)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--card-border)] hover:text-[var(--text-primary)]'
                }`}
            >
              {t(item.name)}
            </Link>
          ))}
        </div>
      </nav>
    )
  }
  
  export default DesktopNavigation