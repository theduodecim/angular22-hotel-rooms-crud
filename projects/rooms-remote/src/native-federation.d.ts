declare module '@angular-architects/native-federation' {
  export function initFederation(manifest?: string | Record<string, string>): Promise<void>;
  export function loadRemoteModule<T = unknown>(options: {
    remoteName: string;
    exposedModule: string;
  }): Promise<T>;
}
