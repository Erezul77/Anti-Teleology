// Stage 4Y — Accessibility & Themes system with keyboard nav, SR summaries, light/dark/high-contrast, font scale

export interface AccessibilitySettings {
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  fontScale: number;
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'high-contrast';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export interface ScreenReaderAnnouncement {
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: number;
}

export class AccessibilityManager {
  private settings: AccessibilitySettings;
  private theme: ThemeSettings;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private screenReaderQueue: ScreenReaderAnnouncement[] = [];
  private isProcessingAnnouncements = false;
  
  constructor() {
    this.settings = this.getDefaultAccessibilitySettings();
    this.theme = this.getDefaultThemeSettings();
    this.setupKeyboardNavigation();
    this.setupScreenReader();
    this.applyTheme();
  }
  
  // Accessibility Settings
  updateAccessibilitySettings(newSettings: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.applyAccessibilitySettings();
    this.saveSettings();
  }
  
  getAccessibilitySettings(): AccessibilitySettings {
    return { ...this.settings };
  }
  
  // Theme Management
  updateTheme(newTheme: Partial<ThemeSettings>): void {
    this.theme = { ...this.theme, ...newTheme };
    this.applyTheme();
    this.saveTheme();
  }
  
  getTheme(): ThemeSettings {
    return { ...this.theme };
  }
  
  // Keyboard Navigation
  registerShortcut(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }
  
  unregisterShortcut(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean): void {
    const shortcutKey = this.getShortcutKey({ key, ctrl, shift, alt });
    this.shortcuts.delete(shortcutKey);
  }
  
  // Screen Reader Support
  announce(message: string, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    if (!this.settings.enableScreenReader) return;
    
    const announcement: ScreenReaderAnnouncement = {
      message,
      priority,
      timestamp: Date.now(),
    };
    
    this.screenReaderQueue.push(announcement);
    this.processAnnouncements();
  }
  
  announceGridState(monadCount: number, activeRules: number, tick: number): void {
    const message = `Grid contains ${monadCount} monads, ${activeRules} active rules, at tick ${tick}`;
    this.announce(message, 'low');
  }
  
  announceSelection(selectedMonads: number, totalMonads: number): void {
    if (selectedMonads === 0) {
      this.announce('No monads selected');
    } else if (selectedMonads === totalMonads) {
      this.announce('All monads selected');
    } else {
      this.announce(`${selectedMonads} of ${totalMonads} monads selected`);
    }
  }
  
  announceError(error: string): void {
    this.announce(`Error: ${error}`, 'high');
  }
  
  announceSuccess(message: string): void {
    this.announce(message, 'medium');
  }
  
  // Navigation Support
  focusNextElement(currentElement: HTMLElement): HTMLElement | null {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(currentElement);
    
    if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
      return focusableElements[0] || null;
    }
    
    return focusableElements[currentIndex + 1];
  }
  
  focusPreviousElement(currentElement: HTMLElement): HTMLElement | null {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(currentElement);
    
    if (currentIndex === -1 || currentIndex === 0) {
      return focusableElements[focusableElements.length - 1] || null;
    }
    
    return focusableElements[currentIndex - 1];
  }
  
