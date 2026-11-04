export interface TemplateText {
  header_type?: string | null;
  header_content?: string | null;
  body_content?: string | null;
}

export function variableKeys(text: string | null | undefined): string[] {
  const keys = [...new Set(Array.from((text ?? '').matchAll(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*|\d+)\s*\}\}/g), (match) => match[1]))];
  return keys.sort((a, b) => /^\d+$/.test(a) && /^\d+$/.test(b) ? Number(a) - Number(b) : 0);
}

export function templateVariables(template: TemplateText) {
  const textHeader = !template.header_type || template.header_type.toLowerCase() === 'text';
  return {
    header: textHeader ? variableKeys(template.header_content) : [],
    body: variableKeys(template.body_content),
  };
}

export function previewText(text: string | null | undefined, keys: string[], values: string[]): string {
  return (text ?? '').replace(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*|\d+)\s*\}\}/g,
    (match, key) => values[keys.indexOf(key)] || match);
}

export function buildTextComponents(
  template: TemplateText,
  headerValues: unknown,
  bodyValues: unknown,
  options: { mirrorHeaderOnlyToBody?: boolean } = {},
) {
  const keys = templateVariables(template);
  const components: { type: 'header' | 'body'; parameters: { type: 'text'; text: string; parameter_name?: string }[] }[] = [];
  for (const type of ['header', 'body'] as const) {
    const values = type === 'header' ? headerValues : bodyValues;
    if (!Array.isArray(values) || values.length !== keys[type].length ||
      values.some((value) => typeof value !== 'string' || !value.trim() || value.length > 4096)) {
      throw new Error(`Variabel ${type === 'header' ? 'Header' : 'Body'} tidak sesuai: diperlukan ${keys[type].length} isian.`);
    }
    if (keys[type].length) components.push({
      type,
      parameters: values.map((value: string, index: number) => ({
        type: 'text', text: value.trim(),
        ...(/^\d+$/.test(keys[type][index]) ? {} : { parameter_name: keys[type][index] }),
      })),
    });
  }
  // Kirim.Chat requires a body parameter for certain legacy header-only
  // templates. Keep this opt-in so normal Meta component semantics stay intact.
  if (options.mirrorHeaderOnlyToBody && keys.header.length && !keys.body.length) {
    const header = components.find((component) => component.type === 'header');
    if (header) components.push({
      type: 'body',
      parameters: header.parameters.map((parameter) => ({ ...parameter })),
    });
  }
  return components;
}