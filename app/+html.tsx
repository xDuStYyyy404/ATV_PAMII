// Importa um reset de estilo do Expo Router para ScrollView
// - Garante que o ScrollView no web se comporte de forma semelhante ao mobile
import { ScrollViewStyleReset } from 'expo-router/html';

// Importa o tipo PropsWithChildren do React
// - Serve para tipar o componente Root e permitir receber "children"
import { type PropsWithChildren } from 'react';

/**
 * Este arquivo é exclusivo para WEB e é usado para configurar o HTML raiz
 * para cada página durante a renderização estática.
 * O conteúdo dessa função roda apenas em Node.js (server-side),
 * ou seja, não tem acesso ao DOM ou APIs do navegador diretamente.
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        // Define o documento HTML raiz
        <html lang="en">
            <head>
                {/* Define a codificação de caracteres */}
                <meta charSet="utf-8" />

                {/* Define compatibilidade com IE */}
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                {/* Define a viewport para dispositivos móveis, importante para responsividade */}
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/*
                    Desabilita o scroll padrão do body no web,
                    para que os componentes ScrollView se comportem como no mobile.
                    Se quiser permitir scroll no body (ex: mobile web), basta remover.
                */}
                <ScrollViewStyleReset />

                {/*
                    Define um estilo global usando CSS puro
                    - Evita que a tela pisque entre branco e preto ao trocar entre light/dark mode
                    - Usa media queries para aplicar fundo branco no light e preto no dark
                */}
                <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />

                {/* Aqui poderiam ser adicionados outros elementos <head> globais, como favicon, fontes, etc */}
                </head>

                {/* O corpo do HTML renderiza os componentes React (children) */}
                <body>{children}</body>
            </html>
        );
    }

// CSS global definido como string para ser injetado no <style>
const responsiveBackground = `
body {
  background-color: #fff; /* fundo branco no tema claro */
}
@media (prefers-color-scheme: dark) {
    body {
        background-color: #000; /* fundo preto no tema escuro */
    }
}`;
