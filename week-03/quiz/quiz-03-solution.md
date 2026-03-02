# Week 3 퀴즈: EVM/Security patterns

**제출 방법:**
1. 이 파일을 복사하여 `quiz-03-solution.md`로 저장
2. 각 문제에 답변 작성 (왜 그런지 설명 포함)
3. Pull Request 생성 (`quiz_submission` 템플릿 사용)

**평가 기준:**
- 정답 여부보다 **개념 이해도**를 중점 평가합니다
- 특히 **보안 취약점 식별과 방어 패턴**을 중점 평가합니다
- 코드 문제는 문법보다 보안 논리를 평가합니다

---

## 문제 1: [이론] EVM 개념 (객관식)

EVM(Ethereum Virtual Machine)이 "결정론적(deterministic)"으로 실행되어야 하는 이유는?

**보기:**
A) 모든 노드가 같은 CPU를 사용해야 하므로
B) 모든 노드가 같은 입력에 대해 같은 결과를 얻어야 합의가 가능하므로
C) 트랜잭션 처리 속도를 높이기 위해
D) 개발자가 코드를 디버깅하기 쉽게 하기 위해

**답변:**
<!--
정답과 함께, EVM에서 랜덤 함수나 외부 API 호출이 금지된 이유를 설명하세요.
-->
B 블록체인은 중앙 서버가 없다. 전 세계 노드들이 각자 계산한 결과가 100% 일치해야 거래가 진짜라고 합의될 수 있다. 만약 랜덤 함수나 API를 허용하면 노드마다 결과값이 달라져서 네트워크가 쪼개진다.

---

## 문제 2: [이론] Storage vs Memory (객관식)

다음 코드에서 `data` 변수의 저장 위치와 특성을 올바르게 설명한 것은?

```solidity
function process(uint[] memory data) public pure returns (uint) {
    uint sum = 0;
    for (uint i = 0; i < data.length; i++) {
        sum += data[i];
    }
    return sum;
}
```

**보기:**
A) Storage에 저장되며 함수 종료 후에도 유지된다
B) Memory에 저장되며 함수 종료 시 삭제된다
C) Stack에 저장되며 가장 비싼 저장 공간이다
D) Calldata에 저장되며 수정이 가능하다

**답변:**
<!--
정답과 함께, Storage/Memory/Stack의 비용 차이를 간단히 설명하세요.
힌트: 어떤 것이 가장 비싸고, 왜 비싼가요?
-->
B 메모리 키워드는 함수가 실행되는 동안만 유효한 임시 공간이다. Storage는 블록체인에 영구히 기록되어 모든 노드가 공유해야 하므로 가스비가 가장 많이 든다. 그다음 Memory, Stack 순으로 비싸다.(내림차순)

---

## 문제 3: [이론] Gas 비용 (객관식)

다음 중 Gas 비용이 가장 높은 연산은?

**보기:**
A) ADD (덧셈)
B) MUL (곱셈)
C) SLOAD (Storage 읽기)
D) SSTORE (Storage 쓰기)

**답변:**
<!--
정답과 함께, 왜 Storage 관련 연산이 비싼지 설명하세요.
힌트: Storage에 저장된 데이터는 어떤 특성이 있나요?
-->
D 단순 계산이나 읽기보다 데이터를 새로 기록하거나 수정하는 것이 블록체인의 네트워크 용량을 가장 많이 차지하기 때문에 가장 비싸게 책정되어 있다.

---

## 문제 4: [이론] CEI 패턴 (단답형)

**왜** CEI(Checks-Effects-Interactions) 패턴에서 Effects(상태 변경)가 Interactions(외부 호출)보다 먼저 와야 하나요?

재진입 공격 시나리오와 연결해서 구체적으로 설명하세요.

**답변:**
<!--
2-3 문장으로 설명하세요.
힌트:
- 외부 호출 시 상대방 컨트랙트의 코드가 실행됨
- 그 코드에서 다시 원래 함수를 호출하면?
- 상태가 변경되지 않은 상태라면 어떻게 될까요?
-->
외부 호출이 일어나면 제어권이 상대방에게 넘어간다. 이때 상대방이 내 함수를 다시 호출할 수 있는데, 상태 변경을 미리 해두지 않으면 시스템은 아직 돈을 안 보낸 것으로 착각하여 중복 지급을 하게 된다.

