# REST API Documentation

## Files

### Upload file

#### Request

`POST /files/upload`

```
curl -i -X POST -H 'Authorization: Bearer <token>' -F 'file=@/path/to/file' http://example.com/files/upload
```

#### Response

```json
"http://example.com/files/file123"
```

### Upload files

#### Request

`POST /files/upload-multi`

```
curl -i -X POST -H 'Authorization: Bearer <token>' -F 'files=@/path/to/file1' -F 'files=@/path/to/file2' http://example.com/files/upload-multi
```

#### Response

```json
["http://example.com/files/file123", "http://example.com/files/file123"]
```

## Users

### My profile

#### Request

`GET /users/me`

```
curl -i -H 'Authorization: Bearer <token>' http://example.com/users/me
```

#### Response

```json
{
  "id": 1,
  "avatar": "http://example.com/avatar.jpg",
  "username": "user123",
  "email": "user@example.com",
  "statistics": {
    "followingCount": 10,
    "followerCount": 20,
    "rankedProductCount": 30
  }
}
```

### Get user info by id

#### Request

`GET /users/:id`

```
curl -i http://example.com/users/123
```

#### Response

```json
{
  "id": 123,
  "avatar": "http://example.com/avatar123.jpg",
  "username": "user456",
  "statistics": {
    "followingCount": 5,
    "followerCount": 15,
    "rankedProductCount": 25
  }
}
```

### My followers

#### Request

`GET /users/follows/followers`

```
curl -i -H 'Authorization: Bearer <token>' http://example.com/users/follows/followers
```

#### Response

```json
[
  {
    "id": 1,
    "avatar": "http://example.com/avatar1.jpg",
    "username": "user1"
  },
  {
    "id": 2,
    "avatar": "http://example.com/avatar2.jpg",
    "username": "user2"
  }
]
```

### My following

#### Request

`GET /users/follows/following`

```
curl -i -H 'Authorization: Bearer <token>' http://example.com/users/follows/following
```

#### Response

```json
[
  {
    "id": 3,
    "avatar": "http://example.com/avatar3.jpg",
    "username": "user3"
  },
  {
    "id": 4,
    "avatar": "http://example.com/avatar4.jpg",
    "username": "user4"
  }
]
```

### Get user's followers

#### Request

`GET /follows/:userId/followers`

```
curl -i http://example.com/follows/123/followers
```

#### Response

```json
[
  {
    "id": 5,
    "avatar": "http://example.com/avatar5.jpg",
    "username": "user5"
  },
  {
    "id": 6,
    "avatar": "http://example.com/avatar6.jpg",
    "username": "user6"
  }
]
```

### Get user's following

#### Request

`GET /follows/:userId/following`

```
curl -i http://example.com/follows/123/following
```

#### Response

```json
[
  {
    "id": 7,
    "avatar": "http://example.com/avatar7.jpg",
    "username": "user7"
  },
  {
    "id": 8,
    "avatar": "http://example.com/avatar8.jpg",
    "username": "user8"
  }
]
```

### Follow user

#### Request

`PUT /follows/following/:userId`

```
curl -i -X PUT -H 'Authorization: Bearer <token>' http://example.com/follows/following/123
```

#### Response

```
HTTP/1.1 204 No Content
```

### Unfollow user

#### Request

`DELETE /follows/following/:userId`

```
curl -i -X DELETE -H 'Authorization: Bearer <token>' http://example.com/follows/following/123
```

#### Response

```
HTTP/1.1 204 No Content
```

## Categories

### List categories

#### Request

`GET /categories`

```
curl -i http://example.com/categories
```

#### Response

```json
[
  {
    "id": 1,
    "name": "Category1"
  },
  {
    "id": 2,
    "name": "Category2"
  }
]
```

## Brands

### Create

#### Request

`POST /brands`

```
curl -i -X POST -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"name":"Brand1","description":"Description1","logo":"http://example.com/logo1.jpg","cover":"http://example.com/cover1.jpg","website":"http://example.com"}' http://example.com/brands
```

#### Response

```json
{
  "id": 1,
  "name": "Brand1",
  "cover": "http://example.com/cover1.jpg",
  "logo": "http://example.com/logo1.jpg",
  "website": "http://example.com",
  "createdAt": "2024-06-03T00:00:00.000Z",
  "updatedAt": "2024-06-03T00:00:00.000Z",
  "overallRanking": 0
}
```

### List brands

#### Request

`GET /brands`

```
curl -i -H 'Authorization: Bearer <token>' http://example.com/brands?page=1&perPage=10&name=Brand1
```

#### Response

```json
[
  {
    "id": 1,
    "name": "Brand1",
    "cover": "http://example.com/cover1.jpg",
    "logo": "http://example.com/logo1.jpg",
    "website": "http://example.com",
    "createdAt": "2024-06-03T00:00:00.000Z",
    "updatedAt": "2024-06-03T00:00:00.000Z",
    "overallRanking": 0
  }
]
```

### Detail by id

#### Request

`GET /brands/:id`

```
curl -i -H 'Authorization: Bearer <token>' http://example.com/brands/1
```

#### Response

```json
{
  "id": 1,
  "name": "Brand1",
  "cover": "http://example.com/cover1.jpg",
  "logo": "http://example.com/logo1.jpg",
  "website": "http://example.com",
  "createdAt": "2024-06-03T00:00:00.000Z",
  "updatedAt": "2024-06-03T00:00:00.000Z",
  "products":{
    "userRating":10,
    "friendsRating":10,
    "overallRanking":10,
    "totalRanking":5
  }
```

