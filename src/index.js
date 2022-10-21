import read from "../resources/read.js";

const welcome = async () => {
  const userName = await read("Digite seu nome: ");

  const worldName = await read('Digite o nome do seu mundo: ');

  console.log(`Olá ${userName}! Sua jornada nas profundezas de ${worldName} está prestes a começar!`);

  // criar menu de opcoes 
  const menu = async () => {
    console.log("1. Criar personagem.\n2. Escolher personagem.\n3. Sair.");
    console.log('Digite o número da opção desejada:')
    let menuOptions = await read('');
    menuOptions = parseInt(menuOptions);
    let count = 1;
    while (menuOptions < 1 || menuOptions > 3 && count < 5) {
      console.log(`Opção inválida, tente novamente. Você tem 5 chances e já tentou ${count} vez/vezes.`);
      let menuOptions = await read('');
      menuOptions = parseInt(menuOptions);
      count++;
    }
    if(count === 5) {
      console.log("Você excedeu o número máximo de chances e o jogo se encerrará.");
      return;
    }
  }
const teste = await menu();
console.log(teste);
}
export default welcome;