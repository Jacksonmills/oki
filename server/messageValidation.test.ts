import { blockList } from './filterList';
import xss from "xss";
import validateMessage from './validateText';

describe('validateMessage', () => {
  it('should return true if message is valid', () => {
    const message = "this is a clean message";
    expect(validateMessage(message)).toBe(true);
  });

  it('should return false for a message containing a blacklisted word', () => {
    const blockedWord = blockList[0];
    const message = `This message contains a blocked word: ${blockedWord}`;
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