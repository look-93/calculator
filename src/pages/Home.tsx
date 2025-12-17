import { useEffect, useState } from "react";
import CalcKey from "../components/CalcKey";
const keyValue = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "=",
  "+",
];
export default function Home() {
  const [value, setValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [justOperator, setJustOperator] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [clearValue, setClearValue] = useState(false);

  const [onKeyDown, setOnKeyDown] = useState("");
  const result = (num: any) => {
    setValue((value: string) => {
      if (isNaN(Number(num))) {
        return "0" + num;
      }
      return value + num;
    });

    // "=" 연산자 제외
    if (num === "=") {
      setValue(value);
    }

    if (num === "=") {
      let newValue = String(value).replace("=", "");
      let tokens = newValue.match(/\d*\.?\d+|[+\-*/]/g);

      if (!tokens) return;

      let stack = [];
      let current = Number(tokens[0]);

      for (let i = 1; i < tokens.length; i += 2) {
        let operator = tokens[i];
        let next = Number(tokens[i + 1]);

        if (operator === "*") {
          current = current * next;
        } else if (operator === "/") {
          current = current / next;
        } else {
          stack.push(current);
          stack.push(operator);
          current = next;
        }
      }
      stack.push(current);

      let finalResult = Number(stack[0]);
      for (let i = 1; i < stack.length; i += 2) {
        let operator = stack[i];
        let next = Number(stack[i + 1]);

        if (operator === "+") {
          finalResult = finalResult + next;
        } else {
          finalResult = finalResult - next;
        }
      }
      setJustOperator(true);
      setFinalValue(String(` = ${finalResult}`));

      // let calcStack = [];
      // calcStack.push(`${value} = ${finalResult}`);

      // 먼저 로컬스토리지 값 확인
      // 로컬스토리지에서 데이터의 갯수 확인

      // 로컬스토리지안에 calcs에 있는 문자열을 객체로 바꾼 데이터의 갯수

      // const caldat = ["aa","bb","cc"]
      // const stpy = "[\"aa\",\"bb\",\"cc\"]"

      // const stringOBJ = JSON.stringify(bora);
      // const stringOBJ1: string = '{name:"보라"}';
      // localStorage.setItem("bora", stringOBJ1);
      // const borastr = localStorage.getItem("bora");

      //   const calcs = localStorage.getItem("calcs");
      //   if (calcs) {
      //     // 있으면 꺼내서 객체(역질렬화:문자를 객체로 만든다)로 만든 뒤 길이를 잰다
      //     // 3개 이하면 집어넣고, 4개 이상이면 처음 넣은 데이터를 삭제 후 삽입(pop)
      //     // 로컬스토리지안에 calcs에 있는 문자열을 객체로 바꾼 데이터의 갯수
      //     const calcArray: string[] = JSON.parse(calcs);

      //     if (calcArray.length <= 3) {
      //       calcArray.push(`${value} = ${finalResult}`);
      //       const calcArrayString = JSON.stringify(calcArray);
      //       localStorage.setItem("calcs", calcArrayString);
      //     } else if (calcArray.length >= 4) {
      //       calcArray.pop();
      //       calcArray.push(`${value} = ${finalResult}`);
      //       const calcArrayString = JSON.stringify(calcArray);
      //       localStorage.setItem("calcs", calcArrayString);
      //     }
      //   } else {
      //     // 없으면 값을 배열에 넣어서 (직렬화(stringify):객체를 문자(bytecode)로 변경
      //     // 로컬스토리지에 저장
      //     const calcArray = [`${value} = ${finalResult}`];
      //     const calcArrayString = JSON.stringify(calcArray);
      //     localStorage.setItem("calcs", calcArrayString);
      //   }
      // }

      //상태로 히스토리 관리를 하고, 저장 할 때는 로컬스토리지에 함께,
      //최초에 불러 올 때는 로컬스토리지를 불러와서 히스토리에 넣는다.

      const calcs = localStorage.getItem("calcs");

      const newItem = `${value} = ${finalResult}`;

      if (!calcs) {
        const newArray = [newItem];
        localStorage.setItem("calcs", JSON.stringify(newArray));
      } else {
        const calcArray = JSON.parse(calcs);

        if (calcArray.length >= 3) {
          const updateCalcs = [...calcArray, newItem].slice(-3);
          localStorage.setItem("calcs", JSON.stringify(updateCalcs));
        } else if (calcArray.length <= 3) {
          const updateCalcs = [...calcArray, newItem];
          localStorage.setItem("calcs", JSON.stringify(updateCalcs));
        }
      }
    }

    const calcArray = localStorage.getItem("calcs");

    const calcs = JSON.parse(calcArray ?? "[]");

    // 연산자를 누른 경우 마지막 결과값으로 재연산
    if (justOperator && isNaN(Number(num))) {
      const newCalc = finalValue.replace("=", "");
      setValue(`${!newCalc ? "0" : newCalc}${num}`);
      setFinalValue("");
      setJustOperator(false);
      setHistory(calcs);
    }
    // 숫자를 누른경우 누른 숫자부터 재연산
    else if (justOperator && !isNaN(Number(num))) {
      setValue(num);
      setFinalValue("");
      setJustOperator(false);
      setHistory(calcs);
    }
  };

  const clear = () => {
    setFinalValue("");
    setValue((prev) => {
      if (justOperator) {
        return "0";
      } else if (prev.length <= 1) {
        return "0";
      }
      return prev.slice(0, -1);
    });
  };

  useEffect(() => {
    const calcs = localStorage.getItem("calcs");
    const calcArray = JSON.parse(calcs ?? "[]");
    setHistory(calcArray);
  }, [clearValue, value]);

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     console.log(e.key);
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => window.removeEventListener("keydown", handleKeyDown);
  // }, []);

  return (
    <div>
      <div className="bg-red-500 text-white p-4 text-center text-lg ">
        계산기 만들기!
      </div>
      <div className="flex justify-center pt-20 ">
        <div className="border border-gray-400 rounded-sm">
          <div className="h-30">
            <div className="flex items-end justify-end h-[100px] m-2 bg-gray-400 shadow-md ">
              <div>
                {history.map((data, idx) => (
                  <p key={idx} className="text-right">
                    {data}
                  </p>
                ))}

                <p className="text-right">
                  {value === "" ? "0" : value}
                  {finalValue}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 shadow-md h-[40px] border-t border-b border-gray-400 bg-gray-200 ">
            <CalcKey
              keyValue={"AC"}
              onClick={() => {
                localStorage.clear();
                setValue("");
                setFinalValue("");
                setHistory([]);
              }}
            />
            <CalcKey
              keyValue={"C"}
              onClick={() => {
                clear();
                setClearValue(true);
              }}
            />
          </div>
          <div className="grid grid-cols-4 h-60 w-60 ">
            {keyValue.map((keyValue, idx) => (
              <CalcKey
                key={idx}
                keyValue={keyValue}
                className={!isNaN(Number(keyValue)) ? "" : "bg-gray-200 "}
                onClick={() => {
                  result(keyValue);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
