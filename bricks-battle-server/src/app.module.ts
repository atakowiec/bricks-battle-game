import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MapsModule } from './maps/maps.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { GameModule } from './game/game.module';
import { GadgetsModule } from './gadgets/gadgets.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('MONGO_HOST', 'localhost');
        const port = configService.get('MONGO_PORT', '27017');
        const user = configService.get('MONGO_USER', 'root');
        const pass = configService.get('MONGO_PASS', 'pass');

        console.log(`mongodb://${user}:${pass}@${host}:${port}/bricks-battle?authSource=admin`);

        return {
          uri: `mongodb://${user}:${pass}@${host}:${port}/bricks-battle?authSource=admin`,
        };
      },
    }),
    MapsModule,
    GameModule,
    GadgetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
