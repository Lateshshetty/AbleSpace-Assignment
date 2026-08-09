'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'ablespace_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    const initial = saved || 'light';
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function updateTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return { theme, setTheme: updateTheme };
}

