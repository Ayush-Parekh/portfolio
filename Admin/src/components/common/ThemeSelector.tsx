import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext.js';
import { cn } from '../../utils/cn.js';

export interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ThemeSelectorProps {
  size?: 'sm' | 'md';
  showLabels?: boolean | 'responsive';
  className?: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'system', label: 'Auto', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  size = 'sm',
  showLabels = false,
  className,
}) => {
  const { theme, setTheme } = useTheme();
  const instanceId = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = THEME_OPTIONS.findIndex((opt) => opt.value === theme);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
      setTheme(THEME_OPTIONS[nextIndex].value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length;
      setTheme(THEME_OPTIONS[prevIndex].value);
    }
  };

  const isSmall = size === 'sm';

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center p-1 rounded-2xl bg-[#141414]/90 light:bg-[#DFD4C2]/90 backdrop-blur-md border border-[#262626] light:border-[#C6B7A0] font-mono text-xs shadow-sm relative select-none',
        className
      )}
    >
      {THEME_OPTIONS.map((opt) => {
        const isSelected = theme === opt.value;
        const IconComponent = opt.icon;

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={(e) => setTheme(opt.value, e)}
            title={`Switch to ${opt.label} theme`}
            className={cn(
              'relative z-10 flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e91010]',
              isSmall ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs',
              isSelected
                ? 'text-white font-bold'
                : 'text-neutral-400 light:text-neutral-700 hover:text-white light:hover:text-black hover:bg-neutral-800/40 light:hover:bg-neutral-300/40'
            )}
          >
            {/* Animated Active Pill Indicator with instance-scoped layoutId */}
            {isSelected && (
              <motion.div
                layoutId={`${instanceId}-activeAdminThemePill`}
                className="absolute inset-0 z-[-1] rounded-xl bg-[#e91010] shadow-sm shadow-[#e91010]/30"
                transition={{
                  type: 'spring',
                  stiffness: 480,
                  damping: 34,
                }}
              />
            )}

            <IconComponent
              className={cn(
                'shrink-0 transition-transform duration-200',
                isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4',
                isSelected ? 'scale-105 text-white' : 'opacity-85'
              )}
            />

            {showLabels && (
              <span className="tracking-tight text-[11px] font-semibold">
                {opt.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const ThemeToggle = ThemeSelector;

