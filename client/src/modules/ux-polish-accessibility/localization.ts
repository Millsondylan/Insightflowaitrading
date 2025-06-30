// Localization module
export class Localization {
  static translate(key: string, locale: string = 'en'): string {
    // Mock implementation
    return key;
  }

  static getCurrentLocale(): string {
    return 'en';
  }
}

export default Localization; 