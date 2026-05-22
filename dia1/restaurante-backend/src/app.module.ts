import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatosModule } from './platos/platos.module';
import { Plato } from './platos/entities/plato.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'db.sqlite',
      entities: [Plato],
      synchronize: true,
    }),
    PlatosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}