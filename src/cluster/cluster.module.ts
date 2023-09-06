import { Global, Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';

@Global()
@Module({
  providers: [ClusterService],
  controllers: [ClusterController],
  exports: [ClusterService],
})
export class ClusterModule {}
