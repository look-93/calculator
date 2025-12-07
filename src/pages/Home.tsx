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
  const [calc, setCalc] = useState("");
  const [justOperator, setJustOperator] = useState(false);
  const [calcStack, setCalcStack] = useState<[]>([]);

  const result = (num: any) => {
    // console.log(num);

    setValue(value + num);

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

      //먼저 로컬스토리지 값 확인
      // 로컬스토리지에서 데이터의 갯수 확인
      // 3개 이하면 집어넣고, 4개 이상이면 처음 넣은 데이터를 삭제 후 삽입(pop)
      let calcStack = [];
      if (localStorage.length === null) {
        calcStack.push(`${value} = ${finalResult}`);
        let calcStackJson = JSON.stringify(calcStack);
        localStorage.setItem("calcs", calcStackJson);
      } else if (localStorage.length <= 3) {
        let getCalcStackJson = localStorage.getItem("calcs");

        calcStack.push(`${getCalcStackJson}${value} = ${finalResult}`);
        let calcStackJson = JSON.stringify(getCalcStackJson);
        localStorage.setItem("calcs", calcStackJson);
        console.log(localStorage.getItem("calcs"));
      }
    }

    // localStorage.clear();
    // 연산자를 누른 경우 마지막 결과값으로 재연산
    if (justOperator && isNaN(Number(num))) {
      const newCalc = finalValue.replace("=", "");
      setValue(`${newCalc}${num}`);
      setFinalValue("");
      setJustOperator(false);
    }
    // 숫자를 누른경우 누른 숫자부터 재연산
    else if (justOperator && !isNaN(Number(num))) {
      setValue(num);
      setFinalValue("");
      setJustOperator(false);
    }
  };

  // const storedCalcs = localStorage.getItem("calcs");

  // useEffect(() => {
  //   if (!storedCalcs) {
  //     setCalcStack([]);
  //   } else {
  //     setCalcStack(JSON.parse(storedCalcs));
  //   }
  // }, [storedCalcs]);

  // console.log(calcStack);
  // localStorage.clear();
  // if (json) {
  //   const storedCalcs = JSON.parse(json);

  // } else {
  //   setCalcStack("0");
  // }

  return (
    <div>
      <div className="bg-red-500 text-white p-4 text-center text-lg ">
        계산기 만들기!
      </div>
      <div className="flex justify-center pt-20 ">
        <div className="border border-gray-400 rounded-sm">
          <div className="h-30">
            <div className="flex items-end justify-end h-[100px] m-2 bg-gray-400 shadow-md ">
              <p className="">
                {/* {calcStack} */}
                {value === "" ? "0" : value}
                {finalValue}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 shadow-md h-[40px] border-t border-b border-gray-400 bg-gray-200 ">
            <CalcKey keyValue={"AC"} />
            <CalcKey keyValue={"C"} />
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
