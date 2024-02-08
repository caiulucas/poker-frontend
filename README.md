# TP de Redes - Frontend

Este projeto foi desenvolvido em Typescript, usando React.

## Como rodar
Para rodar o projeto, você irá precisar do `pnpm` ou `npm` instalados.

Antes de mais nada, vá no arquivo `src/App.tsx` e altere a linha 40. Na instância do WebSocket, coloque o endereço de IP do seu servidor.

Agora, para realmente executar o projeto, rode:
```
pnpm i
```
ou
```
npm i
```
para instalar as dependências do projeto.

Com isto, basta executar:
```
pnpm dev --host
```
ou
```
npm run dev --host
```

e seu projeto estará no ar. Para ver seu frontend no ar, entre com seu navegador na URL disponível no seu terminal após executar o comando acima.