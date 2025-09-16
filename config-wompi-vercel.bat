@echo off
echo ========================================
echo CONFIGURANDO WOMPI EN VERCEL - PRODUCCION
echo ========================================

echo.
echo Configurando variables de entorno de Wompi...

vercel env add WOMPI_PUBLIC_KEY
echo pub_prod_DMd1RNFhiA3813HZ3YZFsNjSg2beSS00 | vercel env add WOMPI_PUBLIC_KEY

vercel env add WOMPI_PRIVATE_KEY
echo prv_prod_aka7VAtItpCAF3qhVuD8zvt7FUWXduPY | vercel env add WOMPI_PRIVATE_KEY

vercel env add WOMPI_INTEGRITY_SECRET
echo prod_integrity_**************************** | vercel env add WOMPI_INTEGRITY_SECRET

vercel env add WOMPI_EVENTS_SECRET
echo prod_events_4ob12JL0RXAolocztVa9GThpUrGfy8Dn | vercel env add WOMPI_EVENTS_SECRET

vercel env add WOMPI_ENVIRONMENT
echo production | vercel env add WOMPI_ENVIRONMENT

echo.
echo ========================================
echo CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Variables configuradas:
echo - WOMPI_PUBLIC_KEY: pub_prod_DMd1RNFhiA3813HZ3YZFsNjSg2beSS00
echo - WOMPI_PRIVATE_KEY: prv_prod_aka7VAtItpCAF3qhVuD8zvt7FUWXduPY
echo - WOMPI_INTEGRITY_SECRET: prod_integrity_****************************
echo - WOMPI_EVENTS_SECRET: prod_events_4ob12JL0RXAolocztVa9GThpUrGfy8Dn
echo - WOMPI_ENVIRONMENT: production
echo.
echo Ahora ejecuta: vercel --prod
echo.
pause
