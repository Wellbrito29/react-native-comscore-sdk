import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  initialize(
    publisherId: string,
    applicationName: string,
    autoUpdateMode: string,
    autoUpdateIntervalSeconds: number,
    childDirected: boolean,
    validationMode: boolean,
    startOnlyWhenUIIsVisible: boolean,
    initialConsent: string,
    debugLogs: boolean
  ): Promise<void>;
  notifyUxActive(): Promise<void>;
  notifyUxInactive(): Promise<void>;
  trackSection(sectionName: string): Promise<void>;
  updateConsent(value: string): Promise<void>;
  setChildDirected(enabled: boolean): Promise<void>;
  setValidationMode(enabled: boolean): Promise<void>;
  getVersion(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Comscore');
