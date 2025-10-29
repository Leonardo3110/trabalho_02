# Trabalho 02 - Programação Funcional: Mercado de Carbono

[cite_start]Este projeto é uma solução para o Trabalho 02 da disciplina de Linguagem de Programação e Paradigmas[cite: 1]. [cite_start]O objetivo é aplicar conceitos de programação funcional [cite: 11] para criar uma calculadora de créditos de carbono.

## 👨‍💻 Membros do Grupo

## Usuário do GitHub (@Leonardo3110)
## Membros (Leonardo Luis Abelino e Carlos Eduardo Nogueira)

---

## 🚀 Como Executar

[cite_start]A aplicação é uma página web estática (HTML, CSS, JS) e não requer instalação ou configuração complexa[cite: 34].

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/Leonardo3110/trabalho_02]
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd [trabalho02]
    ```
3.  Abra o arquivo `index.html` em qualquer navegador web moderno (como Chrome, Firefox, ou Edge).

---

## [cite_start]📋 Exemplos de Entrada e Saída [cite: 34, 38]

#### Exemplo 1: Emissões maiores que os créditos (Resulta em Custo)

* **Entrada:**
    * Créditos Disponíveis: 500t
    * Preço por Tonelada: R$ 50,00
    * Atividade 1 (Frota): 800t
    * Atividade 2 (Fábrica): 1200t
* **Saída:**
    * Emissão Total Bruta: 2000.00t
    * Créditos Aplicados: 500.00t
    * **Emissão Líquida: 1500.00t**
    * Custo para compensar: R$ 75.000,00
    * Receita potencial: R$ 0,00
    * **Balanço Financeiro (Custo Líquido): R$ 75.000,00**

#### Exemplo 2: Créditos maiores que as emissões (Resulta em Receita)

* **Entrada:**
    * Créditos Disponíveis: 3000t
    * Preço por Tonelada: R$ 50,00
    * Atividade 1 (Frota): 800t
    * Atividade 2 (Fábrica): 1200t
* **Saída:**
    * Emissão Total Bruta: 2000.00t
    * Créditos Aplicados: 2000.00t
    * **Emissão Líquida: 0.00t**
    * Custo para compensar: R$ 0,00
    * Receita potencial: R$ 50.000,00
    * **Balanço Financeiro (Receita Líquida): R$ 50.000,00**

#### [cite_start]Exemplo 3: Validação de Entrada [cite: 20]

* **Entrada:**
    * Créditos Disponíveis: 500t
    * Preço por Tonelada: R$ 50,00
    * Atividade 1 (Frota): -100t (valor inválido)
* **Saída (Erro):**
    * "Todas as atividades devem ter um nome e um valor de emissão numérico positivo."

---

## [cite_start]💡 Aplicação dos Conceitos de Programação Funcional 

Este projeto foi estruturado para separar a lógica de negócio (pura) da manipulação da interface (impura).

### [cite_start]1. Funções Puras e Imutabilidade [cite: 23, 24]

Toda a lógica de cálculo é contida em funções puras, que não alteram variáveis globais nem os dados de entrada. Elas recebem dados e retornam novos dados.

* [cite_start]`isPositiveNumber(value)`: Função de validação pura e reutilizável[cite: 13, 21].
* [cite_start]`validateInputs(...)`: Recebe os dados de entrada e retorna um objeto `{ isValid, message }` sem alterar nada[cite: 21].
* [cite_start]`parseActivities(activities)`: Recebe um array de atividades (string) e retorna um **novo** array com valores numéricos[cite: 24].
* `calculateTotalEmissions(activities)`: Recebe um array e retorna um número.
* [cite_start]`calculateNetResult(total, credits)`: Recebe números e retorna um **novo** objeto `{ netEmissions, ... }`[cite: 24].
* [cite_start]`calculateFinancials(net, remaining, price)`: Recebe números e retorna um **novo** objeto `{ cost, ... }`[cite: 24].
* `createBreakdown(activities, total)`: Recebe um array e um número. [cite_start]Retorna um **novo** array usando o *spread operator* (`...act`) para garantir a imutabilidade[cite: 24].
* `calculateCarbonMarket(...)`: É a composição de todas as funções puras acima.

### [cite_start]2. Funções de Ordem Superior (HOFs) [cite: 26]

Utilizamos HOFs nativas do JavaScript para processar os dados de forma declarativa:

* **`map`**: Usada em `parseActivities` para converter a lista de inputs (string) em uma lista de dados (number). [cite_start]Também usada em `createBreakdown` para criar o **novo** array de detalhamento, adicionando a porcentagem a cada atividade[cite: 26].
* [cite_start]**`reduce`**: Usada em `calculateTotalEmissions` para somar as emissões de todas as atividades em um único valor total[cite: 26].
* [cite_start]**`every`**: Usada em `validateInputs` para verificar se *todos* os elementos da lista de atividades atendem à condição de validação (nome preenchido e emissão positiva)[cite: 26].