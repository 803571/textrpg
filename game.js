import chalk from "chalk";
import readlineSync from "readline-sync";

// 이것은, 어렸을 때 하던 파이널판타지가 될 수도 있고, 쯔꾸르가 될 수도 있다.
// 근데 파판은 안해봄 ㅋㅋ

// ====================================== 이곳은 플레이어 스펙, 몬스터 스펙을 보는 구간입니다 ======================================
class Player {
  constructor() {
    this.hp = 100; // 플레이어 피통
    this.attackPower = 15; // 플레이어 기본데미지
  }

  attack(monster) {
    // 플레이어 -> 몬스터에게 공격
    let damage = this.attackPower;
    monster.hp -= damage;
    return damage;
  }
}

class Monster {
  constructor() {
    this.hp = 100;
  }

  attack() {
    // 몬스터의 공격
  }
}

// ====================================== 이곳은 플레이어 스펙, 몬스터 스펙을 보는 구간입니다 ======================================

// ====================================== 게임 시작 로비화면 ======================================

function displayStatus(stage, player, monster) {
  // console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(chalk.magentaBright(`\n===== 고요한 숲 =====`));
  console.log(
    // chalk.cyanBright(`| Stage: ${stage} `) +
    //   chalk.blueBright(`| 플레이어 정보`) +
    //   chalk.redBright(`| 몬스터 정보 |`)  // 기본 설정입니다. 수정한 코드가 문제없이 작동한다면 삭제하세요.
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 용사 HP: ${player.hp} V`) +
      chalk.redBright(`S 몬스터 HP: ${monster.hp} |`)
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

// ====================================== 게임 시작 로비화면 ======================================

// ====================================== 전투 시스템 ======================================

const battle = async (stage, player, monster) => {
  // 전투 시스템에 필요한 매개변수를 받아온다! 전투를 구성하는데 필요한 건 스테이지, 전투에 참여하는 플레이어와 몬스터
  let logs = []; // 전투가 진행되는 모든 메시지를 담는 함.

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 기본공격 \n2. 스킬 \n3. 아무것도 하지 않는다 \n4. 도주하기`)); // 플레이어한테 선택지를 줌
    const choice = readlineSync.question("용사는 무얼 할까?? "); // 단순 나레이션

    if (choice === "1") {
      //플레이어가 공격한다를 골랐을 경우
      let damage = player.attack(monster);
      logs.push(
        chalk.green(`용사가 몬스터에게 `) +
          chalk.yellow(`${damage}`) +
          chalk.green(` 만큼 피해를 주었습니다.`)
      );

      if (monster.hp <= 0) {
        console.clear();
        displayStatus(stage, player, monster); // 몹잡고 최종 상태 불러오기
        logs.push(chalk.green(`  << 몬스터를 처치했습니다! >> `));
        logs.forEach((log) => console.log(log));

        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기

        console.clear();
        console.log(
          chalk.cyanBright(`용사는 가던 길을 마저 걷기 시작했습니다.. `)
        );

        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기

        console.clear();
        console.log(chalk.cyanBright(`앗! 야생의 몬스터가 나타났다! `));

        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기

        // break;
        return;
      }

      // 추가? 몬스터가 반격
      // 추가? 몬스터도 플레이어에게 공격
    } else if (choice === "3") {
      logs.push(chalk.yellow(`용사는 아무것도 하지 않았습니다. `));
    } else if (choice === "4") {
      let escapeChance = Math.random();
      if (escapeChance <= 0.3) {
        console.clear();
        console.log(chalk.green(`성공적으로 도주했다!!`));

        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기

        return 'escape';
      } else {
        logs.push(chalk.red(`이런, 도주에 실패했다!`));
      }
    } else {
      logs.push(
        chalk.red(`올바른 선택을 하시게나, 젊은이.  ... '어디선가 이상한 소리가 들리는 듯 하다.'`));
    }
  }
  logs.forEach((log) => console.log(log)); // 전투가 끝났을 때 로그
};

// ====================================== 전투 시스템 ======================================

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    let monster = new Monster(stage);
    let battleresult;

    do {
      battleresult = await battle(stage, player, monster); // battle 함수에서 도주 성공시 escape를 반환하면, battle 함수가 종료되고 escape를 여기서 호출자(startgame)에게 전달, battleresult변수에 저장
      if (battleresult === 'escape') {
        console.log(chalk.cyanBright(`현재 스테이지에서 전투를 재시작합니다. `));
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기        
        monster = new Monster(stage); // 도주 후 몹 다시 젠
      }
    } while (battleresult === 'escape'); // 도주 성공 시 전투를 재시작

    if (player.hp <= 0) {
      console.log(chalk.red(`You Died.`));
      break;
    }

    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
}
