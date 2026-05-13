import { createContext, useContext } from 'react';

export type Lang = 'BN' | 'EN';

export const LanguageContext = createContext<Lang>('BN');

export const useLang = () => useContext(LanguageContext);
