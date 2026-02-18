/**
 * Data source configuration for restaurant data.
 * Determines whether to use mock data or external API based on environment variables.
 */

export type DataSourceMode = 'mock' | 'external';

interface DataSourceConfig {
  mode: DataSourceMode;
  isConfigured: boolean;
  warningMessage: string | null;
}

/**
 * Get the desired data source mode from environment variables.
 * Defaults to 'mock' if not specified.
 */
export function getDesiredDataSource(): DataSourceMode {
  const mode = import.meta.env.VITE_DATA_SOURCE_MODE as string;
  return mode === 'external' ? 'external' : 'mock';
}

/**
 * Check if external API is properly configured.
 * Returns true if all required configuration is present.
 */
export function isExternalConfigured(): boolean {
  const apiUrl = import.meta.env.VITE_EXTERNAL_API_URL as string;
  const apiKey = import.meta.env.VITE_EXTERNAL_API_KEY as string;
  
  return !!(apiUrl && apiKey);
}

/**
 * Get the complete data source configuration including fallback behavior.
 */
export function getDataSourceConfig(): DataSourceConfig {
  const desiredMode = getDesiredDataSource();
  
  if (desiredMode === 'external' && !isExternalConfigured()) {
    return {
      mode: 'mock',
      isConfigured: false,
      warningMessage: 'External API mode is enabled but not configured. Missing API URL or API key. Falling back to mock data. See EXTERNAL_API_SETUP.md for configuration instructions.',
    };
  }
  
  return {
    mode: desiredMode,
    isConfigured: true,
    warningMessage: null,
  };
}

/**
 * Get the external API configuration values.
 */
export function getExternalApiConfig() {
  return {
    url: import.meta.env.VITE_EXTERNAL_API_URL as string,
    key: import.meta.env.VITE_EXTERNAL_API_KEY as string,
  };
}
