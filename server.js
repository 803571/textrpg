import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {startGame} from "./game.js";

// 로비 화면을 출력하는 함수
function displayLobby() {
    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('TexT - RPG', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(chalk.yellowBright.bold('TexTRPG에 오신것을 환영합니다!'));

    // 설명 텍스트
    console.log(chalk.green('Ver. 1.0'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(' 새로운 여정'));
    console.log(chalk.blue('2.') + chalk.white(' 업적 열람'));
    console.log(chalk.blue('3.') + chalk.white(' 옵션'));
    console.log(chalk.blue('4.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

// 유저 입력을 받아 처리하는 함수
async function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작합니다.'));
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log(chalk.green('개발자가 맵을 갈고 닦는 중..'));
            console.log(chalk.green('■■■■□□□□□□ 40%'));
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.clear();
            console.log(chalk.green('집 나간 고블린 데리고 오는 중..'));
            console.log(chalk.green('■■■■■■□□□□ 60%'));
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.clear();
            console.log(chalk.green('항해를 떠나기 위해 닻을 올리는 중..'));
            console.log(chalk.green('■■■■■■■■■□ 90%'));
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.clear();
            console.log(chalk.green('용사가 생성되었습니다.'));
            console.log(chalk.green('■■■■■■■■■■ 100%'));
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // 여기에서 새로운 게임 시작 로직을 구현
            startGame();
            break;
        case '2':
            console.log(chalk.yellow('이제 모험을 떠나는 풋내기 애송이가 업적이 어디있는가. 게임을 시작하세요.'));
            // 업적 확인하기 로직을 구현
            handleUserInput();
            break;
        case '3':
            console.log(chalk.blue('도구함을 잠근 자물쇠의 비밀번호가 기억나지 않습니다.. 게임을 시작하세요.'));
            // 옵션 메뉴 로직을 구현
            handleUserInput();
            break;
        case '4':
            console.log(chalk.red('게임을 종료합니다.'));
            // 게임 종료 로직을 구현
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하시게나, 젊은이.'));
            handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

// 게임 시작 함수
function start() {
    displayLobby();
    handleUserInput();
}

// 게임 실행
start();