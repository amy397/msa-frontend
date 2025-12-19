# MSA Shopping Mall Architecture Design

## 1. Domain Design (ERD) - 각 서비스별 테이블 구조

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER-SERVICE (Port: 8081)                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐                                            │
│  │           users                 │                                            │
│  ├─────────────────────────────────┤                                            │
│  │ PK │ id          │ BIGINT       │                                            │
│  │    │ email       │ VARCHAR(50)  │ UNIQUE, NOT NULL                           │
│  │    │ password    │ VARCHAR(255) │ NOT NULL                                   │
│  │    │ name        │ VARCHAR(30)  │ NOT NULL                                   │
│  │    │ phone       │ VARCHAR(20)  │                                            │
│  │    │ role        │ ENUM         │ USER, ADMIN                                │
│  │    │ created_at  │ DATETIME     │                                            │
│  │    │ updated_at  │ DATETIME     │                                            │
│  └─────────────────────────────────┘                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PRODUCT-SERVICE (Port: 8082)                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐                                            │
│  │          products               │                                            │
│  ├─────────────────────────────────┤                                            │
│  │ PK │ id          │ BIGINT       │                                            │
│  │    │ name        │ VARCHAR(100) │ NOT NULL                                   │
│  │    │ description │ TEXT         │                                            │
│  │    │ price       │ DECIMAL      │ NOT NULL                                   │
│  │    │ stock       │ INT          │ NOT NULL                                   │
│  │    │ category    │ VARCHAR(50)  │                                            │
│  │    │ status      │ ENUM         │ AVAILABLE, OUT_OF_STOCK, DISCONTINUED      │
│  │    │ created_at  │ DATETIME     │                                            │
│  │    │ updated_at  │ DATETIME     │                                            │
│  └─────────────────────────────────┘                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                             ORDER-SERVICE (Port: 8083)                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐      ┌─────────────────────────────────┐   │
│  │           orders                │      │        order_items              │   │
│  ├─────────────────────────────────┤      ├─────────────────────────────────┤   │
│  │ PK │ id          │ BIGINT       │      │ PK │ id          │ BIGINT       │   │
│  │ FK │ user_id     │ BIGINT       │◄────►│ FK │ order_id    │ BIGINT       │   │
│  │    │ email       │ VARCHAR(100) │      │    │ product_id  │ BIGINT       │   │
│  │    │ total_price │ DECIMAL      │      │    │ product_name│ VARCHAR(100) │   │
│  │    │ status      │ ENUM         │      │    │ price       │ DECIMAL      │   │
│  │    │ created_at  │ DATETIME     │      │    │ quantity    │ INT          │   │
│  │    │ updated_at  │ DATETIME     │      └─────────────────────────────────┘   │
│  └─────────────────────────────────┘                                            │
│                                                                                 │
│  OrderStatus: PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PAYMENT-SERVICE (Port: 8084)                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐                                            │
│  │          payments               │                                            │
│  ├─────────────────────────────────┤                                            │
│  │ PK │ id          │ BIGINT       │                                            │
│  │ FK │ order_id    │ BIGINT       │                                            │
│  │    │ amount      │ DECIMAL      │ NOT NULL                                   │
│  │    │ method      │ ENUM         │ CARD, BANK_TRANSFER                        │
│  │    │ status      │ ENUM         │ PENDING, COMPLETED, FAILED, REFUNDED       │
│  │    │ payment_key │ VARCHAR(100) │                                            │
│  │    │ created_at  │ DATETIME     │                                            │
│  └─────────────────────────────────┘                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Entity Relationship Diagram (논리적 관계)

```
                    ┌──────────────┐
                    │    Users     │
                    │  (user-svc)  │
                    └──────┬───────┘
                           │ 1:N (user_id로 참조)
                           │
                    ┌──────▼───────┐         ┌──────────────┐
                    │    Orders    │────────►│   Payments   │
                    │ (order-svc)  │   1:1   │ (payment-svc)│
                    └──────┬───────┘         └──────────────┘
                           │ 1:N
                           │
                    ┌──────▼───────┐         ┌──────────────┐
                    │  OrderItems  │────────►│   Products   │
                    │ (order-svc)  │   N:1   │(product-svc) │
                    └──────────────┘         └──────────────┘
```

