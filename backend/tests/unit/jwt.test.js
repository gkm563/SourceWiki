import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  sendTokenResponse
} from '../../src/utils/jwt.js';

describe('JWT Utilities', () => {
  const testUserId = 42;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    delete process.env.JWT_EXPIRE;
    delete process.env.JWT_REFRESH_EXPIRE;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT containing the userId', () => {
      const token = generateAccessToken(testUserId);
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(testUserId);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    it('should use default expiration of 15 minutes when JWT_EXPIRE is unset', () => {
      const token = generateAccessToken(testUserId);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 15 minutes = 900 seconds
      expect(decoded.exp - decoded.iat).toBe(900);
    });

    it('should respect custom JWT_EXPIRE environment variable', () => {
      process.env.JWT_EXPIRE = '1h';

      const token = generateAccessToken(testUserId);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 1 hour = 3600 seconds
      expect(decoded.exp - decoded.iat).toBe(3600);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh JWT containing the userId', () => {
      const token = generateRefreshToken(testUserId);
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      expect(decoded.id).toBe(testUserId);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    it('should use default expiration of 7 days when JWT_REFRESH_EXPIRE is unset', () => {
      const token = generateRefreshToken(testUserId);
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      // 7 days = 604800 seconds
      expect(decoded.exp - decoded.iat).toBe(604800);
    });

    it('should respect custom JWT_REFRESH_EXPIRE environment variable', () => {
      process.env.JWT_REFRESH_EXPIRE = '30d';

      const token = generateRefreshToken(testUserId);
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      // 30 days = 2592000 seconds
      expect(decoded.exp - decoded.iat).toBe(2592000);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return decoded payload for a valid refresh token', () => {
      const token = generateRefreshToken(testUserId);
      const result = verifyRefreshToken(token);

      expect(result).not.toBeNull();
      expect(result.id).toBe(testUserId);
    });

    it('should return null for a tampered token', () => {
      const token = generateRefreshToken(testUserId);
      const tampered = token.slice(0, -5) + 'abcde';

      expect(verifyRefreshToken(tampered)).toBeNull();
    });

    it('should return null for an expired token', () => {
      const expiredToken = jwt.sign(
        { id: testUserId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '-1s' }
      );

      expect(verifyRefreshToken(expiredToken)).toBeNull();
    });

    it('should return null when token was signed with access token secret', () => {
      const accessToken = generateAccessToken(testUserId);

      expect(verifyRefreshToken(accessToken)).toBeNull();
    });

    it('should return null for invalid or null inputs', () => {
      expect(verifyRefreshToken(null)).toBeNull();
      expect(verifyRefreshToken(undefined)).toBeNull();
      expect(verifyRefreshToken('')).toBeNull();
      expect(verifyRefreshToken('not-a-token')).toBeNull();
    });
  });

  describe('sendTokenResponse', () => {
    it('should set cookies, status, and return json response', () => {
      const mockUser = {
        _id: 123,
        getPublicProfile: jest.fn().mockReturnValue({
          id: 123,
          username: 'testuser',
          email: 'test@example.com'
        })
      };

      const mockRes = {
        statusCode: null,
        cookies: {},
        jsonData: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        cookie(name, val, options) {
          this.cookies[name] = { val, options };
          return this;
        },
        json(data) {
          this.jsonData = data;
          return this;
        }
      };

      sendTokenResponse(mockUser, 200, mockRes);

      expect(mockRes.statusCode).toBe(200);

      // Verify cookies
      expect(mockRes.cookies.token).toBeDefined();
      expect(mockRes.cookies.token.options).toMatchObject({
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      expect(mockRes.cookies.refreshToken).toBeDefined();
      expect(mockRes.cookies.refreshToken.options).toMatchObject({
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Verify JSON payload
      expect(mockRes.jsonData).toMatchObject({
        success: true,
        accessToken: mockRes.cookies.token.val,
        refreshToken: mockRes.cookies.refreshToken.val,
        user: {
          id: 123,
          username: 'testuser',
          email: 'test@example.com'
        }
      });
      expect(mockUser.getPublicProfile).toHaveBeenCalledTimes(1);
    });
  });
});