  // Utility Methods
  getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];
    
    const elements: HTMLElement[] = [];
    for (const selector of focusableSelectors) {
      const found = document.querySelectorAll(selector);
      elements.push(...Array.from(found) as HTMLElement[]);
    }
    
    return elements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }
  
  private setupKeyboardNavigation(): void {
    if (!this.settings.enableKeyboardNavigation) return;
    
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });
    
    // Register default shortcuts
    this.registerDefaultShortcuts();
  }
  
  private setupScreenReader(): void {
    if (!this.settings.enableScreenReader) return;
    
    // Create live region for announcements
    this.createLiveRegion();
  }
  
  private handleKeyDown(event: KeyboardEvent): void {
    const shortcutKey = this.getShortcutKey({
      key: event.key,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
    });
    
    const shortcut = this.shortcuts.get(shortcutKey);
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }
  
  private registerDefaultShortcuts(): void {
    // Navigation shortcuts
    this.registerShortcut({
      key: 'Tab',
      description: 'Navigate to next focusable element',
      action: () => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          const nextElement = this.focusNextElement(activeElement);
          if (nextElement) {
            nextElement.focus();
            this.announce(`Focused: ${this.getElementDescription(nextElement)}`);
          }
        }
      },
    });
    
    this.registerShortcut({
      key: 'Tab',
      shift: true,
      description: 'Navigate to previous focusable element',
      action: () => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          const prevElement = this.focusPreviousElement(activeElement);
          if (prevElement) {
            prevElement.focus();
            this.announce(`Focused: ${this.getElementDescription(prevElement)}`);
          }
        }
      },
    });
    
    // Zoom shortcuts
    this.registerShortcut({
      key: '=',
      ctrl: true,
      description: 'Zoom in',
      action: () => {
        this.settings.fontScale = Math.min(2.0, this.settings.fontScale + 0.1);
        this.applyAccessibilitySettings();
        this.announce(`Zoom level: ${Math.round(this.settings.fontScale * 100)}%`);
      },
    });
    
    this.registerShortcut({
      key: '-',
      ctrl: true,
      description: 'Zoom out',
      action: () => {
        this.settings.fontScale = Math.max(0.5, this.settings.fontScale - 0.1);
        this.applyAccessibilitySettings();
        this.announce(`Zoom level: ${Math.round(this.settings.fontScale * 100)}%`);
      },
    });
    
    // Theme shortcuts
    this.registerShortcut({
      key: 't',
      ctrl: true,
      description: 'Toggle theme',
      action: () => {
        const themes: ThemeSettings['mode'][] = ['light', 'dark', 'high-contrast'];
        const currentIndex = themes.indexOf(this.theme.mode);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.updateTheme({ mode: themes[nextIndex] });
        this.announce(`Theme changed to ${themes[nextIndex]}`);
      },
    });
  }
  
  private getElementDescription(element: HTMLElement): string {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      if (labelElement) return labelElement.textContent || '';
    }
    
    const title = element.getAttribute('title');
    if (title) return title;
    
    if (element.tagName === 'BUTTON') {
      return element.textContent || 'Button';
    }
    
    if (element.tagName === 'INPUT') {
      const placeholder = element.getAttribute('placeholder');
      if (placeholder) return placeholder;
      return element.getAttribute('type') || 'Input field';
    }
    
    return element.textContent || element.tagName.toLowerCase();
  }
  
  private createLiveRegion(): void {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'false');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(liveRegion);
  }
  
  private async processAnnouncements(): Promise<void> {
    if (this.isProcessingAnnouncements || this.screenReaderQueue.length === 0) return;
    
    this.isProcessingAnnouncements = true;
    
    while (this.screenReaderQueue.length > 0) {
      const announcement = this.screenReaderQueue.shift()!;
      
      // Use native screen reader if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(announcement.message);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
      }
      
      // Also update live region for screen readers
      const liveRegion = document.querySelector('[aria-live]') as HTMLElement;
      if (liveRegion) {
        liveRegion.textContent = announcement.message;
      }
      
      // Wait for announcement to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.isProcessingAnnouncements = false;
  }
  
  private applyAccessibilitySettings(): void {
    // Apply font scaling
    document.documentElement.style.fontSize = `${this.settings.fontScale * 100}%`;
    
    // Apply reduced motion
    if (this.settings.enableReducedMotion) {
      document.documentElement.style.setProperty('--reduced-motion', 'reduce');
    } else {
      document.documentElement.style.setProperty('--reduced-motion', 'no-preference');
    }
    
    // Apply color blindness mode
    if (this.settings.colorBlindnessMode !== 'none') {
      document.documentElement.style.setProperty('--color-blindness', this.settings.colorBlindnessMode);
    } else {
      document.documentElement.style.removeProperty('--color-blindness');
    }
  }
  
  private applyTheme(): void {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    root.classList.add(`theme-${this.theme.mode}`);
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', this.theme.primaryColor);
    root.style.setProperty('--secondary-color', this.theme.secondaryColor);
    root.style.setProperty('--background-color', this.theme.backgroundColor);
    root.style.setProperty('--text-color', this.theme.textColor);
    root.style.setProperty('--accent-color', this.theme.accentColor);
    root.style.setProperty('--border-color', this.theme.borderColor);
    
    // Apply high contrast adjustments
    if (this.theme.mode === 'high-contrast') {
      root.style.setProperty('--high-contrast', 'true');
    } else {
      root.style.setProperty('--high-contrast', 'false');
    }
  }
  
  private getShortcutKey(shortcut: Partial<KeyboardShortcut>): string {
    const parts = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.alt) parts.push('alt');
    parts.push(shortcut.key?.toLowerCase() || '');
    return parts.join('+');
  }
  
  private getDefaultAccessibilitySettings(): AccessibilitySettings {
    return {
      enableKeyboardNavigation: true,
      enableScreenReader: true,
      enableHighContrast: false,
      enableReducedMotion: false,
      fontScale: 1.0,
      colorBlindnessMode: 'none',
    };
  }
  
  private getDefaultThemeSettings(): ThemeSettings {
    return {
      mode: 'light',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#f59e0b',
      borderColor: '#e5e7eb',
    };
  }
  
  private saveSettings(): void {
    try {
      localStorage.setItem('mpl-accessibility-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }
  
  private saveTheme(): void {
    try {
      localStorage.setItem('mpl-theme-settings', JSON.stringify(this.theme));
    } catch (error) {
      console.warn('Failed to save theme settings:', error);
    }
  }
  
  loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('mpl-accessibility-settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
      
      const savedTheme = localStorage.getItem('mpl-theme-settings');
      if (savedTheme) {
        this.theme = { ...this.theme, ...JSON.parse(savedTheme) };
      }
      
      this.applyAccessibilitySettings();
      this.applyTheme();
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
  }
  
  destroy(): void {
    // Clean up event listeners and resources
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.shortcuts.clear();
    this.screenReaderQueue = [];
  }
}