---

## 2. K8s Deployment Architecture - 온프레미스 클러스터 구성

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Kubernetes On-Premise Cluster                            │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                           Master Node (Control Plane)                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ API Server  │  │  Scheduler  │  │ Controller  │  │      etcd       │   │  │
│  │  │             │  │             │  │   Manager   │  │  (Key-Value DB) │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                              Worker Node 1                                │  │
│  │  ┌─────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                        Namespace: msa-shop                          │  │  │
│  │  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │  │  │
│  │  │  │   Pod: Gateway   │  │  Pod: User-Svc   │  │ Pod: Product-Svc │   │  │  │
│  │  │  │   (Replicas: 2)  │  │   (Replicas: 2)  │  │   (Replicas: 2)  │   │  │  │
│  │  │  │   Port: 9090     │  │   Port: 8081     │  │   Port: 8082     │   │  │  │
│  │  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                              Worker Node 2                                │  │
│  │  ┌─────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                        Namespace: msa-shop                          │  │  │
│  │  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │  │  │
│  │  │  │  Pod: Order-Svc  │  │ Pod: Payment-Svc │  │  Pod: Frontend   │   │  │  │
│  │  │  │   (Replicas: 2)  │  │   (Replicas: 2)  │  │   (Replicas: 2)  │   │  │  │
│  │  │  │   Port: 8083     │  │   Port: 8084     │  │   Port: 3000     │   │  │  │
│  │  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                              Worker Node 3                                │  │
│  │  ┌─────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                        Namespace: database                          │  │  │
│  │  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │  │  │
│  │  │  │  Pod: MySQL-User │  │ Pod: MySQL-Order │  │Pod: MySQL-Product│   │  │  │
│  │  │  │   (StatefulSet)  │  │   (StatefulSet)  │  │   (StatefulSet)  │   │  │  │
│  │  │  │   Port: 3306     │  │   Port: 3307     │  │   Port: 3308     │   │  │  │
│  │  │  │      + PVC       │  │      + PVC       │  │      + PVC       │   │  │  │
│  │  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### K8s Resources 구성

```yaml
# Deployment 예시
┌─────────────────────────────────────────────────────────────────┐
│ Service Type        │ Replicas │ Resource Limits                │
├─────────────────────┼──────────┼────────────────────────────────┤
│ gateway-service     │    2     │ CPU: 500m, Memory: 512Mi       │
│ user-service        │    2     │ CPU: 500m, Memory: 512Mi       │
│ product-service     │    2     │ CPU: 500m, Memory: 512Mi       │
│ order-service       │    2     │ CPU: 500m, Memory: 512Mi       │
│ payment-service     │    2     │ CPU: 500m, Memory: 512Mi       │
│ frontend            │    2     │ CPU: 200m, Memory: 256Mi       │
│ mysql (StatefulSet) │    1     │ CPU: 1000m, Memory: 1Gi        │
└─────────────────────┴──────────┴────────────────────────────────┘
```

---

## 3. Service Communication Flow - 주문/결제 플로우

### 3.1 주문 생성 플로우

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │ Gateway  │     │  Order   │     │   User   │     │ Product  │
│(Frontend)│     │ Service  │     │ Service  │     │ Service  │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1. POST /api/orders             │                │                │
     │ {userId, email, items}          │                │                │
     │───────────────►│                │                │                │
     │                │                │                │                │
     │                │ 2. Route to    │                │                │
     │                │    Order-Svc   │                │                │
     │                │───────────────►│                │                │
     │                │                │                │                │
     │                │                │ 3. Verify User │                │
     │                │                │───────────────►│                │
     │                │                │                │                │
     │                │                │◄───────────────│                │
     │                │                │  User Found    │                │
     │                │                │                │                │
     │                │                │ 4. Get Product │                │
     │                │                │    & Decrease  │                │
     │                │                │    Stock       │                │
     │                │                │───────────────────────────────►│
     │                │                │                │                │
     │                │                │◄───────────────────────────────│
     │                │                │  Product Info  │                │
     │                │                │                │                │
     │                │◄───────────────│                │                │
     │                │  Order Created │                │                │
     │◄───────────────│                │                │                │
     │  OrderResponse │                │                │                │
     │                │                │                │                │