---

## 문제 5: [이론] The DAO 사건 교훈 (단답형)

2016년 The DAO 해킹($60M 피해)에서 우리가 배워야 할 **가장 중요한 교훈**은 무엇인가요?

이 사건 이후 이더리움 생태계에 어떤 변화가 있었나요?

**답변:**
<!--
2-3 문장으로 설명하세요.
교훈:
- 기술적 교훈 (코드 작성 관점)
- 생태계 교훈 (이더리움 커뮤니티 관점)
-->
기술 : 스마트 컨트랙트는 한 번 배포하면 수정이 거의 불가능하다. 따라서 CEI패턴처럼 상태를 먼저 변경하고 외부와 상호작용한다는 보안 원칙을 철저히 지켜야 한다는 사실을 다시한번 상기시켰다.

생태계 : 코드는 수정 불가하다는 원칙을 중시한 사람들은 ETC로 남았고, 생태계를 살리는게 우선이다라고 생각한 사람들은 현재의 ETH로 이동했다. 거대한 위기 앞에서는 사회적 합의가 필요하다는 것을 보여주었다.
---

## 문제 6: [코드] 재진입 공격 식별 (취약점 찾기)

다음 코드에서 재진입 공격 취약점을 찾으세요:

```solidity
// BAD CODE - 취약점 찾기
contract VulnerableVault {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // ETH 전송
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // 잔액 차감
        balances[msg.sender] -= amount;
    }
}
```

**1) 발견한 취약점:**
<!--
취약점 이름과 위치를 명시하세요.
힌트: withdraw 함수의 순서를 자세히 보세요.
-->
withdraw 함수에서 call 전송 이후에 balances[msg.sender] -= amount;가 나온다.

**2) 왜 이것이 문제인가:**
<!--
공격자가 어떻게 이 취약점을 악용할 수 있는지 단계별로 설명하세요.
-->
돈을 받은 공격자가 receive()함수를 통해 잔액이 깎이기 전의 withdraw를 다시 호출하여 무한 인출이 가능해진다.

**3) 올바른 수정 방법 (CEI 패턴):**
```solidity
// GOOD CODE - CEI 패턴으로 수정하세요
function withdraw(uint256 amount) public {
    // 여기에 안전한 코드를 작성하세요
    // 1. Checks
    require(balances[msg.sender] >= amount, "Insufficient balance");

    // 2. Effects (순서 변경!)
    balances[msg.sender] -= amount;

    // 3. Interactions
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

---

## 문제 7: [코드] CEI 패턴 구현 (빈칸 채우기)

다음 코드의 빈칸을 채워 CEI 패턴을 완성하세요:

```solidity
function secureWithdraw(uint256 amount) public {
    // 1. Checks - 조건 확인
    require(balances[msg.sender] >= amount, "Insufficient balance");

    // 2. Effects - 상태 변경 (외부 호출 전에!)
    balances[msg.sender] -= amount;;

    // 3. Interactions - 외부 호출 (마지막에!)
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

**답변:**
```solidity
// 빈칸을 채운 완성 코드를 작성하세요
```
문제에 수정하였습니다.
**왜 이 순서가 중요한가요:**
<!--
CEI 순서가 재진입을 어떻게 방지하는지 설명하세요.
-->
잔액을 먼저 깎아야 공격자가 call을 호출하여 재진입했을 때 require조건에서 탈락한다.

---

## 문제 8: [코드] tx.origin 취약점 (취약점 찾기)

다음 코드에서 보안 취약점을 찾으세요:

```solidity
// BAD CODE - 취약점 찾기
contract PhishingVulnerable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) public {
        require(tx.origin == owner, "Not owner");
        owner = newOwner;
    }
}
```

**1) 발견한 취약점:**
<!--
tx.origin과 msg.sender의 차이와 관련된 문제입니다.
-->
tx.origin은 트랜잭션을 처음 시작한 지갑 주소를 나타낸다.

**2) 공격 시나리오:**
<!--
공격자가 어떻게 이 취약점을 악용할 수 있나요?
힌트: 공격자 컨트랙트를 통한 우회
-->
공격자가 낚시 컨트랙트를 만들고, 주인이 그 컨트랙트의 함수를 실행하게 유도하면 tx.origin은 여전히 주인이 된다. 그러면 공격자 컨트랙트가 주인의 권한을 탈취해 transferOwnership을 실행할 수 있다.

