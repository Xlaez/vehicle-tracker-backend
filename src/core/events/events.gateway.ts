import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import axios from 'axios';
import { Server } from 'socket.io';
import { HistoryService } from 'src/features';
import { ILocation } from 'src/shared';

@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  //   constructor(private readonly historyService: HistoryService) {}

  @SubscribeMessage('track-vehicles')
  async trackVehicles(@MessageBody() data: any): Promise<void> {
    const { mapBoxToken, vehicles } = data;
    console.log(vehicles, mapBoxToken);

    const positions = await this.getVehiclePositions(vehicles, mapBoxToken);

    this.server.emit('vehicle-positions', positions);
  }

  async getVehiclePositions(
    vehicles: string[],
    accessToken: string,
  ): Promise<any[]> {
    const positions: any[] = [];

    for (const vehicle of vehicles) {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${vehicle}.json`,
        { params: { access_token: accessToken } },
      );

      const [longitude, latitude] = response.data.features[0].center;

      positions.push({ vehicle, latitude, longitude });
    }

    return positions;
  }

  //   async handleVehicleLocationUpdate(vehicleId: string, location: ILocation) {
  //     await this.historyService.addNewRouteHistory({
  //       latitude: location.latitude,
  //       speed: location.speed,
  //       longitude: location.longitude,
  //       vehicleId,
  //       altitude: location.altitude,
  //     });

  //     this.server.emit('vehicleCurrentLocation', { vehicleId, location });
  //   }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected : ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Cient disconnected : ${client.id}`);
  }
}
