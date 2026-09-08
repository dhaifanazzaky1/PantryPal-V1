# PantryPal API Documentation

Base URL (local): `http://localhost:<PORT>`

## Table of Contents
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Auth](#auth)
    - [POST /login](#post-login)
    - [POST /google-login](#post-google-login)
    - [POST /register](#post-register)
  - [Recipes](#recipes)
    - [GET /recipes](#get-recipes)
    - [GET /recipes/:id](#get-recipesid) 🔒
    - [POST /recipes/photo](#post-recipesphoto) 🔒
  - [AI](#ai)
    - [POST /ai/recipes](#post-airecipes) 🔒
  - [User](#user)
    - [PATCH /user/profile/:id](#patch-userprofileid) 🔒
    - [PATCH /user/name/:id](#patch-usernameid) 🔒
    - [GET /user/:id](#get-userid) 🔒
  - [Saved Recipes](#saved-recipes)
    - [POST /saved](#post-saved) 🔒
    - [GET /saved](#get-saved) 🔒
    - [GET /saved/:id](#get-savedid) 🔒
    - [DELETE /saved/:id](#delete-savedid) 🔒

🔒 = requires authentication (Bearer token)

---

## Authentication

Protected endpoints require a JWT access token sent via the `Authorization` header:

```
Authorization: Bearer <access_token>
```

The token is obtained from `POST /login`, `POST /google-login`, or `POST /register` and decodes to `{ id, email, name }`.

---

## Error Handling

All errors follow this shape:

```json
{
  "message": "<error message>"
}
```

| HTTP Status | Trigger | Message |
|---|---|---|
| 400 | Duplicate email on register | `email is already exists` |
| 400 | Sequelize validation error | (validation-specific message, e.g. `email is required`) |
| 400 | Invalid data type/format sent to DB | `invalid input` |
| 400 | Login with unregistered email | `email not registered yet` |
| 400 | Login with wrong password | `invalid password` |
| 400 | Missing/invalid `Authorization` header or token | `please login first` |
| 400 | Missing `ingredients` in AI request | `Ingredients are required` |
| 400 | Missing photo file in upload request | `photo required` |
| 400 | Missing `username` in patch name request | `username required` |
| 404 | Resource not found (user, saved recipe, recipe) | `Data Not Found` |
| 404 | No ingredients detected in photo | `no ingredient detected` |
| 500 | Uncaught/unexpected error | `internal server error` |

---

## Endpoints

### Auth

#### `POST /login`
Log in with email and password.

**Auth required:** No

**Request body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200 OK`**
```json
{
  "access_token": "<jwt_token>"
}
```

**Errors:** `400 email not registered yet`, `400 invalid password`

---

#### `POST /google-login`
Log in (or auto-register) using a Google ID token.

**Auth required:** No

**Headers**
| Header | Description |
|---|---|
| `token` | Google ID token from client-side Google Sign-In |

**Response `200 OK`**
```json
{
  "access_token": "<jwt_token>"
}
```

**Notes:** If the email doesn't exist yet, a new user is auto-created with a default password (`123123123`) and username from the Google profile.

---

#### `POST /register`
Register a new user.

**Auth required:** No

**Request body**
```json
{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "password123",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```
| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | string | No | |
| `email` | string | Yes | must be valid email format, unique |
| `password` | string | Yes | min 8 characters |
| `avatarUrl` | string | No | |

**Response `201 Created`**
```json
{
  "message": "succeed to register",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "avatarUrl": "https://example.com/avatar.jpg",
    "updatedAt": "...",
    "createdAt": "..."
  }
}
```

**Errors:** `400 email is already exists`, `400` (validation messages e.g. `min password is 8`)

---

### Recipes

#### `GET /recipes`
Search/browse recipes (proxied from Spoonacular), paginated.

**Auth required:** No

**Query params**
| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| `search` | string | No | - | search keyword |
| `page` | number | No | 1 | page number |

**Response `200 OK`**
```json
{
  "message": "succeed read recipes",
  "total": 120,
  "size": 20,
  "totalPage": 6,
  "currentPage": 1,
  "data": [ /* array of Spoonacular recipe objects */ ]
}
```

---

#### `GET /recipes/:id` 🔒
Get full details of a recipe by Spoonacular ID.

**Auth required:** Yes

**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | number | Spoonacular recipe ID |

**Response `200 OK`**
```json
{
  "recipe": {
    "id": 12345,
    "title": "Spaghetti Carbonara",
    "image": "https://...",
    "readyInMinutes": 30,
    "servings": 4,
    "summary": "<html summary text>"
  },
  "ingredients": [
    { "id": 1, "name": "spaghetti", "amount": 200, "unit": "g", "original": "200g spaghetti" }
  ],
  "instructions": [
    { "number": 1, "step": "Boil the pasta..." }
  ]
}
```

**Errors:** `404 Data Not Found` (invalid Spoonacular ID)

---

#### `POST /recipes/photo` 🔒
Upload a photo of ingredients; AI detects ingredients and returns recipe suggestions (delegates to the same logic as `/ai/recipes`).

**Auth required:** Yes

**Request:** `multipart/form-data`
| Field | Type | Required | Notes |
|---|---|---|---|
| `photo` | file | Yes | image file, field name must be `photo` |

**Response `200 OK`** — same shape as [`POST /ai/recipes`](#post-airecipes)

**Errors:** `400 photo required`, `404 no ingredient detected`

---

### AI

#### `POST /ai/recipes` 🔒
Suggest a recipe based on a list of ingredients. Tries Spoonacular first; falls back to Gemini AI-generated recipe if no good match found.

**Auth required:** Yes

**Request body**
```json
{
  "ingredients": ["chicken", "garlic", "onion"]
}
```

**Response `200 OK` (Spoonacular match found)**
```json
{
  "source": "spoonacular",
  "message": "Recipe found from Spoonacular",
  "data": [ /* array of up to 5 matched recipes */ ]
}
```

**Response `200 OK` (AI-generated fallback)**
```json
{
  "source": "gemini",
  "message": "Recipe generated by AI",
  "data": {
    "title": "Garlic Chicken Stir Fry",
    "readyInMinutes": 25,
    "servings": 2,
    "ingredients": [
      { "name": "chicken", "amount": 300, "unit": "g" }
    ],
    "instructions": ["Step 1...", "Step 2..."]
  }
}
```

**Errors:** `400 Ingredients are required`

---

### User

#### `PATCH /user/profile/:id` 🔒
Update user's profile photo (uploads to ImageKit).

**Auth required:** Yes

**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | number | User ID |

**Request:** `multipart/form-data`
| Field | Type | Required |
|---|---|---|
| `profile` | file | Yes |

**Response `200 OK`**
```json
{
  "message": "image user@example.com success to update",
  "data": "https://ik.imagekit.io/.../file.jpg"
}
```

**Errors:** `400 photo required`, `404 Data Not Found`

---

#### `PATCH /user/name/:id` 🔒
Update username.

**Auth required:** Yes

**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | number | User ID |

**Request body**
```json
{
  "username": "newusername"
}
```

**Response `200 OK`**
```json
{
  "message": "username user@example.com success to update",
  "data": "newusername"
}
```

**Errors:** `400 username required`, `404 Data Not Found`

---

#### `GET /user/:id` 🔒
Get a user's profile by ID.

**Auth required:** Yes

**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | number | User ID |

**Response `200 OK`**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "password": "<hashed>",
  "avatarUrl": "https://...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errors:** `404 Data Not Found`

---

### Saved Recipes

#### `POST /saved` 🔒
Save a recipe to the logged-in user's collection.

**Auth required:** Yes

**Request body**
```json
{
  "spoonacularId": 12345,
  "title": "Spaghetti Carbonara",
  "imageUrl": "https://..."
}
```

**Response `201 Created`**
```json
{
  "message": "succeed saved recipes",
  "data": {
    "id": 1,
    "userId": 1,
    "spoonacularId": 12345,
    "title": "Spaghetti Carbonara",
    "imageUrl": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /saved` 🔒
Get all saved recipes for the logged-in user (newest first).

**Auth required:** Yes

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "userId": 1,
    "spoonacularId": 12345,
    "title": "Spaghetti Carbonara",
    "imageUrl": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

#### `GET /saved/:id` 🔒
Get full detail (from Spoonacular) of a saved recipe entry owned by the logged-in user.

**Auth required:** Yes

**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | number | Saved recipe ID (local DB id, not Spoonacular ID) |

**Response `200 OK`**
```json
{
  "id": 12345,
  "title": "Spaghetti Carbonara",
  "image": "https://...",
  "readyInMinutes": 30,
  "servings": 4,
  "summary": "<html summary text>",
  "ingredients": [ /* raw Spoonacular extendedIngredients */ ],
  "instructions": [ /* raw Spoonacular analyzedInstructions */ ]
}
```

**Errors:** `404 Data Not Found`

---

#### `DELETE /saved/:id` 🔒
Remove a saved recipe from the logged-in user's collection.

**Auth required:** Yes

**Path params**
| Param | Type | Description |
|---|---|---|
| `id` | number | Saved recipe ID |

**Response `200 OK`**
```json
{
  "message": "Recipe removed from saved"
}
```

**Errors:** `404 Data Not Found`

---

## Environment Variables

| Key | Description |
|---|---|
| `PORT` | Port the server listens on |
| `JWT_SECRET` | Secret used to sign/verify JWT tokens |
| `CLIENTID_KEY` | Google OAuth Client ID (audience for Google login) |
| `IMAGEKIT_KEY` | ImageKit private key for image uploads |
| `GEMINI_API_KEY` | Google Gemini API key for AI recipe generation |
| `SPOONACULAR_API_KEY` | Spoonacular API key for recipe data |
