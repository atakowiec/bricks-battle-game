import { Injectable } from '@nestjs/common';

@Injectable()
export class MapsService {
  getMapsByType(type: string, req: Request) {
    // todo implement
  }

  saveMap(body: any, req: Request) {
    console.log('saveMap', body);
  }
}