```

### 3.2 결제 플로우 (카드 결제 - Toss Payments)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │   Toss   │     │ Gateway  │     │ Payment  │     │  Order   │
│(Frontend)│     │ Payments │     │ Service  │     │ Service  │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1. 결제창 호출  │                │                │                │
     │   (Client SDK) │                │                │                │
     │───────────────►│                │                │                │
     │                │                │                │                │
     │◄───────────────│                │                │                │
     │ 2. 결제 승인   │                │                │                │
     │    결과 반환   │                │                │                │
     │    (paymentKey)│                │                │                │
     │                │                │                │                │
     │ 3. 결제 확인 요청                │                │                │
     │ POST /api/payments/confirm      │                │                │
     │───────────────────────────────►│                │                │
     │                │                │                │                │
     │                │                │───────────────►│                │
     │                │                │                │                │
     │                │                │                │ 4. Toss API    │
     │                │◄───────────────────────────────│    결제 승인   │
     │                │                │                │                │
     │                │───────────────────────────────►│                │
     │                │                │                │ Payment OK     │
     │                │                │                │                │
     │                │                │                │ 5. Update      │
     │                │                │                │    Order Status│
     │                │                │                │───────────────►│
     │                │                │                │                │
     │                │                │                │◄───────────────│
     │                │                │◄───────────────│   CONFIRMED    │
     │◄───────────────────────────────│  Payment Done  │                │
     │   결제 완료     │                │                │                │
```

### 3.3 무통장입금 플로우

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │ Gateway  │     │  Order   │     │  Admin   │
│(Frontend)│     │ Service  │     │ Service  │     │(Frontend)│
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. 주문 생성 (무통장입금)        │                │
     │ POST /api/orders               │                │
     │ {status: PENDING}              │                │
     │───────────────►│───────────────►│                │
     │                │                │                │
     │◄───────────────│◄───────────────│                │
     │ 계좌 정보 표시  │   Order Created│                │
     │                │  (PENDING)     │                │
     │                │                │                │
     │                │                │                │ 2. 관리자가
     │                │                │                │    입금 확인
     │                │                │                │
     │                │                │ 3. 상태 변경   │
     │                │                │◄───────────────│
     │                │                │ PATCH /status  │
     │                │                │ ?status=CONFIRMED
     │                │                │                │
     │                │                │───────────────►│
     │                │                │   Updated      │
