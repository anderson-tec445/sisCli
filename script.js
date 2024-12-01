// script.js
const clientForm = document.getElementById('clientForm');
const tableBody = document.getElementById('tableBody');

let clients = []; // Array para armazenar os clientes

// Valores dos planos pré-definidos
const planValues = {
    "Plano Básico": 100.00,
    "Plano Avançado": 200.00
};

// Atualiza o valor do plano com base no plano selecionado
function updatePlanValue() {
    const plan = document.getElementById('plan').value;
    const planValueInput = document.getElementById('planValue');
    planValueInput.value = planValues[plan] || ''; // Preenche automaticamente, mas o campo é editável
}

// Atualiza o valor inicial ao carregar a página
document.addEventListener('DOMContentLoaded', updatePlanValue);

// Função para cadastrar cliente
clientForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capturar valores dos campos
    const name = document.getElementById('name').value;
    const cpfCnpj = document.getElementById('cpfCnpj').value;
    const razaoSocial = document.getElementById('razaoSocial').value;
    const contact = document.getElementById('contact').value;
    const plan = document.getElementById('plan').value;
    const planValue = parseFloat(document.getElementById('planValue').value) || 0; // Valor editável
    const dueDate = document.getElementById('dueDate').value;

    // Validar se os campos obrigatórios estão preenchidos
    if (!name || !cpfCnpj || !contact || !plan || !dueDate || planValue <= 0) {
        alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
        return;
    }

    // Criar objeto cliente
    const client = { name, cpfCnpj, razaoSocial, contact, plan, planValue, dueDate };
    clients.push(client); // Adicionar cliente à lista
    updateTable(); // Atualizar tabela com os clientes
    clientForm.reset(); // Limpar o formulário
    updatePlanValue(); // Resetar o valor do plano
});

// Atualiza a tabela com os clientes cadastrados
function updateTable() {
    tableBody.innerHTML = ''; // Limpar tabela antes de recriar as linhas
    clients.forEach((client, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.cpfCnpj}</td>
            <td>${client.contact}</td>
            <td>${client.plan}</td>
            <td>R$ ${client.planValue.toFixed(2)}</td>
            <td>${client.dueDate}</td>
            <td>
                <button onclick="sendReminder(${index})">Cobrar</button>
                <button onclick="removeClient(${index})">Remover</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para enviar cobrança via WhatsApp
function sendReminder(index) {
    const client = clients[index];
    const message = `Olá, ${client.name}! Sua fatura do plano ${client.plan} no valor de R$ ${client.planValue.toFixed(2)} vence em ${client.dueDate}. Por favor, realize o pagamento.`;
    const phone = client.contact.replace(/\D/g, ''); // Remove caracteres não numéricos
    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Função para remover cliente
function removeClient(index) {
    clients.splice(index, 1); // Remove o cliente pelo índice
    updateTable(); // Atualiza a tabela
}

// Função de automação de envio de mensagens
function automateReminders() {
    const today = new Date();

    clients.forEach((client, index) => {
        const dueDate = new Date(client.dueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Diferença em dias

        if (diffDays === 3) { // 3 dias antes do vencimento
            sendReminder(index);
        }
    });
}

// Configurar a automação para rodar a cada 24 horas
setInterval(automateReminders, 24 * 60 * 60 * 1000); // Verifica uma vez por dia
