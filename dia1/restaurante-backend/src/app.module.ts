import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatosModule } from './platos/platos.module';
import { MesasModule } from './mesas/mesas.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { Plato } from './platos/entities/plato.entity';
import { Mesa } from './mesas/entities/mesa.entity';
import { Pedido } from './pedidos/entities/pedido.entity';
import { ComandasModule } from './comandas/comandas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlatosModule,
    MesasModule,
    PedidosModule,
    ComandasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}