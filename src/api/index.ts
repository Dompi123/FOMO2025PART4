import { ApiClient } from './client';
import { VenuesService } from './services/venues';

class Api {
  private static instance: Api;
  private client: ApiClient;

  public venues: VenuesService;

  private constructor() {
    this.client = new ApiClient();
    this.venues = new VenuesService(this.client);
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  public setAuthToken(token: string) {
    this.client.setAuthToken(token);
  }

  public clearAuthToken() {
    this.client.clearAuthToken();
  }
}

export const api = Api.getInstance();

// Export types
export type { ApiResponse, ApiErrorType } from './config';
export { ApiError as ApiErrorClass } from './client'; 