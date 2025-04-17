import { AppMessages, SwaggerMessages } from 'src/constants';
import { MessageType } from '..';

export const getMessage = (
  type: MessageType,
  path: string,
  replacements?: Record<string, string | number | undefined>,
): string => {
  const source = type === MessageType.app ? AppMessages : SwaggerMessages;
  const template =
    path.split('.').reduce((acc, key) => acc?.[key], source) || path;

  if (!replacements) return template;

  return Object.entries(replacements).reduce((msg, [k, v]) => {
    const regex = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
    return msg.replace(regex, String(v));
  }, template);
};
