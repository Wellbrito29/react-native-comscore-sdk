import NativeComscore from './NativeComscore';

export type ComscoreConsentValue = '0' | '1' | '';

export type ComscoreAutoUpdateMode =
  | 'foregroundOnly'
  | 'foregroundAndBackground'
  | 'disabled';

export type ComscoreConfig = {
  publisherId: string;
  applicationName?: string;
  autoUpdateMode?: ComscoreAutoUpdateMode;
  autoUpdateIntervalSeconds?: number;
  childDirected?: boolean;
  validationMode?: boolean;
  startOnlyWhenUIIsVisible?: boolean;
  initialConsent?: ComscoreConsentValue;
  debugLogs?: boolean;
};

export interface ComscoreModule {
  initialize(config: ComscoreConfig): Promise<void>;
  notifyUxActive(): Promise<void>;
  notifyUxInactive(): Promise<void>;
  trackSection(sectionName?: string | null): Promise<void>;
  updateConsent(value: ComscoreConsentValue): Promise<void>;
  setChildDirected(enabled: boolean): Promise<void>;
  setValidationMode(enabled: boolean): Promise<void>;
  getVersion(): Promise<string>;
}

let isInitialized = false;

const Comscore: ComscoreModule = {
  initialize: async (config: ComscoreConfig): Promise<void> => {
    if (isInitialized) {
      console.warn(
        'Comscore is already initialized. Ignoring subsequent calls.'
      );
      return;
    }
    if (
      !config ||
      typeof config.publisherId !== 'string' ||
      config.publisherId.trim() === ''
    ) {
      throw new Error(
        'Comscore initialization failed: publisherId is required and must be a non-empty string.'
      );
    }

    await NativeComscore.initialize(
      config.publisherId,
      config.applicationName ?? '',
      config.autoUpdateMode ?? '',
      config.autoUpdateIntervalSeconds ?? -1,
      config.childDirected ?? false,
      config.validationMode ?? false,
      config.startOnlyWhenUIIsVisible ?? false,
      config.initialConsent ?? '',
      config.debugLogs ?? false
    );

    isInitialized = true;
  },

  notifyUxActive: async (): Promise<void> => {
    return NativeComscore.notifyUxActive();
  },

  notifyUxInactive: async (): Promise<void> => {
    return NativeComscore.notifyUxInactive();
  },

  trackSection: async (sectionName?: string | null): Promise<void> => {
    const validSectionName = sectionName || '';
    return NativeComscore.trackSection(validSectionName);
  },

  updateConsent: async (value: ComscoreConsentValue): Promise<void> => {
    if (value !== '0' && value !== '1' && value !== '') {
      throw new Error('Invalid consent value. Expected "0", "1", or "".');
    }
    return NativeComscore.updateConsent(value);
  },

  setChildDirected: async (enabled: boolean): Promise<void> => {
    return NativeComscore.setChildDirected(enabled);
  },

  setValidationMode: async (enabled: boolean): Promise<void> => {
    return NativeComscore.setValidationMode(enabled);
  },

  getVersion: async (): Promise<string> => {
    return NativeComscore.getVersion();
  },
};

export default Comscore;
