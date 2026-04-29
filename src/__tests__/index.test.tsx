import type { ComscoreConfig } from '../index';

const mockNativeComscore = {
  initialize: jest.fn().mockResolvedValue(undefined),
  notifyUxActive: jest.fn().mockResolvedValue(undefined),
  notifyUxInactive: jest.fn().mockResolvedValue(undefined),
  trackSection: jest.fn().mockResolvedValue(undefined),
  updateConsent: jest.fn().mockResolvedValue(undefined),
  setChildDirected: jest.fn().mockResolvedValue(undefined),
  setValidationMode: jest.fn().mockResolvedValue(undefined),
  getVersion: jest.fn().mockResolvedValue('1.0.0'),
};

jest.mock('../NativeComscore', () => ({
  __esModule: true,
  default: mockNativeComscore,
}));

describe('Comscore', () => {
  let Comscore: typeof import('../index').default;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    Comscore = require('../index').default;
  });

  describe('initialize', () => {
    const validConfig: ComscoreConfig = {
      publisherId: 'test-publisher-id',
    };

    it('should call native initialize with correct parameters when using minimal config', async () => {
      await Comscore.initialize(validConfig);

      expect(mockNativeComscore.initialize).toHaveBeenCalledTimes(1);
      expect(mockNativeComscore.initialize).toHaveBeenCalledWith(
        'test-publisher-id',
        '',
        '',
        -1,
        false,
        false,
        false,
        '',
        false
      );
    });

    it('should call native initialize with all provided parameters', async () => {
      const fullConfig: ComscoreConfig = {
        publisherId: 'full-publisher-id',
        applicationName: 'TestApp',
        autoUpdateMode: 'foregroundOnly',
        autoUpdateIntervalSeconds: 60,
        childDirected: true,
        validationMode: true,
        startOnlyWhenUIIsVisible: true,
        initialConsent: '1',
        debugLogs: true,
      };

      await Comscore.initialize(fullConfig);

      expect(mockNativeComscore.initialize).toHaveBeenCalledTimes(1);
      expect(mockNativeComscore.initialize).toHaveBeenCalledWith(
        'full-publisher-id',
        'TestApp',
        'foregroundOnly',
        60,
        true,
        true,
        true,
        '1',
        true
      );
    });

    it('should throw error when publisherId is empty string', async () => {
      await expect(Comscore.initialize({ publisherId: '' })).rejects.toThrow(
        'Comscore initialization failed: publisherId is required and must be a non-empty string.'
      );
      expect(mockNativeComscore.initialize).not.toHaveBeenCalled();
    });

    it('should throw error when publisherId is whitespace only', async () => {
      await expect(Comscore.initialize({ publisherId: '   ' })).rejects.toThrow(
        'Comscore initialization failed: publisherId is required and must be a non-empty string.'
      );
      expect(mockNativeComscore.initialize).not.toHaveBeenCalled();
    });

    it('should throw error when publisherId is not a string', async () => {
      await expect(
        Comscore.initialize({ publisherId: 123 as unknown as string })
      ).rejects.toThrow(
        'Comscore initialization failed: publisherId is required and must be a non-empty string.'
      );
      expect(mockNativeComscore.initialize).not.toHaveBeenCalled();
    });

    it('should throw error when config is null', async () => {
      await expect(
        Comscore.initialize(null as unknown as ComscoreConfig)
      ).rejects.toThrow(
        'Comscore initialization failed: publisherId is required and must be a non-empty string.'
      );
      expect(mockNativeComscore.initialize).not.toHaveBeenCalled();
    });

    it('should warn and skip when already initialized', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await Comscore.initialize(validConfig);
      await Comscore.initialize(validConfig);

      expect(mockNativeComscore.initialize).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Comscore is already initialized. Ignoring subsequent calls.'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('notifyUxActive', () => {
    it('should delegate to native module', async () => {
      await Comscore.notifyUxActive();
      expect(mockNativeComscore.notifyUxActive).toHaveBeenCalledTimes(1);
    });
  });

  describe('notifyUxInactive', () => {
    it('should delegate to native module', async () => {
      await Comscore.notifyUxInactive();
      expect(mockNativeComscore.notifyUxInactive).toHaveBeenCalledTimes(1);
    });
  });

  describe('trackSection', () => {
    it('should delegate string value to native module', async () => {
      await Comscore.trackSection('Home');
      expect(mockNativeComscore.trackSection).toHaveBeenCalledWith('Home');
    });

    it('should convert null to empty string', async () => {
      await Comscore.trackSection(null);
      expect(mockNativeComscore.trackSection).toHaveBeenCalledWith('');
    });

    it('should convert undefined to empty string', async () => {
      await Comscore.trackSection(undefined);
      expect(mockNativeComscore.trackSection).toHaveBeenCalledWith('');
    });

    it('should convert empty string to empty string', async () => {
      await Comscore.trackSection('');
      expect(mockNativeComscore.trackSection).toHaveBeenCalledWith('');
    });
  });

  describe('updateConsent', () => {
    it('should accept "1"', async () => {
      await Comscore.updateConsent('1');
      expect(mockNativeComscore.updateConsent).toHaveBeenCalledWith('1');
    });

    it('should accept "0"', async () => {
      await Comscore.updateConsent('0');
      expect(mockNativeComscore.updateConsent).toHaveBeenCalledWith('0');
    });

    it('should accept empty string', async () => {
      await Comscore.updateConsent('');
      expect(mockNativeComscore.updateConsent).toHaveBeenCalledWith('');
    });

    it('should throw error for invalid value', async () => {
      await expect(Comscore.updateConsent('2' as '0')).rejects.toThrow(
        'Invalid consent value. Expected "0", "1", or "".'
      );
      expect(mockNativeComscore.updateConsent).not.toHaveBeenCalled();
    });
  });

  describe('setChildDirected', () => {
    it('should delegate to native module', async () => {
      await Comscore.setChildDirected(true);
      expect(mockNativeComscore.setChildDirected).toHaveBeenCalledWith(true);
    });
  });

  describe('setValidationMode', () => {
    it('should delegate to native module', async () => {
      await Comscore.setValidationMode(false);
      expect(mockNativeComscore.setValidationMode).toHaveBeenCalledWith(false);
    });
  });

  describe('getVersion', () => {
    it('should return version from native module', async () => {
      const version = await Comscore.getVersion();
      expect(version).toBe('1.0.0');
      expect(mockNativeComscore.getVersion).toHaveBeenCalledTimes(1);
    });
  });
});
