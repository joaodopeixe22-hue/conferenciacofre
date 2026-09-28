# Cofre Transparente

Aja como um especialista em desenvolvimento de aplicações no-code utilizando a plataforma Lovable, com foco em sistemas financeiros internos, auditáveis e confiáveis para o varejo farmacêutico.

Sua tarefa é criar um site de uso interno chamado “Conferência de Cofre – Farmácia”, que funcione como um sistema completo de conferência de dinheiro físico, com cálculos automáticos, totalizadores, alertas visuais e histórico imutável por responsável.

OBJETIVO DO SISTEMA

Criar um processo padronizado, rastreável e auditável para conferência de cofre, eliminando cálculos manuais, reduzindo erros humanos e garantindo total transparência operacional.

REGRAS GERAIS

Idioma: Português (Brasil)

Moeda: Real (R$)

Conferências finalizadas não podem ser editadas

Conferências antigas devem abrir apenas em modo leitura

O sistema deve permitir exportação para Excel e PDF

ESTRUTURA DO SISTEMA

O sistema deve permitir criar uma conferência por vez (por turno, dia ou auditoria) e manter um histórico completo, com filtros e agrupamentos por:

Data

Mês

Responsável

Tipo de numerário

📊 TABELA 1 – ITENS DA CONFERÊNCIA (CONTAGEM)

Crie uma tabela para os itens contados com as seguintes colunas:

Data da Conferência

Tipo: Data

Turno

Tipo: Seleção

Opções: Abertura, Intermediário, Fechamento

Responsável

Tipo: Texto

Tipo de Numerário

Tipo: Seleção

Opções: Moeda, Nota, Outro

Denominação

Tipo: Número ou Seleção

Valores possíveis:
0,05 – 0,10 – 0,25 – 0,50 – 1,00 – 2,00 – 5,00 – 10,00 – 20,00 – 50,00 – 100,00

Quantidade

Tipo: Número

Campo manual obrigatório

Valor Calculado (R$)

Tipo: Fórmula

Regra: Quantidade × Denominação

Categoria Financeira

Tipo: Seleção

Opções: Cofre, Fundo de Troco, Lastro, Diversos

Observações

Tipo: Texto

Obrigatório automaticamente quando houver diferença de valores

📈 TABELA 2 – RESUMO DA CONFERÊNCIA

Crie uma área de resumo automática contendo:

Total em Moedas

Soma dos valores onde Tipo de Numerário = Moeda

Total em Notas

Soma dos valores onde Tipo de Numerário = Nota

Total Geral do Cofre

Soma de todos os Valores Calculados (R$)

Valor Esperado

Campo manual digitado pelo responsável

Diferença

Fórmula: Total Geral − Valor Esperado

🎨 ALERTAS VISUAIS AUTOMÁTICOS

Aplique destaque visual automático conforme a diferença:

Diferença = 0 → Cor verde (conferência correta)

Diferença positiva → Cor azul (sobra)

Diferença negativa → Cor vermelha (falta)

Exibir alertas visuais claros e intuitivos

🔐 STATUS DA CONFERÊNCIA

Crie um campo de status com os valores:

Em andamento

Finalizada

Regras:

Quando status = Finalizada:

Todos os campos ficam bloqueados

Conferência entra em modo somente leitura

Permitido apenas visualizar e exportar

🗂️ HISTÓRICO DE CONFERÊNCIAS

Crie uma visualização de histórico exibindo:

Data

Turno

Responsável

Total Geral

Valor Esperado

Diferença (com destaque visual)

O histórico deve permitir:

Abrir conferências antigas apenas em modo leitura

Exportar conferência individual ou histórico filtrado

Nome automático dos arquivos exportados contendo data, turno e responsável

🎨 LAYOUT E EXPERIÊNCIA

O layout deve ser:

Estilo planilha (semelhante ao Excel)

Visual moderno, profissional e jovial

Interface limpa

Tipografia moderna

Cores neutras com destaques sutis

Foco em rapidez, clareza e facilidade de uso

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://conferenciacofre.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/38172e53-33b0-406a-8c66-a66c25069048).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