```

---

## 4. Network Configuration - K8s 네트워크 설계

### 4.1 Overall Network Architecture

```
                              ┌─────────────────────────────────────┐
                              │           External Network          │
                              │         (Internet / Users)          │
                              └──────────────────┬──────────────────┘
                                                 │
                                                 │ HTTPS (443)
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                                  Ingress Controller                            │
│                               (NGINX / Traefik)                                │
│                                                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │  Rules:                                                                 │  │
│   │  - shop.example.com        → frontend-service:3000                      │  │
│   │  - api.shop.example.com    → gateway-service:9090                       │  │
│   │  - admin.shop.example.com  → frontend-service:3000 (admin routes)       │  │
│   └─────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
                                                 │
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                            Kubernetes Cluster Network                          │
│                              (Pod Network: Calico)                             │
│                             CIDR: 10.244.0.0/16                                │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                      Namespace: msa-shop                                 │  │
│  │                      Service CIDR: 10.96.0.0/12                          │  │
│  │                                                                          │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │   │                    ClusterIP Services                           │    │  │
│  │   │                                                                 │    │  │
│  │   │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │    │  │
│  │   │  │ gateway-svc   │  │  user-svc     │  │ product-svc   │        │    │  │
│  │   │  │ 10.96.1.1:9090│  │10.96.1.2:8081 │  │10.96.1.3:8082 │        │    │  │
│  │   │  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘        │    │  │
│  │   │          │                  │                  │                │    │  │
│  │   │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │    │  │
│  │   │  │  order-svc    │  │ payment-svc   │  │ frontend-svc  │        │    │  │
│  │   │  │10.96.1.4:8083 │  │10.96.1.5:8084 │  │10.96.1.6:3000 │        │    │  │
│  │   │  └───────────────┘  └───────────────┘  └───────────────┘        │    │  │
│  │   └─────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                          │  │
│  │   Service Discovery: Kubernetes DNS (CoreDNS)                            │  │
│  │   - gateway-svc.msa-shop.svc.cluster.local                               │  │
│  │   - user-svc.msa-shop.svc.cluster.local                                  │  │
│  │   - product-svc.msa-shop.svc.cluster.local                               │  │
│  │   - order-svc.msa-shop.svc.cluster.local                                 │  │
│  │   - payment-svc.msa-shop.svc.cluster.local                               │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                      Namespace: database                                 │  │
│  │                                                                          │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │   │                    Headless Services                            │    │  │
│  │   │                                                                 │    │  │
│  │   │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │    │  │
│  │   │  │ mysql-user    │  │ mysql-order   │  │mysql-product  │        │    │  │
│  │   │  │  :3306        │  │   :3306       │  │   :3306       │        │    │  │
│  │   │  │ (StatefulSet) │  │ (StatefulSet) │  │ (StatefulSet) │        │    │  │
│  │   │  └───────────────┘  └───────────────┘  └───────────────┘        │    │  │
│  │   └─────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                          │  │
│  │   PersistentVolume: NFS / Local Storage                                  │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Frontend 포함 전체 트래픽 흐름

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Complete Traffic Flow (Frontend to Backend)                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌──────────────────┐                                                          │
│   │   사용자 브라우저  │                                                          │
│   │  (External User) │                                                          │
│   └────────┬─────────┘                                                          │
│            │                                                                    │
│            │ ① HTTPS Request: https://shop.example.com                         │
│            ▼                                                                    │
│   ┌────────────────────────────────────────────────────────────────────────┐    │
│   │                        Ingress Controller                              │    │
│   │                      (NGINX / Traefik)                                 │    │
│   │                                                                        │    │
│   │   Host: shop.example.com  →  frontend-svc:3000 (React SPA)             │    │
│   │   Path: /api/*            →  gateway-svc:9090 (API Gateway)            │    │
│   └────────────────────┬──────────────────────────┬────────────────────────┘    │
│                        │                          │                             │
│          ② 정적 파일 요청                    ③ API 요청                          │
│          (HTML, JS, CSS)                   (/api/*)                            │
│                        │                          │                             │
│                        ▼                          ▼                             │
│   ┌──────────────────────────┐    ┌──────────────────────────────────────┐      │
│   │     Frontend Pod         │    │          Gateway Pod                 │      │
│   │   (React App - Nginx)    │    │     (Spring Cloud Gateway)           │      │
│   │                          │    │                                      │      │
│   │  ┌────────────────────┐  │    │   Route Rules:                       │      │
│   │  │  Static Files:     │  │    │   /api/users/**   → user-svc:8081    │      │
│   │  │  - index.html      │  │    │   /api/products/**→ product-svc:8082 │      │
│   │  │  - main.js         │  │    │   /api/orders/**  → order-svc:8083   │      │
│   │  │  - styles.css      │  │    │   /api/payments/**→ payment-svc:8084 │      │
│   │  └────────────────────┘  │    │                                      │      │
│   │                          │    │   JWT Validation (각 요청마다)        │      │
│   │  Nginx Config:           │    └──────────────────┬───────────────────┘      │
│   │  - SPA fallback          │                       │                          │
│   │  - Gzip compression      │                       ▼                          │
│   └──────────────────────────┘    ┌──────────────────────────────────────┐      │
│            │                      │         Backend Services              │      │
│            │                      │                                      │      │
│            │                      │  ┌──────────┐  ┌──────────┐          │      │
│            ▼                      │  │user-svc  │  │product-  │          │      │
│   ④ React SPA 로드 완료           │  │  :8081   │  │svc:8082  │          │      │
│   브라우저에서 JavaScript 실행     │  └────┬─────┘  └────┬─────┘          │      │
│            │                      │       │             │                │      │
│            │                      │  ┌──────────┐  ┌──────────┐          │      │
│            │                      │  │order-svc │  │payment-  │          │      │
│            ▼                      │  │  :8083   │  │svc:8084  │          │      │
│   ⑤ 사용자 액션 (로그인, 주문 등)  │  └────┬─────┘  └────┬─────┘          │      │
│            │                      │       │             │                │      │
│            │                      └───────┼─────────────┼────────────────┘      │
│            │                              │             │                       │
│            └──────────────────────────────┼─────────────┘                       │
│                                           ▼                                     │
│                               ┌──────────────────────┐                          │
│                               │   MySQL Databases    │                          │
│                               │   (Namespace: db)    │                          │
│                               └──────────────────────┘                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                              트래픽 흐름 상세 설명

┌─────────────────────────────────────────────────────────────────────────────────┐
│  단계  │  설명                                                                  │
├────────┼────────────────────────────────────────────────────────────────────────┤
│   ①   │  사용자가 https://shop.example.com 접속                                │
│        │  Ingress Controller가 요청 수신                                        │
├────────┼────────────────────────────────────────────────────────────────────────┤
│   ②   │  정적 파일 요청 (/, /products, /login 등)                              │
│        │  → frontend-svc로 라우팅 → React 빌드 파일(index.html, JS) 반환        │
├────────┼────────────────────────────────────────────────────────────────────────┤
│   ③   │  API 요청 (/api/*)                                                     │
│        │  → gateway-svc로 라우팅 → 각 마이크로서비스로 프록시                    │
├────────┼────────────────────────────────────────────────────────────────────────┤
│   ④   │  브라우저에서 React SPA 실행                                           │
│        │  - Zustand 스토어 초기화                                              │
│        │  - localStorage에서 JWT 토큰 복원                                     │
│        │  - React Router로 클라이언트 라우팅                                   │
├────────┼────────────────────────────────────────────────────────────────────────┤
│   ⑤   │  사용자 액션 시 Axios로 API 호출                                       │
│        │  - Authorization: Bearer <JWT> 헤더 자동 첨부                         │
│        │  - 요청: Browser → Ingress → Gateway → Service → DB                   │
│        │  - 응답: DB → Service → Gateway → Ingress → Browser                   │
└────────┴────────────────────────────────────────────────────────────────────────┘
```

### 4.2.1 Frontend Kubernetes 배포 구성

```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: msa-shop
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: msa-shop/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
# frontend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: msa-shop
spec:
  selector:
    app: frontend
  ports:
  - port: 3000
    targetPort: 80
  type: ClusterIP
---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: msa-shop-ingress
  namespace: msa-shop
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - shop.example.com
    secretName: shop-tls-secret
  rules:
  - host: shop.example.com
    http:
      paths:
      # API 요청은 Gateway로 라우팅
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: gateway-svc
            port:
              number: 9090
      # 나머지 모든 요청은 Frontend로 라우팅
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 3000
```

### 4.2.2 Frontend Dockerfile (Production Build)

```dockerfile
# Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf - SPA 라우팅 지원
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # SPA fallback - 모든 경로를 index.html로
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4.3 Network Policies (네트워크 보안)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            Network Policies                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ Policy: allow-frontend-to-gateway                                       │    │
│  │ From: frontend pods                                                     │    │
│  │ To: gateway-service (Port 9090)                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ Policy: allow-gateway-to-services                                       │    │
│  │ From: gateway-service pods                                              │    │
│  │ To: user-svc, product-svc, order-svc, payment-svc                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ Policy: allow-services-to-database                                      │    │
│  │ From: user-svc, product-svc, order-svc                                  │    │
│  │ To: mysql pods (Port 3306)                                              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ Policy: allow-order-to-other-services                                   │    │
│  │ From: order-service pods                                                │    │
│  │ To: user-svc (Port 8081), product-svc (Port 8082)                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ Policy: deny-all-ingress (Default)                                      │    │
│  │ Deny all incoming traffic except explicitly allowed                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Port Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                      Service Port Mapping                       │
├─────────────────────┬──────────────┬────────────────────────────┤
│      Service        │     Port     │        Description         │
├─────────────────────┼──────────────┼────────────────────────────┤
│ Frontend (React)    │     3000     │ Web Application            │
│ Gateway Service     │     9090     │ API Gateway                │
│ User Service        │     8081     │ User Management            │
│ Product Service     │     8082     │ Product Catalog            │
│ Order Service       │     8083     │ Order Processing           │
│ Payment Service     │     8084     │ Payment Processing         │
│ MySQL               │     3306     │ Database                   │
│ Ingress (HTTP)      │       80     │ External HTTP              │
│ Ingress (HTTPS)     │      443     │ External HTTPS             │
└─────────────────────┴──────────────┴────────────────────────────┘
```

---

## 5. Frontend Architecture - msa-frontend 설계

### 5.1 프로젝트 구조

```
msa-frontend/
├── public/
│   └── index.html              # Toss Payments SDK 로드
├── src/
│   ├── api/                    # API 통신 레이어
│   │   ├── client.js           # Axios 인스턴스 (인터셉터)
│   │   ├── userApi.js          # 사용자 API
│   │   ├── productApi.js       # 상품 API
│   │   ├── orderApi.js         # 주문 API
│   │   └── paymentApi.js       # 결제 API
│   │
│   ├── stores/                 # 상태 관리 (Zustand)
│   │   ├── userStore.js        # 인증/사용자 상태
│   │   └── cartStore.js        # 장바구니 상태
│   │
│   ├── hooks/                  # Custom Hooks
│   │   ├── useUser.js          # 사용자 관련 훅
│   │   ├── useProducts.js      # 상품 관련 훅
│   │   ├── useOrder.js         # 주문 관련 훅
│   │   └── useCart.js          # 장바구니 관련 훅
│   │
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── Login.jsx           # 로그인
│   │   ├── SignUp.jsx          # 회원가입
│   │   ├── AdminSignUp.jsx     # 관리자 회원가입
│   │   ├── ProductShop.jsx     # 상품 목록 (쇼핑)
│   │   ├── ProductAdmin.jsx    # 상품 관리 (관리자)
│   │   ├── Checkout.jsx        # 결제 페이지
│   │   ├── OrderHistory.jsx    # 주문 내역 (고객)
│   │   ├── AdminOrders.jsx     # 주문 관리 (관리자)
│   │   ├── PaymentSuccess.jsx  # 결제 성공
│   │   ├── PaymentFail.jsx     # 결제 실패
│   │   ├── MyPage.jsx          # 마이페이지
│   │   └── UserList.jsx        # 회원 관리 (관리자)
│   │
│   ├── components/             # 공통 컴포넌트
│   │   └── Navbar.jsx          # 네비게이션 바
│   │
│   ├── App.js                  # 라우팅 설정
│   └── setupProxy.js           # 개발 프록시 설정
│
├── docs/                       # 설계 문서
└── package.json
```

### 5.2 페이지 라우팅 구조

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              React Router 구조                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         Public Routes (모든 사용자)                      │   │
│   ├─────────────────────────────────────────────────────────────────────────┤   │
│   │  /                    → Home (메인 페이지)                              │   │
│   │  /login               → Login (로그인)                                  │   │
│   │  /signup              → SignUp (회원가입)                               │   │
│   │  /admin/signup        → AdminSignUp (관리자 가입)                       │   │
│   │  /products            → ProductShop (상품 목록)                         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                     User Routes (로그인 사용자)                          │   │
│   ├─────────────────────────────────────────────────────────────────────────┤   │
│   │  /checkout            → Checkout (장바구니/결제)                        │   │
│   │  /orders              → OrderHistory (주문 내역)                        │   │
│   │  /mypage              → MyPage (마이페이지)                             │   │
│   │  /payment/success     → PaymentSuccess (결제 완료)                      │   │
│   │  /payment/fail        → PaymentFail (결제 실패)                         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                      Admin Routes (관리자 전용)                          │   │
│   ├─────────────────────────────────────────────────────────────────────────┤   │
│   │  /admin/orders        → AdminOrders (주문 관리)                         │   │
│   │  /admin/products      → ProductAdmin (상품 관리)                        │   │
│   │  /admin/users         → UserList (회원 관리)                            │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 상태 관리 (Zustand)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              State Management                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────────────────────────────────┐   ┌─────────────────────────────────┐ │
│   │         userStore.js                │   │         cartStore.js            │ │
│   ├─────────────────────────────────────┤   ├─────────────────────────────────┤ │
│   │                                     │   │                                 │ │
│   │  State:                             │   │  State:                         │ │
│   │  ├─ isAuthenticated                 │   │  ├─ items[]                     │ │
│   │  ├─ currentUser                     │   │  ├─ totalAmount                 │ │
│   │  │   ├─ id                          │   │  └─ totalCount                  │ │
│   │  │   ├─ email                       │   │                                 │ │
│   │  │   ├─ name                        │   │  Actions:                       │ │
│   │  │   └─ role (USER/ADMIN)           │   │  ├─ addItem(product)            │ │
│   │  ├─ token (JWT)                     │   │  ├─ removeItem(id)              │ │
│   │  └─ isAdminMode                     │   │  ├─ updateQuantity(id, qty)     │ │
│   │                                     │   │  └─ clearCart()                 │ │
│   │  Actions:                           │   │                                 │ │
│   │  ├─ login(email, password)          │   │  Persist: localStorage          │ │
│   │  ├─ logout()                        │   │  (cart-storage)                 │ │
│   │  ├─ signUp(data)                    │   │                                 │ │
│   │  ├─ initAuth()                      │   └─────────────────────────────────┘ │
│   │  └─ fetchCurrentUser(id)            │                                       │
│   │                                     │                                       │
│   │  Persist: localStorage              │                                       │
│   │  (user-storage)                     │                                       │
│   └─────────────────────────────────────┘                                       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 API 통신 흐름

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API Communication Layer                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ┌─────────┐     ┌─────────┐     ┌───────────────┐     ┌───────────────────┐   │
│   │  Page   │────►│  Hook   │────►│    API        │────►│  setupProxy.js    │   │
│   │Component│     │(Custom) │     │  (Axios)      │     │  (Dev Proxy)      │   │
│   └─────────┘     └─────────┘     └───────────────┘     └─────────┬─────────┘   │
│                                                                    │             │
│                                                                    ▼             │
│                                                         ┌───────────────────┐   │
│                                                         │  Gateway Service  │   │
│                                                         │  localhost:9090   │   │
│                                                         └───────────────────┘   │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         client.js (Axios 설정)                          │   │
│   ├─────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                         │   │
│   │  const client = axios.create({                                          │   │
│   │    baseURL: '/api',                                                     │   │
│   │    headers: { 'Content-Type': 'application/json' }                      │   │
│   │  });                                                                    │   │
│   │                                                                         │   │
│   │  // Request Interceptor: JWT 토큰 자동 첨부                              │   │
│   │  client.interceptors.request.use(config => {                            │   │
│   │    const token = localStorage.getItem('token');                         │   │
│   │    if (token) config.headers.Authorization = `Bearer ${token}`;         │   │
│   │    return config;                                                       │   │
│   │  });                                                                    │   │
│   │                                                                         │   │
│   │  // Response Interceptor: 에러 핸들링                                    │   │
│   │  client.interceptors.response.use(                                      │   │
│   │    response => response,                                                │   │
│   │    error => { /* 401 처리 등 */ }                                       │   │
│   │  );                                                                     │   │
│   │                                                                         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.5 컴포넌트 계층 구조

