#!/bin/bash

echo "============================================"
echo "Regenerando Cliente de Prisma"
echo "============================================"
echo ""
echo "IMPORTANTE: Cierra todos los servicios antes de ejecutar este script"
echo ""
read -p "Presiona Enter para continuar..."

echo ""
echo "Regenerando cliente de Prisma..."
cd shared/prisma
npx prisma generate

echo ""
echo "============================================"
echo "Cliente regenerado exitosamente"
echo "============================================"

