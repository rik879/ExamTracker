export type ExamType = 'JEE' | 'JEE Advanced' | 'NEET-UG';
export type Subject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Botany' | 'Zoology';

export interface UserProfile {
  uid: string;
  name: string;
  targetExam: ExamType;
  targetYear: number;
  createdAt: number;
  updatedAt: number;
}

export interface SubjectMockTest {
  id: string; // Document ID
  userId: string;
  subject: Subject;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  hasNegativeMarking: boolean;
  score: number;
  percentage: number;
  testDate: number;
  createdAt: number;
  updatedAt: number;
}

export interface FullMockTest {
  id: string; // Document ID
  userId: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  hasNegativeMarking: boolean;
  score: number;
  percentage: number;
  testDate: number;
  createdAt: number;
  updatedAt: number;
}
