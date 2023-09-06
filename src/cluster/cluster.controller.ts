import { Controller, Get } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cluster')
@Controller('cluster')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Get('profile-add')
  async checkAddProfileViews() {
    await this.clusterService.addProfileViews(1, 1);
  }
  @Get('similar-add')
  async checkAddSimilarUsers() {
    await this.clusterService.addSimilarUsers(1, [2, 3, 4]);
  }
  @Get('similar-get')
  async getAddSimilarUsers() {
    await this.clusterService.getSimilarUsers();
  }
}
