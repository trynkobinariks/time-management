import React from 'react'
import { NavItem } from '../../types'
import DesktopNavigationTab from './DesktopNavigationTab'

const DesktopNavigation = (
  {
    navItems,
  }: {
    navItems: NavItem[];
  }
) => {
  return (
    <nav className="ml-8 hidden md:flex">
      <div className="flex space-x-2">
          {navItems.map((item) => (
            <DesktopNavigationTab key={item.name} item={item} />
          ))}
        </div>
      </nav>
    )
  }
  
  export default DesktopNavigation