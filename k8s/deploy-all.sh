#!/bin/bash

echo "=== MSA E-Commerce Kubernetes 배포 ==="

# MySQL 먼저 배포
echo "1. MySQL 배포 중..."
kubectl apply -f mysql/

echo "MySQL 준비 대기 중 (30초)..."
sleep 30

# 백엔드 서비스 배포
echo "2. User Service 배포 중..."
kubectl apply -f user-service/

echo "3. Product Service 배포 중..."
kubectl apply -f product-service/

echo "4. Order Service 배포 중..."
kubectl apply -f order-service/

echo "5. Payment Service 배포 중..."
kubectl apply -f payment-service/

echo "6. Gateway Service 배포 중..."
kubectl apply -f gateway-service/

# 프론트엔드 배포
echo "7. Frontend 배포 중..."
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

echo ""
echo "=== 배포 완료! ==="
echo ""
kubectl get pods
echo ""
kubectl get svc
