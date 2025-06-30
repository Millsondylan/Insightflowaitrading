import { useEffect, useRef } from 'react';
import { useTheme, ThemeName } from '../../contexts/ThemeContext';

interface Section {
  ref: React.RefObject<Htmlelement >;
  theme: ThemeName;
}

interface ThemeScrollObserverProps {
  sections: Section[];
}

const ThemeScrollObserver: React.FC<themescrollobserverprops /> = ({ sections }) => {
  const { setTheme } = useTheme();
  const observerRef = useRef<Intersectionobserver /></Htmlelement /></Htmlelement /></Htmlelement>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const themeName = entry.target.getAttribute('data-theme-section') as ThemeName;
            if (themeName) {
              setTheme(themeName);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0.3, 0.5, 0.7],
      }
    );

    sections.forEach(({ ref, theme }) => {
      if (ref.current) {
        // Add a data attribute to the element for the observer to read
        ref.current.setAttribute('data-theme-section', theme);
        observer.observe(ref.current);
      }
    });

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [sections, setTheme]);

  return null; // This component does not render anything
};

export default ThemeScrollObserver; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