```
                                    App.js
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                 Navbar          BrowserRouter      Routes
                    │                                   │
        ┌───────────┴───────────┐         ┌────────────┴────────────┐
        │                       │         │                         │
    Logo/Links           User Menu      Public              Protected
        │                    │          Routes               Routes
   ┌────┴────┐          ┌────┴────┐        │                    │
   │         │          │         │        │                    │
상품  장바구니  로그인/  로그아웃  ┌────┴────┐         ┌────────┴────────┐
(모두) (일반)   회원가입  (인증시)  │         │         │                 │
                              Home    Products   User Routes    Admin Routes
                                                     │                │
                                              ┌──────┴──────┐   ┌─────┴─────┐
                                              │             │   │           │
                                          Checkout    OrderHistory  AdminOrders
                                          MyPage      Payment*    ProductAdmin
                                                                  UserList
```

### 5.6 인증 흐름 (JWT)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              JWT Authentication Flow                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. Login Request                                                               │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐                           │
│  │  Login   │  POST  │ Gateway  │  POST  │   User   │                           │
│  │   Page   │───────►│ Service  │───────►│ Service  │                           │
│  └──────────┘ /login └──────────┘        └────┬─────┘                           │
│                                                │                                │
│  2. JWT Token Response                         │                                │
│  ┌──────────┐        ┌──────────┐        ┌────▼─────┐                           │
│  │  Store   │◄───────│ Gateway  │◄───────│  Return  │                           │
│  │  Token   │ {      │ Service  │        │   JWT    │                           │
│  └──────────┘  accessToken,              └──────────┘                           │
│       │        user: {...}                                                      │
│       │       }                                                                 │
│       ▼                                                                         │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  localStorage                                                            │   │
│  │  ├─ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."                     │   │
│  │  └─ user-storage: { currentUser: {...}, isAuthenticated: true }          │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  3. Authenticated API Requests                                                  │
│  ┌──────────┐        ┌──────────┐        ┌──────────┐                           │
│  │   Any    │  GET   │  Axios   │  GET   │ Gateway  │                           │
│  │   Page   │───────►│Interceptor───────►│ Service  │                           │
│  └──────────┘        └──────────┘        └──────────┘                           │
│                      Headers: {                                                 │
│                        Authorization: "Bearer <token>"                          │
│                      }                                                          │
│                                                                                 │
│  4. JWT Token Structure (Payload)                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  {                                                                       │   │
│  │    "sub": "user@example.com",    // 이메일                                │   │
│  │    "userId": 1,                   // 사용자 ID                            │   │
│  │    "role": "USER",                // 권한 (USER/ADMIN)                    │   │
│  │    "iat": 1702987654,             // 발급 시간                            │   │
│  │    "exp": 1703073654              // 만료 시간 (24h)                      │   │
│  │  }                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.7 권한별 UI 분기

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Role-based UI Rendering                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        Navbar 메뉴 표시 로직                             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│        비로그인 사용자              일반 사용자 (USER)       관리자 (ADMIN)       │
│   ┌─────────────────────┐    ┌─────────────────────┐   ┌─────────────────────┐  │
│   │ • 상품               │    │ • 상품               │   │ • 상품               │  │
│   │ • 로그인             │    │ • 장바구니           │   │ • 주문관리           │  │
│   │ • 회원가입           │    │ • 주문내역           │   │ • 상품관리           │  │
│   │                     │    │ • [사용자]님         │   │ • 회원관리           │  │
│   │                     │    │ • 로그아웃           │   │ • [관리자] 님        │  │
│   │                     │    │                     │   │ • 로그아웃           │  │
│   └─────────────────────┘    └─────────────────────┘   └─────────────────────┘  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                          코드 예시 (Navbar.jsx)                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│   {/* 일반 사용자만 - 장바구니, 주문내역 */}                                     │
│   {isAuthenticated && !isAdmin && (                                             │
│     <>                                                                          │
│       <Link to="/checkout">장바구니</Link>                                       │
│       <Link to="/orders">주문내역</Link>                                         │
│     </>                                                                         │
│   )}                                                                            │
│                                                                                 │
│   {/* 관리자 전용 메뉴 */}                                                       │
│   {isAdmin && (                                                                  │
│     <>                                                                          │
│       <Link to="/admin/orders">주문관리</Link>                                   │
│       <Link to="/admin/products">상품관리</Link>                                 │
│       <Link to="/admin/users">회원관리</Link>                                    │
│     </>                                                                         │
│   )}                                                                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.8 기술 스택 상세

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Frontend Tech Stack                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   Category          │  Technology       │  Version    │  Purpose               │
│   ──────────────────┼───────────────────┼─────────────┼────────────────────────│
│   Framework         │  React            │  18.x       │  UI Library            │
│   Routing           │  React Router     │  6.x        │  SPA Navigation        │
│   State Management  │  Zustand          │  4.x        │  Global State          │
│   HTTP Client       │  Axios            │  1.x        │  API Communication     │
│   Styling           │  Tailwind CSS     │  3.x        │  Utility-first CSS     │
│   Payment           │  Toss Payments    │  SDK        │  결제 연동             │
│   Dev Proxy         │  http-proxy-mw    │  2.x        │  개발 서버 프록시       │
│   Build Tool        │  Create React App │  5.x        │  빌드/번들링           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

| 구분 | 기술 스택 |
|------|----------|
| Frontend | React 18, Tailwind CSS, Zustand |
| Backend | Spring Boot 3.x, Spring Cloud Gateway |
| Database | MySQL 8.x (서비스별 분리) |
| Container | Docker, Kubernetes |
| Ingress | NGINX Ingress Controller |
| Network | Calico CNI |
| Storage | NFS / Local Persistent Volume |
| Payment | Toss Payments API |

---

*Generated: 2025-12-19*
