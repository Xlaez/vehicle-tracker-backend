import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HistoryService } from 'src/features';
import { ILocation } from 'src/shared';

@WebSocketGateway(5500, {
  transports: ['polling', 'websocket'],
  cors: { origin: '*' },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly historyService: HistoryService) {}

  async handleVehicleLocationUpdate(vehicleId: string, location: ILocation) {
    await this.historyService.addNewRouteHistory({
      latitude: location.latitude,
      speed: location.speed,
      longitude: location.longitude,
      vehicleId,
      altitude: location.altitude,
    });

    this.server.emit('vehicleCurrentLocation', { vehicleId, location });
  }
}
