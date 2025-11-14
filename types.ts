export enum SectionName {
  VARC = 'VARC',
  LRDI = 'LRDI',
  QA = 'Quant',
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
  section: SectionName;
  passage?: string;
  image?: string; // base64 encoded image
}

export enum AnswerStatus {
  NOT_VISITED = 'Not Visited',
  NOT_ANSWERED = 'Not Answered',
  ANSWERED = 'Answered',
  MARKED_FOR_REVIEW = 'Marked for Review',
  ANSWERED_AND_MARKED = 'Answered & Marked for Review',
}

export interface UserAnswer {
  answer: string | null;
  status: AnswerStatus;
}

export enum ExamState {
  INPUT = 'input',
  EXAM = 'exam',
  RESULTS = 'results',
  REVIEW = 'review',
}