### Ratings

#### Create

##### Request

`POST /products`

```bash
curl -i -X POST -H 'Authorization: Bearer <your_access_token>' -d '{"rate": 1, "brandId": 1, "categoryId": 1, "preferProductId": 1, "link": "string", "image": "string", "name": "string"}' http://example.com/products
```

##### Response

```
HTTP/1.1 204 No Content
Date: <Date>
```

#### My products

##### Request

`GET /users/products?page=1&perPage=1&categoryId=1&name=string`

```bash
curl -i -H 'Authorization: Bearer <your_access_token>' http://example.com/users/products?page=1&perPage=1&categoryId=1&name=string
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
[
  {
    "id": 1,
    "brand": {
      "id": 1,
      "name": "string"
    },
    "rate": 1,
    "name": "string",
    "image": "string",
    "link": "string",
    "description": "text",
    "category": {
      "id": 1,
      "name": "string"
    },
    "createdAt": "Date"
  }
]
```

#### Ranked products from all users

##### Request

`GET /products/brands/:brandId?page=1&perPage=1`

```bash
curl -i -H 'Authorization: Bearer <your_access_token>' http://example.com/products/brands/:brandId?page=1&perPage=1
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
[
  {
    "id": 1,
    "brandId": 1,
    "rate": 1,
    "name": "string",
    "image": "string",
    "link": "string",
    "description": "text",
    "category": {
      "id": 1,
      "name": "string"
    },
    "createdAt": "Date"
  }
]
```

#### Ranked products from friends

##### Request

`GET /users/products/brands/:brandId/friends?page=1&perPage=1`

```bash
curl -i -H 'Authorization: Bearer <your_access_token>' http://example.com/users/products/brands/:brandId/friends?page=1&perPage=1
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
[
  {
    "id": 1,
    "brandId": 1,
    "rate": 1,
    "name": "string",
    "image": "string",
    "link": "string",
    "description": "text",
    "category": {
      "id": 1,
      "name": "string"
    },
    "createdAt": "Date"
  }
]
```

### Feed activities

#### List of friends

##### Request

`GET /feed-activities/friends?page=1&perPage=1`

```bash
curl -i -H 'Authorization: Bearer <your_access_token>' http://example.com/feed-activities/friends?page=1&perPage=1
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
[
  {
    "id": 1,
    "type": "string",
    "title": "string",
    "createdBy": {
      "id": 1,
      "username": "string"
    },
    "referenceData": {
      "id": 1,
      "brand": {
        "id": 1,
        "name": "string"
      },
      "rate": 1,
      "name": "string",
      "image": "string",
      "link": "string",
      "description": "text"
    },
    "createdAt": "Date",
    "updatedAt": "Date"
  }
]
```

#### List of all users

##### Request

`GET /feed-activities?page=1&perPage=1`

```bash
curl -i -H 'Authorization: Bearer <your_access_token>' http://example.com/feed-activities?page=1&perPage=1
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
[
  {
    "id": 1,
    "type": "string",
    "title": "string",
    "createdBy": {
      "id": 1,
      "username": "string"
    },
    "referenceData": {
      "id": 1,
      "brand": {
        "id": 1,
        "name": "string"
      },
      "rate": 1,
      "name": "string",
      "image": "string",
      "link": "string",
      "description": "text",
      "category": {
        "id": 1,
        "name": "string"
      }
    },
    "createdAt": "Date",
    "updatedAt": "Date"
  }
]
```

### Collections

#### Create collection

##### Request

`POST /collections`

```bash
curl -i -X POST -H 'Authorization: Bearer <your_access_token>' -d '{"name":"string"}' http://example.com/collections
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
{
  "id": 1,
  "name": "string",
  "itemCount": 1
}
```

#### My collections

##### Request

`GET /users/collections`

```bash
curl -i -H 'Authorization: Bearer <your_access_token>' http://example.com/users/collections
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
[
  {
    "id": 1,
    "name": "string",
    "itemCount": 1
  }
]
```

#### Add feed to collection

##### Request

`POST /collections/:id`

```bash
curl -i -X POST -H 'Authorization: Bearer <your_access_token>' -d '{"feedId": 1}' http://example.com/collections/:id
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
{
  "id": 1,
  "name": "string"
}
```

#### Wish list

##### Request

`GET /users/collections/wish-list?page=1&perPage=1&categoryId=1&name=string`

```bash
curl -i -H 'Authorization: Bearer <your_access_token>' http://example.com/users/collections/wish-list?page=1&perPage=1&categoryId=1&name=string
```

##### Response

```
HTTP/1.1 200 OK
Date: <Date>
Content-Type: application/json
Content-Length: XX
```

```json
[
  {
    "id": 1,
    "type": "string",
    "title": "string",
    "createdBy": {
      "id": 1,
      "username": "string"
    },
    "referenceData": {
      "id": 1,
      "brand": {
        "id": 1,
        "name": "string"
      },
      "rate": 1,
      "name": "string",
      "image": "string",
      "link": "string",
      "description": "text",
      "category": {
        "id": 1,
        "name": "string"
      }
    },
    "createdAt": "Date",
    "updatedAt": "Date"
  }
]
```
