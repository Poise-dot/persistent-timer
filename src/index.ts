import timerSlice from "./store/slices/timer-slice";
import Store from "./store/Store";
import Timer from "./view/Timer";

class Program {
	static main(): void {
		const app: DocumentFragment = new DocumentFragment();

		Store.createStore({
			slices: [timerSlice],
		});

		const timer = new Timer();

		app.append(document.createTextNode("Test"));
		app.append(timer.elements.root);
		document.getElementById("app")?.appendChild(app);
	}
}

Program.main();
