# 📸 React Face Biometry (Client-Side)

Este projeto é uma Prova de Conceito (PoC) de um sistema de **validação biométrica facial** rodando inteiramente no navegador (Client-Side). 

O objetivo foi criar uma interface de captura inteligente que detecta rostos em tempo real, fornece feedback visual ao usuário e persiste a imagem capturada simulando um fluxo de aplicação MPA (Multi-Page Application).

## 🚀 Funcionalidades

- **Detecção Facial em Tempo Real:** Utiliza Inteligência Artificial para identificar rostos via webcam sem enviar o vídeo para o servidor.
- **Feedback Visual (UX):**
  - 🔴 **Borda Vermelha:** Nenhum rosto detectado.
  - 🟢 **Borda Verde:** Rosto detectado e centralizado.
- **Captura Automática:** O sistema tira a foto automaticamente após validar a presença do rosto, com um delay de segurança para garantir a melhor pose.
- **Persistência de Dados (MPA):** Salva a imagem (Base64) no `localStorage` para simular a passagem de dados entre páginas ou sessões.
- **Performance:** Renderização otimizada usando `requestAnimationFrame` para não travar a UI durante o processamento da IA.

## 🛠️ Tecnologias Utilizadas

- **[React](https://react.dev/) + [Vite](https://vitejs.dev/):** Estrutura do projeto e HMR rápido.
- **[TypeScript](https://www.typescriptlang.org/):** Para tipagem estática e segurança do código.
- **[Google MediaPipe Face Detection](https://developers.google.com/mediapipe):** Biblioteca oficial do Google para visão computacional.
  - *Nota:* Optou-se pela implementação direta da biblioteca oficial em vez de "wrappers" de terceiros para garantir compatibilidade, performance e controle total sobre o fluxo de dados.
- **[React Webcam](https://www.npmjs.com/package/react-webcam):** Gerenciamento do hardware de câmera.

## ⚙️ Como Funciona (Arquitetura)

### 1. O "Cérebro" (MediaPipe)
Diferente de soluções que enviam imagens para o backend (lento e custoso), este projeto baixa um modelo leve de Machine Learning (`.wasm`) para o navegador. A detecção ocorre em milissegundos localmente.

### 2. O Fluxo de Detecção
1. A webcam envia frames contínuos para um `<canvas>` invisível.
2. O `CameraUtils` processa esses frames e os envia para a instância do `FaceDetection`.
3. Se `detections.length > 0`, o estado da aplicação muda a borda para **Verde**.
4. Um "debounce" lógico trava a captura para evitar fotos duplicadas.

### 3. Persistência (Simulação MPA)
Para simular um cenário onde o usuário tira a foto em uma página e vê o resultado em outra (ou após um refresh), a imagem capturada é convertida em String Base64 e salva no `localStorage`.
> **Cenário Real:** Em produção, essa string seria enviada via `FormData` para uma API de validação de identidade.

## 📦 Como Rodar o Projeto

- git clone

- npm install

- npm run dev

Acesse no navegador e permita o uso da câmera.