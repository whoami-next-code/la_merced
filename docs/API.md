# API Reference — La Merced PyK

Base URL: `http://localhost:4000/api/v1` (desarrollo)

## Autenticación

Header: `Authorization: Bearer <supabase_access_token>`

---

## Health

```
GET /health
```

## Auth

```
GET  /auth/me          [Auth] Perfil + usuario
```

## Products

```
GET    /products                    Listado (?search, ?categoryId, ?brandId, ?page, ?limit)
GET    /products/low-stock          [Staff] Alertas stock
GET    /products/:id                Detalle
POST   /products                    [Staff] Crear
PATCH  /products/:id                [Staff] Actualizar
DELETE /products/:id                [Staff] Eliminar
```

## Categories & Brands

```
GET  /categories
POST /categories                    [Staff]
GET  /brands
POST /brands                        [Staff]
```

## Inventory

```
GET  /inventory/movements           [Staff] (?productId)
POST /inventory/movements           [Staff] entry|exit|adjustment
```

## Sales (POS)

```
GET  /sales                         [Staff]
GET  /sales/:id                     [Staff]
POST /sales                         [Staff] Crear venta
```

## Customers

```
GET  /customers                     [Staff] (?search)
GET  /customers/:id                 [Staff]
POST /customers                     [Staff]
```

## Orders

```
GET   /orders                       [Staff] (?status)
GET   /orders/track/:orderNumber    Público — seguimiento
PATCH /orders/:id/status            [Staff]
```

## Dashboard

```
GET /dashboard/overview             [Staff] KPIs completos
```

## Reports

```
GET /reports/dashboard              [Staff] (legacy, usar dashboard/overview)
GET /reports/top-products           [Staff]
```

## Promotions

```
GET  /promotions                    Público — activas
GET  /promotions/admin              [Admin]
POST /promotions                    [Admin]
```

## Users

```
GET   /users                        [Staff]
PATCH /users/:id/role               [Admin]
```

## Chatbot

```
POST /chatbot/chat                  { message, sessionId? }
GET  /chatbot/faq
```

---

## Códigos de respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Validación fallida |
| 401 | No autenticado |
| 403 | Sin permisos (RBAC) |
| 404 | No encontrado |
| 500 | Error interno |
