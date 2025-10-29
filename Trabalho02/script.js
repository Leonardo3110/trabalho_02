/*
[Comentário AI]: Este script foi gerado por IA para atender aos requisitos
do Trabalho 02 sobre Programação Funcional[cite: 2, 11].
Ele segue as diretrizes de funções puras [cite: 23], imutabilidade [cite: 24]
e uso de funções de ordem superior[cite: 26].
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- ZONA IMPURA: Manipulação do DOM (Event Listeners) ---
    // [Comentário AI]: Esta parte é impura por definição, pois lê e escreve no DOM.
    // Ela serve como a "casca" do programa, orquestrando as funções puras.

    const form = document.getElementById('carbon-form');
    const addActivityBtn = document.getElementById('add-activity');
    const activitiesContainer = document.getElementById('activities-container');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');

    // Evento para adicionar novas atividades
    addActivityBtn.addEventListener('click', () => {
        // [Comentário AI]: Impuro, pois modifica o DOM[cite: 6].
        const newActivityEntry = document.createElement('div');
        newActivityEntry.className = 'activity-entry';
        newActivityEntry.innerHTML = `
            <input type="text" class="activity-name" placeholder="Nome da Atividade">
            <input type="text" class="activity-emissions" placeholder="Emissões (toneladas)">
        `;
        activitiesContainer.appendChild(newActivityEntry);
    });

    // Evento principal para calcular
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio do formulário

        // [Comentário AI]: Leitura impura dos valores do DOM[cite: 18].
        const availableCredits = document.getElementById('available-credits').value;
        const pricePerTon = document.getElementById('price-per-ton').value;
        
        const activityNodes = document.querySelectorAll('.activity-entry');
        const activitiesInput = Array.from(activityNodes).map(node => ({
            name: node.querySelector('.activity-name').value,
            emissions: node.querySelector('.activity-emissions').value
        }));

        // 1. Validação Pura [cite: 8, 20]
        const validation = validateInputs(activitiesInput, availableCredits, pricePerTon);

        if (!validation.isValid) {
            // [Comentário AI]: Escrita impura no DOM (exibição de erro)[cite: 9].
            displayError(validation.message);
        } else {
            // [Comentário AI]: Esconde o erro e continua o fluxo puro.
            displayError(null);
            
            // 2. Transformação Pura (parsing)
            // [Comentário AI]: Usando HOF 'map' para transformar dados, garantindo imutabilidade[cite: 24, 26].
            const parsedActivities = parseActivities(activitiesInput);
            const parsedCredits = parseFloat(availableCredits);
            const parsedPrice = parseFloat(pricePerTon);

            // 3. Execução da Lógica de Negócio Pura [cite: 7]
            const results = calculateCarbonMarket(parsedActivities, parsedCredits, parsedPrice);

            // 4. Exibição Pura (formatação) e Impura (renderização)
            // [Comentário AI]: 'formatResults' é pura, 'displayResults' é impura[cite: 9].
            const formattedOutput = formatResults(results);
            displayResults(formattedOutput);
        }
    });

    // --- ZONA PURA: Funções de Validação e Lógica de Negócio ---
    // [Comentário AI]: A partir daqui, todas as funções são puras[cite: 23].
    // Elas não modificam estado externo e sempre retornam o mesmo resultado
    // para as mesmas entradas.

    /**
     * Função pura e reutilizável para verificar se um valor é um número positivo.
     * [cite: 13, 21]
     */
    const isPositiveNumber = (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
    };

    /**
     * Função pura que valida todas as entradas.
     * Utiliza a HOF 'every' (que é um tipo de 'reduce') para checar a lista. [cite: 26]
     * @returns {{isValid: boolean, message: string}}
     */
    const validateInputs = (activities, credits, price) => {
        // [Comentário AI]: Aplicação da regra de validação[cite: 20].
        if (!isPositiveNumber(credits)) {
            return { isValid: false, message: 'Os créditos disponíveis devem ser um número positivo.' };
        }
        if (!isPositiveNumber(price)) {
            return { isValid: false, message: 'O preço por tonelada deve ser um número positivo.' };
        }
        if (activities.length === 0) {
            return { isValid: false, message: 'Adicione pelo menos uma atividade.' };
        }
        
        // [Comentário AI]: Uso de Função de Ordem Superior 'every' (similar ao filter/reduce)[cite: 26].
        const allActivitiesValid = activities.every(act => 
            act.name.trim() !== '' && isPositiveNumber(act.emissions)
        );

        if (!allActivitiesValid) {
            return { isValid: false, message: 'Todas as atividades devem ter um nome e um valor de emissão numérico positivo.' };
        }

        return { isValid: true, message: null };
    };

    /**
     * Função pura que converte a entrada de atividades (strings) para números.
     * Usa a HOF 'map' e garante imutabilidade. [cite: 24, 26]
     */
    const parseActivities = (activities) => 
        activities.map(act => ({
            name: act.name,
            emissions: parseFloat(act.emissions)
        }));

    /**
     * Função pura que calcula o total de emissões.
     * Usa a HOF 'reduce'. [cite: 26]
     */
    const calculateTotalEmissions = (activities) => 
        activities.reduce((total, activity) => total + activity.emissions, 0);

    /**
     * Função pura que calcula as emissões líquidas e créditos.
     * Respeita as invariantes (emissão líquida >= 0; crédito aplicado <= disponível).
     */
    const calculateNetResult = (totalEmissions, availableCredits) => {
        // [Comentário AI]: Lógica de negócio (Abater créditos)[cite: 7].
        const appliedCredits = Math.min(totalEmissions, availableCredits);
        const netEmissions = totalEmissions - appliedCredits;
        const remainingCredits = availableCredits - appliedCredits;

        // [Comentário AI]: Retorna um NOVO objeto (imutabilidade)[cite: 24].
        return {
            totalEmissions,
            appliedCredits,
            netEmissions, // Invariante: netEmissions >= 0
            remainingCredits
        };
    };

    /**
     * Função pura que calcula o resultado financeiro (custo/receita).
     */
    const calculateFinancials = (netEmissions, remainingCredits, pricePerTon) => {
        // [Comentário AI]: Lógica de negócio (Custo/receita)[cite: 7].
        // Se a emissão líquida é > 0, há um custo para comprar créditos.
        // Se os créditos restantes são > 0, há uma receita (potencial) pela venda.
        const cost = netEmissions * pricePerTon;
        const revenue = remainingCredits * pricePerTon;
        const finalBalance = revenue - cost; // Negativo = Custo, Positivo = Receita

        return {
            costToOffset: cost,
            potentialRevenue: revenue,
            finalBalance
        };
    };

    /**
     * Função pura que cria o breakdown (detalhamento) por atividade.
     * Usa a HOF 'map' e o spread operator (...) para garantir imutabilidade[cite: 24, 26].
     */
    const createBreakdown = (activities, totalEmissions) => {
        if (totalEmissions === 0) {
            return activities.map(act => ({ ...act, percentage: 0 })); // [Comentário AI]: Imutabilidade [cite: 24]
        }
        // [Comentário AI]: Uso de HOF 'map'[cite: 26].
        return activities.map(activity => ({
            ...activity, // [Comentário AI]: Cria um novo objeto (imutabilidade) [cite: 24]
            percentage: (activity.emissions / totalEmissions) * 100
        }));
    };

    /**
     * Função "mestra" puramente funcional que compõe as outras.
     * Ela recebe os dados de entrada e retorna o objeto de resultados completo.
     */
    const calculateCarbonMarket = (activities, availableCredits, pricePerTon) => {
        // [Comentário AI]: Composição de funções puras.
        const totalEmissions = calculateTotalEmissions(activities);
        const netResult = calculateNetResult(totalEmissions, availableCredits);
        const financials = calculateFinancials(netResult.netEmissions, netResult.remainingCredits, pricePerTon);
        const breakdown = createBreakdown(activities, totalEmissions); // Saída: breakdown por atividade

        // [Comentário AI]: Retorna um novo objeto de estado, sem mutar nada[cite: 24].
        return {
            ...netResult,
            ...financials,
            breakdown
        };
    };


    // --- ZONA IMPURA: Funções de Renderização no DOM ---
    // [Comentário AI]: Funções impuras que alteram o DOM para exibir a saída[cite: 9].

    /**
     * Função pura para formatar números como moeda (R$).
     */
    const formatCurrency = (value) => 
        value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    /**
     * Função pura que transforma o objeto de resultados em HTML.
     */
    const formatResults = (results) => {
        // [Comentário AI]: Formatação da saída[cite: 9].
        const breakdownHtml = results.breakdown.map(act => 
            `<li>
                <strong>${act.name}:</strong> 
                ${act.emissions.toFixed(2)}t 
                (${act.percentage.toFixed(2)}% do total)
            </li>`
        ).join(''); // [Comentário AI]: 'map' é uma HOF[cite: 26].

        const balanceLabel = results.finalBalance >= 0 ? "Receita Líquida" : "Custo Líquido";

        return `
            <p><strong>Emissão Total Bruta:</strong> ${results.totalEmissions.toFixed(2)}t</p>
            <p><strong>Créditos Aplicados:</strong> ${results.appliedCredits.toFixed(2)}t</p>
            <p style="font-size: 1.3rem; color: ${results.netEmissions > 0 ? '#d9534f' : '#5cb85c'};">
                <strong>Emissão Líquida:</strong> ${results.netEmissions.toFixed(2)}t
            </p>
            <hr>
            <p>Custo para compensar emissão líquida: ${formatCurrency(results.costToOffset)}</p>
            <p>Receita potencial com créditos restantes: ${formatCurrency(results.potentialRevenue)}</p>
            <p><strong>Balanço Financeiro (${balanceLabel}):</strong> ${formatCurrency(Math.abs(results.finalBalance))}</p>
            <hr>
            <h4>Detalhamento de Emissões (Breakdown):</h4>
            <ul class="breakdown-list">
                ${breakdownHtml}
            </ul>
        `;
    };

    /**
     * Função impura para exibir os resultados no DOM[cite: 9].
     */
    const displayResults = (html) => {
        resultsDiv.innerHTML = html;
    };

    /**
     * Função impura para exibir ou limpar erros no DOM[cite: 9].
     */
    const displayError = (message) => {
        if (message) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = message;
            resultsDiv.innerHTML = ''; // Limpa resultados se houver erro
        } else {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
    };

});