import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Brand,
  Category,
  Collection,
  CollectionFeed,
  FeedActivity,
  Follower,
  Rating,
  User,
} from '../entities';
import { UserRepository } from './user.repository';
import { FollowerRepository } from './follower.repository';
import { BrandRepository } from './brand.repository';
import { CategoryRepository } from './category.repository';
import { RatingRepository } from './rating.repository';
import { FeedActivityRepository } from './feed-activity.repository';
import { CollectionFeedRepository } from './collection-feed.repository';
import { CollectionRepository } from './collection.repository';
const providers = [
  UserRepository,
  FollowerRepository,
  BrandRepository,
  CategoryRepository,
  RatingRepository,
  FeedActivityRepository,
  CollectionRepository,
  CollectionFeedRepository,
];
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Follower,
      Brand,
      Category,
      Rating,
      FeedActivity,
      Collection,
      CollectionFeed,
    ]),
  ],
  providers,
  exports: providers,
})
export class RepositoryModule {}
