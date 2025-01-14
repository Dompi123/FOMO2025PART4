'use client'

import { motion } from 'framer-motion';
import { Building2, Ticket, User, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Screen } from '@/types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

interface NavItem {
  id: Extract<Screen, 'venues' | 'passes' | 'profile'>;
  icon: LucideIcon;
  label: string;
  route: string;
}

export const BottomNav = ({ currentScreen, onNavigate }: BottomNavProps) => {
  const router = useRouter();

  const navItems: readonly NavItem[] = [
    { id: 'venues', icon: Building2, label: 'Venues', route: '/venues' },
    { id: 'passes', icon: Ticket, label: 'My Passes', route: '/passes' },
    { id: 'profile', icon: User, label: 'Profile', route: '/profile' }
  ] as const;

  const handleNavigate = (screen: Screen, route: string) => {
    onNavigate(screen);
    router.push(route);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#070707]/90 backdrop-blur-xl border-t border-white/5 safe-bottom">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate(item.id, item.route)}
                className="flex flex-col items-center gap-1 px-4 py-2"
              >
                <div className={`p-2 rounded-full ${isActive ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F]' : 'bg-white/5'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};