import read from "../resources/read.js";
import axios from 'axios';

const game = async () => {
  let factions;
  let characters;
  let items;
  let quests;
  let factionsObject;
  let factionChoice;
  let itemChoice;
  let getItem;
  let factionName;
  let characterName;
  let getCharacterName;
  let areYouSure;
  let characterObject;
  let characterMenuChoice;
  let characterMoney;
  let questChoice;
  let questObject;
  let questBugObject;
  let oldCharacter;
  let count = 1;

  const userName = await read("\n✿ Seu nome: ");

  const worldName = await read('✿ Nome do seu mundo: ');

  console.log(`\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───\n\nOlá ${userName}! Sua jornada nas profundezas de ${worldName} está prestes a começar!`)


  const menu = async () => {
    let menuOption;
    do {
      console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───\n')
      console.log("\x1B[1;95m╰┈➤ MENU DE ESCOLHA MÍSTICO\x1B[0m\n\x1B[1m\n1.\x1B[0m Criar personagem.\n\x1B[1m2.\x1B[0m Escolher personagem.\n\x1B[1m3.\x1B[0m Sair.");
      menuOption = await read('\n✎ Digite o número da opção desejada: ');
      count++;
      menuOption = parseInt(menuOption);
    } while (verifyChoice(menuOption));

    if (menuOption === 1) {
      await createCharacter();
    } else if (menuOption === 2) {
      await selectCharacter();
    } else if (menuOption === 3) {
      console.log('\n~~~~~~𓆞~~~~~~𖠳~~~~𓆟~𓆟~~~𓆞~~~~~~~𖠳~~~~~\n');
      console.log('\x1B[1mSo long and thanks for all the fish! ッ\x1B[0m');
      console.log('\n~~~~~~𓆞~~~~~~𖠳~~~~𓆟~𓆟~~~𓆞~~~~~~~𖠳~~~~~\n');
      return;
    }
  }

  const verifyChoice = (menuOption) => {
    return (menuOption < 1 || menuOption > 3 || menuOption === '') && count <= 5;
  }

  if (count === 5) {
    console.log("Você excedeu o número máximo de chances e o jogo se encerrará.");
    return;
  }

  const requestFactions = async () => {
    const response = await axios.get(`https://dws-bug-hunters-api.vercel.app/api/factions`);
    return response.data;
  }

  const requestCharacters = async () => {
    const response = await axios.get(`https://dws-bug-hunters-api.vercel.app/api/characters`);
    return response.data;
  }

  const requestItems = async () => {
    const response = await axios.get(`https://dws-bug-hunters-api.vercel.app/api/equipment`);
    return response.data;
  }

  const requestQuests = async () => {
    const response = await axios.get(`https://dws-bug-hunters-api.vercel.app/api/tasks`);
    return response.data;
  }

  async function createCharacter() {

    const getFactionName = () => {
      factionsObject = factions[factionChoice];
      factionName = factionsObject.name;
      return factionName;
    };

    const factionsMenu = async () => {
      console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───');
      console.log('\nMuito bem! Sendo assim, precisamos de algumas informaçōes...');
      console.log('\n✎ Escolha a \x1B[1mfacção\x1B[0m do novo personagem!\n');

      const getFactionChoice = async () => {
        factionChoice = await read(factions.map((value, i) => {
          const { name } = value;
          return `${i}-${name}`;
        }).join('\n').concat('\n'));
        factionChoice = parseInt(factionChoice);
      };

      await getFactionChoice();

      while (factions[factionChoice] === undefined) {
        console.log('\n\x1B[1;31mERRO:\x1B[0m \x1B[0;31mOpção inválida, tente novamente.\x1B[0m\n');
        await getFactionChoice();
      }
    };

    const chooseName = async () => {
      factionName = getFactionName();
      characterName = await read('\n✎ Insira o \x1B[1mnome\x1B[0m do personagem: ');
      while (characterName === '') {
        console.log('\x1B[1;31m\nERRO:\x1B[0m \x1B[0;31mInsira um nome válido para seu personagem.\x1B[0m');
        characterName = await read('\n✎ Insira o \x1B[1mnome\x1B[0m do personagem: ');
      }

      console.log(`\n✰ \x1B[0;32mPersonagem ${characterName} da facção ${factionName} foi criado com sucesso!\x1B[0m ✰\n`);

      areYouSure = await read('「 Você deseja computar esse personagem? 」\n\x1B[0;32m1. Sim.\x1B[0m \x1B[0;31m2. Não.\x1B[0m\n');
      areYouSure = parseInt(areYouSure);

      if (areYouSure === 1) {
        const postCharacter = async () => {
          try {
            const postAPI = await axios.post(
              `https://dws-bug-hunters-api.vercel.app/api/characters`,
              {
                "name": characterName,
                "def": 5,
                "agi": 20,
                "atk": 10,
                "hp": 10,
                "gold": 20,
                "factions": [
                  {
                    "id": factionsObject.id,
                    "name": factionName
                  }
                ],
                "equipment": []
              }
            )
          } catch (error) {
            console.log('deu erro', error);
          };
        }
        postCharacter();
        await menu();
      } else if (areYouSure === 2) {
        console.log('\nVocê será redirecionado ao menu!');
        await new Promise(resolve => setTimeout(resolve, 1500));
        await menu();
      }
    };

    await factionsMenu();
    await chooseName();

  } // fecha create character


  const selectCharacter = async () => {
    let inputCharacterName;
    characters = await requestCharacters();
    const getInputCharacterName = async () => {
      console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───\n');
      inputCharacterName = await read("✎ Insira o \x1B[1mnome\x1B[0m do personagem que você quer selecionar: ");
      return inputCharacterName;
    }

    const findCharacterByName = async () => { // ERRO NUMERO 2: resolvido
      await getInputCharacterName();
      let findCharacter;
       
      findCharacter = characters.find(elem => elem.name === inputCharacterName);
      while (findCharacter === undefined) {
        console.log('\n\x1B[1;31mERRO:\x1B[0m \x1B[0mPersonagem não encontrado, tente novamente.\x1B[0m');
        getCharacterName = await getInputCharacterName();
        findCharacter = characters.find(elem => elem.name === getCharacterName);
      }
      characterObject = characters.find(elem => elem.name === inputCharacterName);
      console.log('\x1B[0;32m\nO seu personagem foi encontrado com sucesso!\x1B[0m');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return characterObject;
    }

    await findCharacterByName();

    const showCharacterMenu = async () => {
      do {
        console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───\n');
        console.log('\x1B[1;95m╰┈➤ MENU DE ESCOLHA AINDA MAIS MÍSTICO\x1B[0m');
        console.log(('\n\x1B[1m1.\x1B[0m Stats.\n\x1B[1m2.\x1B[0m Store.\n\x1B[1m3.\x1B[0m Quests.\n\x1B[1m4.\x1B[0m Sair.\n'))
        characterMenuChoice = await read('Digite o número da opção desejada: ');
        console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───\n')
        characterMenuChoice = parseInt(characterMenuChoice);
      } while (characterMenuChoice < 1 || characterMenuChoice > 4)

      if (characterMenuChoice === 1) {
        await getCharacterStats();
      } else if (characterMenuChoice === 2) {
        await store();
      } else if (characterMenuChoice === 3) {
        await getQuests();
      } else if (characterMenuChoice === 4) {
        console.log('\n~~~~~~𓆞~~~~~~𖠳~~~~𓆟~𓆟~~~𓆞~~~~~~~𖠳~~~~~\n');
        console.log('\x1B[1mSo long and thanks for all the fish! ッ\x1B[0m');
        console.log('\n~~~~~~𓆞~~~~~~𖠳~~~~𓆟~𓆟~~~𓆞~~~~~~~𖠳~~~~~\n');
        return;
      }
    }

    const getCharacterStats = async () => {
      const characterObjectForStats = characters.filter(elem => elem.name === inputCharacterName)
      const characterStats = characterObjectForStats.map((value) => {
        const { atk, def, agi, hp, name } = value;
        console.log(`\nInformaçōes de status do personagem \x1B[1m${name}\x1B[0m:\n`);
        console.log(`\x1B[1mAtaque:\x1B[0m ${atk}, \x1B[1mDefesa:\x1B[0m ${def}, \x1B[1mAgilidade:\x1B[0m ${agi}, \x1B[1mHP:\x1B[0m ${hp}`)
      }).join('\n');
      console.log(characterStats);
      await new Promise(resolve => setTimeout(resolve, 2200));
      await showCharacterMenu();
    }

    const store = async () => {

      const getStore = async () => {
        characterMoney = characterObject.gold;
        console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───\n');
        console.log('\x1B[95mBem-vindo a lojinha!\x1B[0m\n');
        console.log(`Saldo de dinheiro: \x1B[1m${characterMoney}\x1B[0m mangos\n`);

        const getAllItems = items.map((elem, i) => {
          const { name, value, affected_attribute, affected_amount } = elem;
          return `✧ ${i}- \x1B[1mItem:\x1B[0m ${name}, \x1B[1mValor:\x1B[0m ${value}, \x1B[1m${affected_attribute}:\x1B[0m ${affected_amount} ✧`
        }).join('\n');
        console.log(getAllItems);
        console.log('✧ 100- Sair para o menu do personagem ✧');

        itemChoice = await read('Qual item desejas comprar? ');
        itemChoice = parseInt(itemChoice);
        getItem = items[itemChoice];

        if (itemChoice === 100) {
          await showCharacterMenu(); // ERRO 3: resolvido
          return;
        }
        if (getItem.value > characterMoney) {
          console.log('\n\x1B[1;31mERRO:\x1B[0m \x1B[0;31mVocê não tem dinheiro o suficiente para comprar este item.\x1B[0m');
          await new Promise(resolve => setTimeout(resolve, 1500))
          await store(); // ERRO 4: resolvido
        } else {
          console.log('\n\x1B[0;32mItem comprado com sucesso!\x1B[0m');
          characterObject.gold = characterObject.gold - getItem.value;
          characterObject.equipment.push(getItem)
          const characterNew = { gold: characterObject.gold, equipment: [...characterObject.equipment], id: characterObject.id  }
          await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters/`, characterNew);
          switch (getItem.affected_attribute) {
            case 'atk':
              characterObject.atk = characterObject.atk + getItem.affected_amount;
              await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters/`, { atk: characterObject.atk, id: characterObject.id });
              break;
            case 'def':
              characterObject.def = characterObject.def + getItem.affected_amount;
              await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters/`, { def: characterObject.def, id: characterObject.id });
              break;
            case 'agi':
              characterObject.agi = characterObject.agi + getItem.affected_amount;
              await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters/`, { agi: characterObject.agi, id: characterObject.id });
              break;
            case 'hp':
              characterObject.hp = characterObject.hp + getItem.affected_amount;
              await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters/`, { hp: characterObject.hp, id: characterObject.id });
              break;
          }
          await store();
        }
      } // fecha getstore
      await getStore()
    }

    const getQuests = async () => {

      const menuQuests = async () => {
        console.log(`\n\x1B[1;95m╰┈➤ MENU DAS QUESTS:\x1B[0m`);
        const getQuestsRequest = quests.map((value, i) => {
          const { name, description, complexity, reward } = value;
          console.log(`\n\x1B[1m${i}\x1B[0m- ${name}`)
          console.log(`\x1B[1mDescrição:\x1B[0m ${description}`);
          console.log(`\x1B[1mComplexidade:\x1B[0m ${complexity}`);
          console.log(`\x1B[1mRecompensa:\x1B[0m ${reward}`);
        }).join(`\n`);

        console.log('\n\x1B[1m100-\x1B[0m Sair para o menu do personagem.\n');
        questChoice = await read('\nDigite o número da quest: ');
        questChoice = parseInt(questChoice);
        if (questChoice == 100) {
          await showCharacterMenu(); // ERRO 7: resolvido
        }
        questObject = quests[questChoice];
        questBugObject = questObject.bugs[0];
      }

      await menuQuests();

      const questStart = async () => {

        if (questBugObject == undefined || !questBugObject.hasOwnProperty('agi')) {
          console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───');
          console.log(`\n\x1B[1;32m✯ VITÓRIA (mais ou menos...)!\x1B[0m \x1B[0;32mVocê encontrou uma quest sem bugs e ganhou, sem esforço algum, ${questObject.reward} mangos.`);
          console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───');
          characterObject.gold = questObject.reward + characterObject.gold
          await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters`, { gold: characterObject.gold, id: characterObject.id })
          await new Promise(resolve => setTimeout(resolve, 3800));
          await getQuests();
        }

        while (questBugObject.def > characterObject.atk) {
          console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────\n');
          console.log('\nAventureiro, através de uma \x1B[35mintervenção mística\x1B[0m, você foi poupado dessa quest... Escolha outra.. \n');
          console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────\n');
          await new Promise(resolve => setTimeout(resolve, 2800));
          await menuQuests();
        }

        console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───');
        console.log('\nA batalha está prestes a começar! Boa sorte, aventureiro! (ง •̀_•́)ง \n');

        const battleStart = async () => {

          if (characterObject.agi >= questBugObject.agi) {
            console.log('Você vai atacar!\n');
            while (characterObject.hp > 0 && questBugObject.hp > 0) { // chega ate o negativo, dai para.
              await new Promise(resolve => setTimeout(resolve, 1000));
              const firstTurn = async () => {
                questBugObject.hp = questBugObject.hp - characterObject.atk + questBugObject.def;
                console.log(`\nÓtimo ataque, ${characterObject.name}! O HP do bug é de ${questBugObject.hp}.\n`)
              }

              await firstTurn();
              await new Promise(resolve => setTimeout(resolve, 1000));

              const secondTurn = async () => {
                if (characterObject.def > questBugObject.atk) {
                  console.log('\nUau! Sua defesa é tão boa que você não perdeu nenhum HP! Parabéns.\n')
                  characterObject.hp = characterObject.hp;
                } else {
                  characterObject.hp = characterObject.hp - questBugObject.atk + characterObject.def;
                  console.log(`Você foi atacado pelo bug ${questBugObject.name}.., Seu HP atual é de ${characterObject.hp}.`)
                }
              }
              await secondTurn()
            }
          }

          if (questBugObject.agi >= characterObject.agi) {
            while (characterObject.hp > 0 && questBugObject.hp > 0) { // chega ate o negativo, dai para.
              await new Promise(resolve => setTimeout(resolve, 1000));
              const firstTurn = async () => {
                if (characterObject.def > questBugObject.atk) {
                  console.log('\nUau! Sua defesa é tão boa que você não perdeu nenhum HP! Parabéns.\n')
                  characterObject.hp = characterObject.hp;
                } else {
                  characterObject.hp = characterObject.hp - questBugObject.atk + characterObject.def;
                  console.log(`Você foi atacado pelo bug ${questBugObject.name}.., Seu HP atual é de ${characterObject.hp}.`)
                }
              }

              await firstTurn();
              await new Promise(resolve => setTimeout(resolve, 1000));

              console.log('Você vai atacar!\n');

              const secondTurn = async () => {
                questBugObject.hp = questBugObject.hp - characterObject.atk + questBugObject.def;
                console.log(`\nÓtimo ataque, ${characterObject.name}! O HP do bug é de ${questBugObject.hp}.\n`)
              }
              await secondTurn()
            }
          }

          if (questBugObject.hp <= 0) {
            console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───');
            console.log(`\n\x1B[1;32m✯ VITÓRIA!\x1B[0m \x1B[0;32mVocê venceu a batalha e derrotou o bug ${questBugObject.name}! ✯\x1B[0m
                \nCom isso, você recebeu a recompensa de \x1B[1m${questObject.reward}\x1B[0m mangos.`);
            characterObject.gold = questObject.reward + characterObject.gold
            console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───');
            await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters`, { gold: characterObject.gold, id: characterObject.id })
            questBugObject.hp = 'DERROTADO';
            await new Promise(resolve => setTimeout(resolve, 2800));
            await getQuests();
          } else if (characterObject.hp <= 0) {
            console.log('\n─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ────── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───');
            console.log(`\n\x1B[0;91mDERROTA! Não foi dessa vez, ${characterObject.name}.. Você irá perder um equipamento aleatório. Boa sorte na próxima vez.\x1B[0m`);
            await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters`, { hp: 20, id: characterObject.id });
            const removedItem = characterObject.equipment.splice(Math.floor(Math.random() * characterObject.equipment.length), 1)[0];
            await axios.patch(`https://dws-bug-hunters-api.vercel.app/api/characters`, { equipment: characterObject.equipment, id: characterObject.id })
            await new Promise(resolve => setTimeout(resolve, 2800));
            await getQuests(); // ERRO 6: resolvido
          }


        } // fecha battlestart

        await battleStart()

      } // fecha queststart
      await questStart()

    } // fecha getquests

    await showCharacterMenu();

  } // fecha select character

  factions = await requestFactions();
  characters = await requestCharacters();
  items = await requestItems();
  quests = await requestQuests();
  // bugs = await requestBugs();

  await menu();

} // fecha game
export default game;