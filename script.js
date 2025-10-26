// 1. Selecionar elementos importantes do HTML
const visor = document.getElementById('visor');
const botoes = document.querySelectorAll('.teclas button');

// Variáveis para armazenar o estado da calculadora
let primeiroNumero = '';
let operador = null;
let esperandoSegundoNumero = false;

// 2. Função principal para processar cliques de botão
function processarClique(event) {
    // Pega o valor do botão (o que está escrito nele)
    const valor = event.target.innerText;
    // Pega a ação do botão (se for um operador ou igual)
    const acao = event.target.dataset.action;

    // Se o botão não tem valor nem ação (ex: espaçamento), ignore.
    if (!valor && !acao) return;

    // --- Lógica para Números (0-9) ---
    if (!acao) { 
        // Se for um número (sem data-action), apenas adicione ao visor
        if (visor.value === '0' || esperandoSegundoNumero) {
            visor.value = valor;
            esperandoSegundoNumero = false;
        } else {
            visor.value += valor;
        }
        primeiroNumero = visor.value; // Atualiza o primeiro ou segundo número em digitação
        return;
    }

    // --- Lógica para Ações (Operadores e Controles) ---
    switch (acao) {
        case 'decimal':
            if (!visor.value.includes('.')) {
                visor.value += '.';
            }
            break;

        case 'clear': // AC - All Clear (Limpa tudo)
            visor.value = '0';
            primeiroNumero = '';
            operador = null;
            esperandoSegundoNumero = false;
            break;

        case 'backspace': // DEL - Deleta o último dígito
            if (visor.value.length > 1) {
                visor.value = visor.value.slice(0, -1);
            } else {
                visor.value = '0';
            }
            break;

        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            manipularOperador(acao);
            break;

        case 'percent':
            // Lógica simples de porcentagem (divide o número atual por 100)
            visor.value = (parseFloat(visor.value) / 100).toString();
            break;

        case 'calculate':
            calcularResultado();
            break;

        default:
            break;
    }
}

// 3. Função para manipular a escolha de um operador (+, -, x, ÷)
function manipularOperador(acao) {
    if (operador && !esperandoSegundoNumero) {
        // Se já tem um operador, calcula o resultado da operação anterior
        calcularResultado();
    }
    
    // Armazena o valor atual no visor como o primeiro número da operação
    primeiroNumero = visor.value;
    operador = acao;
    esperandoSegundoNumero = true; // Próximo número digitado será o segundo número
}


// 4. Função que faz o cálculo final (no clique do =)
function calcularResultado() {
    if (!operador || esperandoSegundoNumero) {
        return; // Não faz nada se não houver operador ou se ainda estiver esperando o segundo número
    }

    const n1 = parseFloat(primeiroNumero);
    const n2 = parseFloat(visor.value);
    let resultado = 0;

    // Realiza o cálculo baseado no operador armazenado
    switch (operador) {
        case 'add':
            resultado = n1 + n2;
            break;
        case 'subtract':
            resultado = n1 - n2;
            break;
        case 'multiply':
            resultado = n1 * n2;
            break;
        case 'divide':
            if (n2 === 0) {
                visor.value = 'Erro'; // Evita divisão por zero
                return;
            }
            resultado = n1 / n2;
            break;
        default:
            return;
    }

    // Exibe o resultado e prepara a calculadora para a próxima operação
    visor.value = resultado.toString();
    primeiroNumero = resultado.toString();
    operador = null;
    esperandoSegundoNumero = false;
}

// 5. Adicionar o "ouvinte de eventos" a todos os botões
botoes.forEach(botao => {
    botao.addEventListener('click', processarClique);
});
