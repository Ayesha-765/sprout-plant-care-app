// Theme constants (Module 3 · Topic 5)
export const palette = {
  light: {
    background: '#F4F8F1',
    card: '#FFFFFF',
    text: '#1B2A1F',
    subtext: '#5E7263',
    primary: '#2E7D4F',
    primaryText: '#FFFFFF',
    border: '#DCE7D8',
    chip: '#E3F0E0',
    danger: '#C0392B',
  },
  dark: {
    background: '#0F1A13',
    card: '#18271D',
    text: '#E8F3EA',
    subtext: '#9DB5A2',
    primary: '#5FBF85',
    primaryText: '#0F1A13',
    border: '#26382B',
    chip: '#223529',
    danger: '#E57368',
  },
};

export type Theme = typeof palette.light;
