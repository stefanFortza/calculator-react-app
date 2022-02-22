import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

enum ACTION {
	addDigit,
	chooseOperation,
	clear,
	deleteDigit,
	evaluate,
}
interface IAction {
	type: ACTION;
	payload: any;
}

interface IState {
	currentOperand: string;
	previousOperand: string;
	operation: string;
}

function reducer(state: IState, { type, payload }: IAction): IState {
	switch (type) {
		case ACTION.addDigit:
			if (payload.digit === "0" && state.currentOperand === "0") return state;
			if (payload.digit === "." && state.currentOperand.includes(".")) return state;

			return {
				...state,
				currentOperand: `${state.currentOperand || ""}${payload.digit}`,
			};
		case ACTION.chooseOperation:
			if (state.currentOperand === "" && state.previousOperand === "") return state;
			if (state.previousOperand === "")
				return {
					...state,
					operation: payload.operation,
					previousOperand: state.currentOperand,
					currentOperand: "",
				};
			return {
				...state,
				previousOperand: evaluate(state),
				operation: payload.operation,
				currentOperand: "",
			};
		case ACTION.clear:
			return { currentOperand: "", previousOperand: "", operation: "" };
		default:
			return state;
	}
}

function evaluate({ currentOperand, previousOperand, operation }: IState) {
	const prev = parseFloat(previousOperand);
	const currnet = parseFloat(currentOperand);
	if (isNaN(prev) || isNaN(currnet)) return "";
	let computation: string | number = "";
	switch (operation) {
		case "+":
			computation = prev + currnet;
			break;
		case "-":
			computation = prev - currnet;
			break;
		case "*":
			computation = prev * currnet;
			break;
		case "/":
			computation = prev / currnet;
			break;
		default:
			break;
	}

	return computation.toString();
}

function OperationButton({
	dispatch,
	operation,
	id,
}: {
	operation: string;
	dispatch: React.Dispatch<IAction>;
	id: string;
}) {
	return (
		<button
			onClick={() => dispatch({ type: ACTION.chooseOperation, payload: { operation } })}
			id={id}
		>
			{operation}
		</button>
	);
}

function DigitButton({
	dispatch,
	digit,
	id,
}: {
	digit: string;
	dispatch: React.Dispatch<IAction>;
	id: string;
}) {
	return (
		<button onClick={() => dispatch({ type: ACTION.addDigit, payload: { digit } })} id={id}>
			{digit}
		</button>
	);
}

function App() {
	const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {
		currentOperand: "",
		previousOperand: "",
		operation: "",
	});
	// dispatch({ type: ACTION.addDigit, payload: { digit: 1 } });

	return (
		<div className="calculator-grid">
			<div className="output" id="display">
				<div className="previous-operand">
					{previousOperand} {operation}
				</div>
				<div className="current-operand">{currentOperand}</div>
			</div>
			<button
				className="span-two"
				id="clear"
				onClick={() => dispatch({ type: ACTION.clear, payload: "" })}
			>
				AC
			</button>
			<button className="">DEL</button>
			<OperationButton operation={"/"} dispatch={dispatch} id="divide" />
			<DigitButton digit={"1"} dispatch={dispatch} id="one" />
			<DigitButton digit={"2"} dispatch={dispatch} id="two" />
			<DigitButton digit={"3"} dispatch={dispatch} id="three" />
			<OperationButton operation={"*"} dispatch={dispatch} id="multiply" />
			<DigitButton digit={"4"} dispatch={dispatch} id="four" />
			<DigitButton digit={"5"} dispatch={dispatch} id="five" />
			<DigitButton digit={"6"} dispatch={dispatch} id="six" />
			<OperationButton operation={"+"} dispatch={dispatch} id="add" />
			<DigitButton digit={"7"} dispatch={dispatch} id="seven" />
			<DigitButton digit={"8"} dispatch={dispatch} id="eight" />
			<DigitButton digit={"9"} dispatch={dispatch} id="nine" />
			<OperationButton operation={"-"} dispatch={dispatch} id="subtract" />
			<DigitButton digit={"."} dispatch={dispatch} id="decimal" />
			<DigitButton digit={"0"} dispatch={dispatch} id="zero" />
			<button className="span-two" id="equals">
				=
			</button>
		</div>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
