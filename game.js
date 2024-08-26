import chalk from "chalk";
import readlineSync from "readline-sync";

// 이것은, 어렸을 때 하던 파이널판타지가 될 수도 있고, 쯔꾸르가 될 수도 있다.
// 근데 파판은 안해봄 ㅋㅋ

// 2초 대기
let delay = async (ms = 2000) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// ====================================== 이곳은 플레이어 스펙, 몬스터 스펙을 보는 구간입니다 ======================================
class Player {
  constructor() {
    this.hp = 100; // 플레이어 피통
    this.attackPower = 15; // 플레이어 기본데미지
    this.skills = ["발악", "응급치료"]; //보유한 스킬목록
    this.skillCooldowns = Array(this.skills.length).fill(0); // 스킬 쿨타임은 최초 0
  }

  attack(monster) {
    // 플레이어 -> 몬스터에게 공격
    let damage = this.attackPower;
    monster.hp -= damage;
    return damage;
  }

  useskills(skillIndex, monster) {
    let damage = 0;
    let skills = this.skills[skillIndex];

    // 스킬이 쿨타임이면 나오는 문구
    if (this.skillCooldowns[skillIndex] > 0) {
      return {
        damage,
        message: `아직 ${skills} 을(를) 다시 쓰기에는 숨이 차다.. (${this.skillCooldowns[skillIndex]} 만큼 기다리자.)`,
      };
    }

    if (skills === "발악") {
      let chance = Math.random();
      // damage = chance < 0.7 ? 10 * 2 : 20 * 2; // 70%확률로 10*2 데미지, 그외 확률로 20*2 데미지
      damage = this.attackPower * (chance < 0.7 ? 1.5 : 3);
      monster.hp -= damage;
    } else if (skills === "응급치료") {
      this.hp = Math.min(this.hp + 15, 100); //최대 체력 이상으로는 체력회복 불가
      this.skillCooldowns[skillIndex] = 3; // 응치 쿨 3턴
      return {
        damage: 0,
        message: `붕대를 메서 상처부위를 응급치료했다. 체력이 15만큼 회복되었다.`,
      };
    }

    this.skillCooldowns[skillIndex] = 3; // 스킬 쿨다운 3턴
    return { damage, message: ` ` }; // 피해를 입히고, 빈 메시지가 나오도록 합니다. 안하면 피해입힌거 두번나옴
  }

  reduceCooldowns() {
    // 스킬 쿨다운이 1씩 감소. 단, 이건 모든 스킬 쿨을 1씩 깝니다.
    this.skillCooldowns = this.skillCooldowns.map((cd) => Math.max(cd - 1, 0));
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + (stage - 1) * 10; // 스테이지에 따라 피통 증가
    // this.hp = 100 + stage * 10; // 스테이지에 따라 피통 증가
    this.attackPower = 10 + stage; //스테이지에 따라 공격력 증가

  }