**3) 올바른 수정 방법:**
```solidity
// GOOD CODE - 수정된 코드를 작성하세요
```
require(msg.sender == owner, "Not owner");
---

## 문제 9: [코드] ReentrancyGuard 적용 (빈칸 채우기)

다음 코드의 빈칸을 채워 ReentrancyGuard를 적용하세요:

```solidity
// TODO: OpenZeppelin import
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// TODO: 상속 추가
contract SecureVault is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // TODO: modifier 추가
    function withdraw(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed");
    }
}
```

**답변:**
```solidity
// 빈칸을 채운 완성 코드를 작성하세요
```
문제에 수정하였습니다.
**CEI 패턴 vs ReentrancyGuard - 언제 무엇을 사용하나요:**
<!--
두 방법의 장단점을 설명하세요.
-->
CEI패턴은 가스비가 들지 않는 기본 원칙이고, ReentrancyGuard는 코드 복잡도가 높을 때 사용하는 이중 잠금장치이다. 보통은 둘 다 사용하는 것이 권장된다.

---

## 문제 10: [다이어그램] 재진입 공격 흐름 해석 (다이어그램 분석)

다음 재진입 공격 시퀀스 다이어그램을 분석하세요:

```mermaid
sequenceDiagram
    participant A as 공격자
    participant V as VulnerableVault

    Note over A,V: 초기 상태: Vault 잔액 10 ETH, 공격자 예치금 1 ETH

    A->>V: 1. withdraw(1 ether) 호출
    V->>V: 2. require 통과 (잔액 1 ETH >= 1 ETH)
    V->>A: 3. call{value: 1 ether}() - ETH 전송
    Note over A: 4. receive() 트리거됨
    A->>V: 5. receive()에서 다시 withdraw(1 ether) 호출
    V->>V: 6. require 통과 (잔액 아직 1 ETH!)
    V->>A: 7. 또 1 ETH 전송
    Note over A: 8. 반복...
    Note over V: 9. Vault 잔액 0이 될 때까지 반복
    V->>V: 10. 최종: balances[attacker] -= 1 ether (여러 번 실행됨)
```

**질문 1:** 6번에서 require 체크가 통과하는 이유는 무엇인가요?

**답변:**
<!--
상태 변경(balances 차감)이 언제 일어나는지 확인하세요.
-->
아직 10번단계(잔액 차감)에 도달하지 않았기 때문에, 장부상 공격자의 잔액은 여전히 1ETH인 것으로 표시된다.

**질문 2:** CEI 패턴을 적용하면 6번에서 어떻게 되나요?

**답변:**
<!--
상태 변경 순서가 바뀌면 어떤 차이가 생기는지 설명하세요.
-->
3번 전에 10번이 실행되므로, 5번에서 다시 호출했을 때 6번의 require에서 잔액 부족으로 트랜잭션이 취소된다.

**질문 3:** 공격자가 총 몇 ETH를 탈취할 수 있나요? (예치금 1 ETH, Vault 총 잔액 10 ETH 가정)

**답변:**
<!--
공격 시나리오를 수치로 분석해 보세요.
-->
예치금 1ETH를 이용해 볼트에 들어있는 1ETH전체를 탈취할 수 있다.

---

## 자기 평가

모든 문제를 풀었다면, 아래 체크리스트로 자기 평가를 해보세요:

- [v] EVM의 결정론적 실행 필요성을 이해했다
- [v] Storage/Memory/Stack의 차이와 비용을 알고 있다
- [v] 재진입 공격의 원리를 설명할 수 있다
- [v] CEI 패턴으로 재진입 공격을 방어할 수 있다
- [v] tx.origin vs msg.sender의 보안 차이를 알고 있다
- [v] ReentrancyGuard를 적용할 수 있다

---

## 참고 자료

- 이론: `eth-materials/week-03/theory/slides.md`
- 취약한 코드: `eth-homework/week-03/dev/src/Vault.sol`
- 안전한 코드: `eth-homework/week-03/dev/src/VaultSecure.sol`
- 테스트: `eth-homework/week-03/dev/test/Vault.t.sol`
- 용어: `eth-materials/resources/glossary.md`
