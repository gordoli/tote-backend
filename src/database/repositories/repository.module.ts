import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Brand,
  Category,
  CustomList,
  WishList,
  Feed,
  Follower,
  RankProduct,
  User,
  Notification,
} from '../entities';
import { UserRepository } from './user.repository';
import { FollowerRepository } from './follower.repository';
import { BrandRepository } from './brand.repository';
import { CategoryRepository } from './category.repository';
import { RankProductRepository } from './rank-product.repository';
import { FeedRepository } from './feed.repository';
import { WishListRepository } from './wish-list.repository';
import { CustomListRepository } from './custom-list.repository';
import { NotificationRepository } from './notification.repository';
const providers = [
  UserRepository,
  FollowerRepository,
  BrandRepository,
  CategoryRepository,
  RankProductRepository,
  FeedRepository,
  CustomListRepository,
  WishListRepository,
  NotificationRepository,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Follower,
      Brand,
      Category,
      RankProduct,
      Feed,
      CustomList,
      WishList,
      Notification,
    ]),
  ],
  providers,
  exports: providers,
})
export class RepositoryModule {}