  attack(player) {
    let damage;
    let hitChance = Math.random();
    if (hitChance < 0.2) {
      // 감나빗
      damage = 0;
      return { damage, message: `운 좋게 공격을 회피한 것 같다..` };
    } else if (hitChance < 0.7) {
      damage = 10; // 10데미지
    } else {
      damage = 30; // 10데미지
    }
    player.hp -= damage;
    // return damage;
    return { damage, message: null };
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

    logs.forEach((log) => console.log(log)); // 현재까지의 로그 출력

    console.log(
      chalk.green(
        `\n1. 기본공격 \n2. 스킬 \n3. 방어자세를 취한다. \n4. 도주하기`
      )
    ); // 플레이어한테 선택지를 줌
    const choice = readlineSync.question("용사는 무얼 할까?? "); // 단순 나레이션

    if (choice === "1") {
      //                                                                                                       ◀ 기본공격
      logs = []; // 매턴 마다 로그를 초기화

      let hitChance = Math.random();
      if (hitChance < 0.6) {
        let damage = player.attack(monster);
        logs.push(
          chalk.green(`용사가 몬스터에게 `) +
            chalk.yellow(`${damage}`) +
            chalk.green(` 만큼 피해를 주었습니다.`)
        );
      } else {
        logs.push(chalk.red(`'이런, 손이 미끄러졌다...'`));
        logs.push(chalk.cyanBright(`빗나감!`));
      }

      if (monster.hp <= 0) {
        console.clear();
        displayStatus(stage, player, monster); // 몹잡고 최종 상태 불러오기
        logs.push(chalk.green(`  << 몬스터를 처치했습니다! >> `));
        logs.forEach((log) => console.log(log));

        await delay(); // 2초 대기

        return "monster_defeated"; // 몬스터를 처치했음을 호출자에게 반환합니다.
      }

      let result = monster.attack(player);
      if (result.message) {
        logs.push(chalk.cyanBright(result.message)); //에러나면 이거랑 위에꺼 삭제하고 그 위에꺼 다시 활성화, 플레이어클래스도 수정
      }
      if (result.damage > 0) {
        logs.push(
          chalk.red(`몬스터가 용사에게 `) +
            chalk.yellow(`${result.damage}`) +
            chalk.red(` 만큼 피해를 입혔습니다.`)
        );
      }

      if (player.hp <= 0) {
        return "player_defeated";
      }
    } else if (choice === "2") {
      //                                                                                                       ◀ 스킬
      logs = []; // 매턴 마다 로그를 초기화

      let allSkillOnCooldown = player.skillCooldowns.every(
        (cd) => cd > 0
      );

      if (allSkillOnCooldown) {
        console.log(
          chalk.red(`모든 스킬이 쿨타임이다. 다른 행동을 취하자. `)
        );
        await delay(); // 2초 대기
        continue;
      }

      console.log(chalk.blue(`스킬 목록: `));
      player.skills.forEach((attack, index) => {
        console.log(
          `${index + 1}. ${attack} (쿨타임: ${player.skillCooldowns[index] > 0 ? player.skillCooldowns[index] + "턴" : "사용가능"})`
        );
      });

      let attackChoice = readlineSync.question(`(취소는 0) 어떤 스킬을 사용할까? : `);
      if (attackChoice === "0") {
        logs.push(chalk.cyanBright(`스킬사용을 취소했다. `));
        continue;
      }

      let attackIndex = parseInt(attackChoice, 10) - 1;

      if (attackIndex >= 0 && attackIndex < player.skills.length) {
        let result = player.useskills(attackIndex, monster);
        logs.push(chalk.red(result.message)); // 스킬 사용 메시지 출력

        if (result.damage > 0) {
          logs.push(
            chalk.magenta(
              `용사는 ${player.skills[attackIndex]}을(를) 발동했다! `
            ) +
              chalk.yellow(`${result.damage}`) +
              chalk.magenta(` 만큼의 피해를 입혔다.`)
          );
        }
      } else {
        logs.push(
          chalk.red(
            `배운 적 없는 걸 열심히 쓰려고 하지말게나, 젊은이... .. 어디선가 이상한 소리가 들리는 듯 하다.`
          )
        );
      }

      if (monster.hp <= 0) {
        console.clear();
        displayStatus(stage, player, monster); // 몹잡고 최종 상태 불러오기
        logs.push(chalk.green(`  << 몬스터를 처치했습니다! >> `));
        logs.forEach((log) => console.log(log));

        await delay(); // 2초 대기

        return "monster_defeated"; // 몬스터를 처치했음을 호출자에게 반환합니다.
      }

      let result = monster.attack(player);
      if (result.message) {
        logs.push(chalk.cyanBright(result.message)); // 감나빗
      }
      if (result.damage > 0) {
        logs.push(
          chalk.red(`몬스터가 용사에게 `) +
            chalk.yellow(`${result.damage}`) +
            chalk.red(` 만큼 피해를 입혔습니다.`)
        );
      }

      if (player.hp <= 0) {
        return "player_defeated";
      }
    } else if (choice === "3") {
      logs = []; // 매턴 마다 로그를 초기화

      let blockChance = Math.random();
      if (blockChance <= 0.65) {
        logs.push(
          chalk.yellow(`용사는 몸을 한껏 웅크려 방어자세를 취했습니다... `)
        );
        await delay(); // 2초 대기
        logs.push(chalk.yellow(`..!! 공격을 막아냈다! `));
      } else {
        let result = monster.attack(player);
        if (result.damage === 0) {
          logs.push(
            chalk.cyanBright(
              `방어에 실패했지만 몬스터도 헛손질을 했다! 운이 좋았다!`
            )
          );
        } else {
          let increaseDamage = result.damage * 2;
          player.hp -= result.damage;
          logs.push(
            chalk.red(`..으윽!!! 공격을 막아내지 못했다..`) +
              chalk.red(`몬스터가 용사에게 `) +
              chalk.yellow(`${increaseDamage}`) +
              chalk.red(` 만큼 피해를 입혔습니다.`)
          );

          if (player.hp <= 0) {
            return "player_defeated";
          }
        }
      }
    } else if (choice === "4") {
      logs = []; // 매턴 마다 로그를 초기화

      let escapeChance = Math.random();
      if (escapeChance <= 0.3) {
        console.clear();
        console.log(chalk.green(`성공적으로 도주했다!!`));

        await delay(); // 2초 대기

        return "escape";  
      } else {
        logs.push(chalk.red(`이런, 도주에 실패했다!`));
      }
    } else {
      logs.push(
        chalk.red(
          `올바른 선택을 하시게나, 젊은이.  ... '어디선가 이상한 소리가 들리는 듯 하다.'`
        )
      );
    }
    player.reduceCooldowns(); // 매 턴마다 쿨타임을 1씩 감소시킵니다.
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
      if (battleresult === "escape") {
        console.log(
          chalk.cyanBright(`현재 스테이지에서 전투를 재시작합니다. `)
        );
        await delay(); // 2초 대기
        monster = new Monster(stage); // 도주 후 몹 다시 젠
      }
    } while (battleresult === "escape"); // 도주 성공 시 전투를 재시작

