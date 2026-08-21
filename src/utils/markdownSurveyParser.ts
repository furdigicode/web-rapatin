import { DraftQuestion, SurveyQuestionType } from '@/types/SurveyTypes';

let keyCounter = 0;
export const newQuestionKey = () => `q_${Date.now().toString(36)}_${keyCounter++}`;

const TYPE_ALIASES: Record<string, SurveyQuestionType> = {
  text: 'text',
  teks: 'text',
  isian: 'text',
  short: 'text',
  textarea: 'textarea',
  paragraf: 'textarea',
  'teks panjang': 'textarea',
  long: 'textarea',
  radio: 'radio',
  'pilihan tunggal': 'radio',
  'single choice': 'radio',
  pilihan: 'radio',
  checkbox: 'checkbox',
  checkboxes: 'checkbox',
  'pilihan ganda': 'checkbox',
  multiple: 'checkbox',
  'multi select': 'checkbox',
  scale: 'scale',
  skala: 'scale',
  rating: 'scale',
};

const stripInline = (value: string) =>
  value
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .trim();

const isOptionLine = (rawLine: string) => {
  const indent = rawLine.length - rawLine.trimStart().length;
  const trimmed = rawLine.trim();
  if (/^[-*+]\s*\[[ xX]?\]\s+/.test(trimmed)) return true;
  return indent >= 2 && /^[-*+]\s+/.test(trimmed);
};

const isQuestionLine = (rawLine: string) => {
  const indent = rawLine.length - rawLine.trimStart().length;
  const trimmed = rawLine.trim();
  if (indent >= 2) return false;
  if (/^\d+[.)]\s+/.test(trimmed)) return true;
  return /^[-*+]\s+/.test(trimmed) && !/^[-*+]\s*\[[ xX]?\]\s+/.test(trimmed);
};

interface ParsedMeta {
  text: string;
  type?: SurveyQuestionType;
  required: boolean;
  scaleMin: number;
  scaleMax: number;
}

const parseQuestionMeta = (raw: string): ParsedMeta => {
  let text = raw;
  let type: SurveyQuestionType | undefined;
  let required = false;
  let scaleMin = 1;
  let scaleMax = 5;

  // Required markers: trailing "*", "(wajib)", "[wajib]"
  if (/\(\s*wajib\s*\)/i.test(text) || /\[\s*wajib\s*\]/i.test(text)) {
    required = true;
    text = text.replace(/[\(\[]\s*wajib\s*[\)\]]/gi, ' ');
  }
  if (/\*\s*$/.test(text.trim())) {
    required = true;
    text = text.trim().replace(/\*+\s*$/, ' ');
  }

  // Type markers in parentheses or brackets, anywhere in the line
  const markerRegex = /[\(\[]\s*([^()\[\]]+?)\s*[\)\]]/g;
  let match: RegExpExecArray | null;
  const consumed: string[] = [];
  while ((match = markerRegex.exec(text)) !== null) {
    const inner = match[1].trim().toLowerCase();
    const scaleMatch = inner.match(/^(scale|skala|rating)\s*(\d+)\s*[-–to]+\s*(\d+)$/);
    if (scaleMatch) {
      type = 'scale';
      scaleMin = parseInt(scaleMatch[2], 10);
      scaleMax = parseInt(scaleMatch[3], 10);
      consumed.push(match[0]);
      continue;
    }
    const alias = TYPE_ALIASES[inner];
    if (alias) {
      type = alias;
      consumed.push(match[0]);
    }
  }
  consumed.forEach((token) => {
    text = text.replace(token, ' ');
  });

  if (scaleMin >= scaleMax) {
    scaleMin = 1;
    scaleMax = 5;
  }

  text = stripInline(text.replace(/\s+/g, ' ')).replace(/[:：]\s*$/, '').trim();

  return { text, type, required, scaleMin, scaleMax };
};

/**
 * Breaks a markdown document down into survey questions.
 * Tolerant by design: the admin can fix anything afterwards in the builder.
 */
export const parseMarkdownSurvey = (
  markdown: string
): { title: string | null; description: string | null; questions: DraftQuestion[] } => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  let title: string | null = null;
  let description: string | null = null;
  let section: string | null = null;
  const questions: DraftQuestion[] = [];
  let current: DraftQuestion | null = null;

  const pushCurrent = () => {
    if (!current) return;
    if (!current.question_text) {
      current = null;
      return;
    }
    // Infer type when no explicit marker was given
    if (current.options.length > 0 && (current.question_type === 'text')) {
      current.question_type = 'radio';
    }
    if (current.question_type !== 'radio' && current.question_type !== 'checkbox') {
      current.options = [];
    }
    questions.push(current);
    current = null;
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      pushCurrent();
      const level = heading[1].length;
      const headingText = stripInline(heading[2]);
      if (level === 1 && !title) {
        title = headingText;
      } else {
        section = headingText;
      }
      continue;
    }

    if (isOptionLine(rawLine) && current) {
      const optionText = stripInline(
        trimmed.replace(/^[-*+]\s*(\[[ xX]?\]\s*)?/, '')
      );
      if (optionText) current.options.push(optionText);
      continue;
    }

    if (isQuestionLine(rawLine)) {
      pushCurrent();
      const body = trimmed.replace(/^(\d+[.)]|[-*+])\s+/, '');
      const meta = parseQuestionMeta(body);
      current = {
        key: newQuestionKey(),
        section,
        question_text: meta.text,
        question_type: meta.type ?? 'text',
        is_required: meta.required,
        options: [],
        scale_min: meta.scaleMin,
        scale_max: meta.scaleMax,
      };
      continue;
    }

    // Plain paragraph: first one becomes the description, others are ignored
    if (!current && !description && questions.length === 0) {
      description = stripInline(trimmed.replace(/^>\s*/, ''));
    }
  }

  pushCurrent();

  return { title, description, questions };
};

export const generateSurveySlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getSurveyUserIdentifier = (): string => {
  const storageKey = 'survey_user_identifier';
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    `${window.screen.width}x${window.screen.height}`,
    new Date().getTimezoneOffset(),
    Math.random().toString(36).slice(2),
  ].join('|');

  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    hash = (hash << 5) - hash + fingerprint.charCodeAt(i);
    hash |= 0;
  }
  const identifier = `srv_${Math.abs(hash).toString(36)}`;
  localStorage.setItem(storageKey, identifier);
  return identifier;
};
