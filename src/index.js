import read from "../resources/read.js";
import axios from 'axios';

const game = async () => {
  let factions;
  let factionChoice;
  const userName = await read("Digite seu nome: ");

  const worldName = await read('Digite o nome do seu mundo: ');

  console.log(`Olá ${userName}! Sua jornada nas profundezas de ${worldName} está prestes a começar!`);

  // criar menu de opcoes 
  const menu = async () => {
    console.log("1. Criar personagem.\n2. Escolher personagem.\n3. Sair.");
    let menuOption = await read('Digite o número da opção desejada: ');
    menuOption = parseInt(menuOption);
    await verifyChoice(menuOption)
    if (menuOption === 1) {
      await createCharacter();
    } else if (menuOption === 2) {
      await selectCharacter();
    } else if (menuOption === 3) {
      console.log('Até mais, aventureire!');
      return;
    }
  }

  const verifyChoice = async (menuOption) => {
    let count = 1;
    while (menuOption < 1 || menuOption > 3 && count < 5) {
      console.log(`Opção inválida, tente novamente. Você tem 5 chances e já tentou ${count} vez/vezes.\n`);
      await menu()
      count++;
    }
    if (count === 5) {
      console.log("Você excedeu o número máximo de chances e o jogo se encerrará.");
      return;
    }
  }

  const requestFactions = async () => {
    const response = await axios.get(`https://ir39vnlo.directus.app/items/factions`);
    return response.data.data;
  }

  const createCharacter = async () => {

    const getFactionName = () => {
      const factionsObject = factions[factionChoice];
      console.log(factions, factionChoice)
      return factionsObject.name;
    }

    const factionsMenu = async () => {
      console.log('Escolha a facção do novo personagem:');

      const getFactionChoice = async () => {
        factionChoice = await read(factions.map((value, i) => {
          const { name } = value;
          return `${i}-${name}`;
        }).join('\n').concat('\n'));

        factionChoice = parseInt(factionChoice);
      }

      await getFactionChoice();

      while (factions[factionChoice] === undefined) {
        console.log('Opção inválida, tente novamente.');
        await getFactionChoice()
      }

    }

    const chooseName = async () => {
      const factionName = getFactionName();
      let characterName = await read('Insira o nome do personagem:\n');
      while (characterName === '') {
        console.log('Insira um nome válido para seu personagem');
        characterName = await read('Insira o nome do personagem:\n');
      }
      console.log(`Personagem ${characterName} da facção ${factionName} foi criado com sucesso!`);
    };
    
    await factionsMenu();
    await chooseName();

  }

  factions = await requestFactions();
  await menu();
}


export default game;