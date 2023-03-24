import { blacklist } from './blacklist';
import xss from "xss";

const validateMessage = (message: string) => {
  const lowerCaseMessage = message.toLowerCase();

  const isBlacklisted = blacklist.some(item => lowerCaseMessage.includes(item.toLowerCase()));

  return !isBlacklisted;
};

describe('validateMessage', () => {
  it('should return true if message is valid', () => {
    const message = "this is a clean message";
    expect(validateMessage(message)).toBe(true);
  });

  it('should return false for a message containing a blacklisted word', () => {
    const blacklistedWord = blacklist[0];
    const message = `This message contains a blacklisted word: ${blacklistedWord}`;
    expect(validateMessage(message)).toBe(false);
  });
});

describe('should send sanitized message', () => {
  const messageWithScript = 'Hello <script>alert("hacked")</script>';
  const expectedSanitizedMessage = 'Hello ';

  it('should send the sanitized message', () => {
    const sanitizedMessage = xss(messageWithScript, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
    });
    expect(sanitizedMessage).toBe(expectedSanitizedMessage);
  });
});