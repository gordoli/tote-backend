export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Brands: {
        Row: {
          cover: string | null;
          createdAt: string;
          description: string | null;
          id: string;
          logo: string | null;
          name: string;
          updatedAt: string;
          userId: string | null;
          website: string | null;
        };
        Insert: {
          cover?: string | null;
          createdAt?: string;
          description?: string | null;
          id?: string;
          logo?: string | null;
          name: string;
          updatedAt?: string;
          userId?: string | null;
          website?: string | null;
        };
        Update: {
          cover?: string | null;
          createdAt?: string;
          description?: string | null;
          id?: string;
          logo?: string | null;
          name?: string;
          updatedAt?: string;
          userId?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_7c2944b1214827458523e9b60ac';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
        ];
      };
      Categories: {
        Row: {
          createdAt: string;
          description: string | null;
          id: string;
          image: string | null;
          name: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          name: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          name?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      CustomLists: {
        Row: {
          createdAt: string;
          id: string;
          name: string;
          updatedAt: string;
          userId: string | null;
        };
        Insert: {
          createdAt?: string;
          id?: string;
          name: string;
          updatedAt?: string;
          userId?: string | null;
        };
        Update: {
          createdAt?: string;
          id?: string;
          name?: string;
          updatedAt?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_76b86007263e50c3c8ebaac8f10';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
        ];
      };
      Feeds: {
        Row: {
          createdAt: string;
          createdBy: string | null;
          id: string;
          referenceId: string;
          title: string | null;
          type: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          createdBy?: string | null;
          id?: string;
          referenceId: string;
          title?: string | null;
          type: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          createdBy?: string | null;
          id?: string;
          referenceId?: string;
          title?: string | null;
          type?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_d7cc6378cb63766a7383aaab601';
            columns: ['createdBy'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
        ];
      };
      Followers: {
        Row: {
          createdAt: string;
          followerId: string;
          id: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          followerId: string;
          id?: string;
          updatedAt?: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          followerId?: string;
          id?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_1cc0e60c868c76985e203eb521c';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'FK_cccee741c1cf2e3dfe04a00b1f7';
            columns: ['followerId'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
        ];
      };
      Notifications: {
        Row: {
          createdAt: string;
          data: Json | null;
          id: string;
          readStatus: boolean;
          receiverId: string | null;
          senderId: string | null;
          type: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          data?: Json | null;
          id?: string;
          readStatus?: boolean;
          receiverId?: string | null;
          senderId?: string | null;
          type: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          data?: Json | null;
          id?: string;
          readStatus?: boolean;
          receiverId?: string | null;
          senderId?: string | null;
          type?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_1332fc4233d68bc3aae30d89ccd';
            columns: ['senderId'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'FK_c5e712db8e805ddfa0ba76bb1c4';
            columns: ['receiverId'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
        ];
      };
      RankProducts: {
        Row: {
          brandId: string | null;
          categoryId: string | null;
          createdAt: string;
          createdBy: string | null;
          description: string;
          id: string;
          image: string;
          link: string;
          name: string;
          rate: number;
          updatedAt: string;
        };
        Insert: {
          brandId?: string | null;
          categoryId?: string | null;
          createdAt?: string;
          createdBy?: string | null;
          description: string;
          id?: string;
          image: string;
          link: string;
          name: string;
          rate?: number;
          updatedAt?: string;
        };
        Update: {
          brandId?: string | null;
          categoryId?: string | null;
          createdAt?: string;
          createdBy?: string | null;
          description?: string;
          id?: string;
          image?: string;
          link?: string;
          name?: string;
          rate?: number;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_03fb2d4de7ceab86b7963cfc935';
            columns: ['brandId'];
            isOneToOne: false;
            referencedRelation: 'Brands';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'FK_3e1aa21b09896cec3165c133d17';
            columns: ['categoryId'];
            isOneToOne: false;
            referencedRelation: 'Categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'FK_61cd471ab9e60a09207e6608812';
            columns: ['createdBy'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
        ];
      };
      typeorm_migrations: {
        Row: {
          id: number;
          name: string;
          timestamp: number;
        };
        Insert: {
          id?: number;
          name: string;
          timestamp: number;
        };
        Update: {
          id?: number;
          name?: string;
          timestamp?: number;
        };
        Relationships: [];
      };
      typeorm_seeds: {
        Row: {
          id: number;
          name: string;
          timestamp: number;
        };
        Insert: {
          id?: number;
          name: string;
          timestamp: number;
        };
        Update: {
          id?: number;
          name?: string;
          timestamp?: number;
        };
        Relationships: [];
      };
      Users: {
        Row: {
          avatar: string | null;
          createdAt: string;
          deletedAt: string | null;
          email: string;
          firstName: string | null;
          id: string;
          isVerified: boolean;
          lastName: string | null;
          password: string | null;
          provider: string;
          refreshToken: string | null;
          socialId: string | null;
          status: string;
          updatedAt: string;
          username: string | null;
        };
        Insert: {
          avatar?: string | null;
          createdAt?: string;
          deletedAt?: string | null;
          email: string;
          firstName?: string | null;
          id?: string;
          isVerified?: boolean;
          lastName?: string | null;
          password?: string | null;
          provider?: string;
          refreshToken?: string | null;
          socialId?: string | null;
          status?: string;
          updatedAt?: string;
          username?: string | null;
        };
        Update: {
          avatar?: string | null;
          createdAt?: string;
          deletedAt?: string | null;
          email?: string;
          firstName?: string | null;
          id?: string;
          isVerified?: boolean;
          lastName?: string | null;
          password?: string | null;
          provider?: string;
          refreshToken?: string | null;
          socialId?: string | null;
          status?: string;
          updatedAt?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      Wishlists: {
        Row: {
          createdAt: string;
          id: string;
          productId: string | null;
          updatedAt: string;
          userId: string | null;
        };
        Insert: {
          createdAt?: string;
          id?: string;
          productId?: string | null;
          updatedAt?: string;
          userId?: string | null;
        };
        Update: {
          createdAt?: string;
          id?: string;
          productId?: string | null;
          updatedAt?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_90226d3531177129476a69788ec';
            columns: ['productId'];
            isOneToOne: false;
            referencedRelation: 'RankProducts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'FK_9c416f3c2826e8ca9fc090ba065';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'Users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
