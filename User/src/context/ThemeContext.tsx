import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

export type ThemeChangeEvent =
  | React.MouseEvent
  | MouseEvent
  | React.TouchEvent
  | TouchEvent
  | { clientX: number; clientY: number }
  | null
  | undefined;

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme, event?: ThemeChangeEvent) => void;
  toggleTheme: (event?: ThemeChangeEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

const resolveTheme = (t: Theme): ResolvedTheme => {
  if (t === 'system') {
    return getSystemTheme();
  }
  return t;
};

const applyThemeToDOM = (active: ResolvedTheme) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', active);
  if (active === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_public_theme') as Theme | null;
      if (saved && ['dark', 'light', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme));
  const resolvedThemeRef = useRef<ResolvedTheme>(resolvedTheme);
  resolvedThemeRef.current = resolvedTheme;

  // Sync with DOM on mount and on system color scheme change
  useEffect(() => {
    const currentResolved = resolveTheme(theme);
    setResolvedTheme(currentResolved);
    applyThemeToDOM(currentResolved);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const sysActive = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(sysActive);
        applyThemeToDOM(sysActive);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme, event?: ThemeChangeEvent) => {
      const targetResolved = resolveTheme(newTheme);
      const isResolvedThemeChanging = targetResolved !== resolvedThemeRef.current;

      const executeUpdate = () => {
        setThemeState(newTheme);
        setResolvedTheme(targetResolved);
        resolvedThemeRef.current = targetResolved;
        applyThemeToDOM(targetResolved);
        try {
          localStorage.setItem('portfolio_public_theme', newTheme);
        } catch {
          // ignore localStorage errors
        }
      };

      // Check if startViewTransition is available and reduced motion is NOT preferred
      const isViewTransitionSupported =
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // If theme resolution doesn't visually change or view transitions not supported
      if (!isResolvedThemeChanging || !isViewTransitionSupported) {
        executeUpdate();
        return;
      }

      // Determine the origin coordinates (x, y) for the circular reveal
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (event) {
        if ('clientX' in event && typeof event.clientX === 'number' && (event.clientX !== 0 || event.clientY !== 0)) {
          x = event.clientX;
          y = event.clientY;
        } else if ('touches' in event && event.touches && event.touches[0]) {
          x = event.touches[0].clientX;
          y = event.touches[0].clientY;
        } else if ('currentTarget' in event && event.currentTarget instanceof HTMLElement) {
          const rect = event.currentTarget.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else if ('target' in event && event.target instanceof HTMLElement) {
          const rect = event.target.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      } else if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        const rect = document.activeElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }

      // Calculate the radius to the furthest corner of the viewport
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      try {
        document.documentElement.classList.add('theme-transitioning');

        const transition = (document as any).startViewTransition(() => {
          flushSync(() => {
            executeUpdate();
          });
        });

        transition.ready
          .then(() => {
            const clipPath = [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            document.documentElement.animate(
              {
                clipPath,
              },
              {
                duration: 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          })
          .catch(() => {
            // Handled when transition is aborted by another rapid switch
          });

        if (transition && typeof transition.finished?.finally === 'function') {
          transition.finished.finally(() => {
            document.documentElement.classList.remove('theme-transitioning');
          });
        } else {
          setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
          }, 420);
        }
      } catch {
        document.documentElement.classList.remove('theme-transitioning');
        executeUpdate();
      }
    },
    []
  );

  const toggleTheme = useCallback(
    (event?: ThemeChangeEvent) => {
      const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme, event);
    },
    [resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
