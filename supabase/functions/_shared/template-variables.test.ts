import { describe, expect, test } from 'bun:test';
import { buildTextComponents, previewText, templateVariables } from './template-variables';

describe('Kirim.Chat template text variables', () => {
  test('standard header-only templates keep their name only in the header', () => {
    const template = { header_type: 'TEXT', header_content: 'Halo kak {{1}}', body_content: 'Belum melakukan top up saldo.' };
    expect(templateVariables(template)).toEqual({ header: ['1'], body: [] });
    expect(buildTextComponents(template, ['Budi'], [])).toEqual([
      { type: 'header', parameters: [{ type: 'text', text: 'Budi' }] },
    ]);
  });
  test('activation_user compatibility includes Eky in header and body', () => {
    const template = { header_type: 'TEXT', header_content: 'Halo kak {{1}}', body_content: 'Belum melakukan top up saldo.' };
    expect(buildTextComponents(template, ['Eky'], [], { mirrorHeaderOnlyToBody: true })).toEqual([
      { type: 'header', parameters: [{ type: 'text', text: 'Eky' }] },
      { type: 'body', parameters: [{ type: 'text', text: 'Eky' }] },
    ]);
  });
  test('compatibility does not replace real body variables', () => {
    expect(buildTextComponents({ header_content: '{{1}}', body_content: '{{1}}' }, ['Eky'], ['50000'], { mirrorHeaderOnlyToBody: true })).toEqual([
      { type: 'header', parameters: [{ type: 'text', text: 'Eky' }] },
      { type: 'body', parameters: [{ type: 'text', text: '50000' }] },
    ]);
  });
  test('header and body can each have their own variable 1', () => {
    expect(buildTextComponents({ header_content: '{{1}}', body_content: '{{2}} {{1}} {{1}}' }, ['Budi'], ['Rapatin', '50000'])).toEqual([
      { type: 'header', parameters: [{ type: 'text', text: 'Budi' }] },
      { type: 'body', parameters: [{ type: 'text', text: 'Rapatin' }, { type: 'text', text: '50000' }] },
    ]);
  });
  test('body-only templates retain their body component', () => {
    expect(buildTextComponents({ body_content: '{{1}}' }, [], ['Budi'])).toEqual([
      { type: 'body', parameters: [{ type: 'text', text: 'Budi' }] },
    ]);
  });
  test('missing or misplaced header values are rejected', () => {
    expect(() => buildTextComponents({ header_content: '{{1}}' }, [], ['Budi'])).toThrow();
    expect(() => buildTextComponents({ header_content: '{{1}}' }, [' '], [])).toThrow();
  });
  test('named variables preserve their parameter names', () => {
    expect(buildTextComponents({ header_content: '{{name}}' }, ['Budi'], [])).toEqual([
      { type: 'header', parameters: [{ type: 'text', text: 'Budi', parameter_name: 'name' }] },
    ]);
    expect(previewText('Halo {{name}}', ['name'], ['Budi'])).toBe('Halo Budi');
  });
  test('static and media headers do not produce text parameters', () => {
    expect(buildTextComponents({ header_type: 'IMAGE', header_content: '{{1}}', body_content: 'Hello' }, [], [])).toEqual([]);
  });
});