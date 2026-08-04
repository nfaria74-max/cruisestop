# Ícones do PWA

Esta pasta deve conter os ícones do aplicativo em diferentes tamanhos.

## Tamanhos Necessários

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels  
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels
- `favicon.ico` - 16x16, 32x32, 48x48 pixels

## Como Gerar

1. Crie uma imagem de alta qualidade (mínimo 512x512 pixels)
2. Use ferramentas online como:
   - [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
   - [Favicon Generator](https://favicon.io/)
   - [Real Favicon Generator](https://realfavicongenerator.net/)

3. Ou use scripts como:
   ```bash
   npm install -g pwa-asset-generator
   pwa-asset-generator your-image.png ./icons/
   ```

## Design Recommendations

- Use fundo transparente para melhor adaptação
- Mantenha o design simples e reconhecível
- Use cores que funcionem bem em diferentes fundos
- Teste em diferentes dispositivos e navegadores