    if (battleresult === "player_defeated") {
      console.clear();
      console.log(chalk.red(`당신은 사망하였습니다.. 게임을 종료합니다. `));
      await delay();
      break;
    }

    if (battleresult === "monster_defeated") {
      player.hp = Math.min(player.hp + 50, 100); //최대 체력을 넘기지 않도록 제한
      console.clear();
      
      
      // 기본공격력 증가, 20%확률로 2배
      let increaseAmount = 2;
      if (Math.random() < 0.2) {
        increaseAmount = 4;
        console.log(chalk.yellow(`럭키! 평소보다 더욱 강해진 기분이다. 현재 기본 공격력: ${player.attackPower + increaseAmount}`));
      } else {
        console.log(chalk.cyan(`조금 더 강해진 기분이다. 현재 기본 공격력: ${player.attackPower + increaseAmount}`));
      }

      player.attackPower += increaseAmount; // 공격력 증가 적용

      console.log(chalk.green(`부상을 치료합니다... 현재 체력은 ${player.hp} 입니다.`));

      await delay();

      stage++;

      if (stage <= 10) {
        console.clear();
        console.log(
          chalk.cyanBright(`용사는 가던 길을 마저 걷기 시작했습니다.. `)
        );
        await delay();

        console.clear();
        console.log(chalk.cyanBright(`앗! 야생의 몬스터가 나타났다!`));
        await delay();
      }
    }
  }
  if (stage > 10) {
    console.clear();
    console.log(chalk.green(`축하합니다! 숲을 빠져나왔습니다.`));
  }
}
