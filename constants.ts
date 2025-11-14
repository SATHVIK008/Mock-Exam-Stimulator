import { SectionName } from './types';

export const QUESTIONS_PER_SECTION = 24;
export const TIME_PER_SECTION_SECONDS = 40 * 60; // 40 minutes

export const MARKING_SCHEME = {
    correct: 3,
    incorrect: -1,
    unattempted: 0,
};

// Define the standard order of sections for a 3-section test
export const SECTIONS_ORDER: SectionName[] = [SectionName.VARC, SectionName.LRDI, SectionName.QA];
