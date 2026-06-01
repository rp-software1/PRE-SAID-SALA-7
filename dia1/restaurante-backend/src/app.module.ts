import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatosModule } from './platos/platos.module';
import { MesasModule } from './mesas/mesas.module';
import { Plato } from './platos/entities/plato.entity';
import { Mesa } from './mesas/entities/mesa.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'db.sqlite',
      entities: [Plato, Mesa],
      synchronize: true,
    }),
    PlatosModule,
    MesasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}