import { MediaService } from "./media_service";
import { ApiClientNet } from "./api_client_net";

import { Injectable } from "@angular/core";

export enum ProviderType {
  NET,
  TMDB,
}

@Injectable()
export class ApiMediaProvider {
  constructor(private apiClientNet: ApiClientNet) {}

  getProvider(providerType: ProviderType): MediaService {
    switch (providerType) {
      case ProviderType.NET:
        return this.apiClientNet;
      case ProviderType.TMDB:
        return null;
    }
  }
}
