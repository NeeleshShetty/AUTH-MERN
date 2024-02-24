import { BrowserRouter,Routes,Route } from "react-router-dom"
import Header from "./components/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
			<Routes>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/about"
					element={<About />}
				/>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/sign-in"
					element={<Signin />}
				/>
				<Route
					path="/sign-up"
					element={<Signup />}
				/>
				<Route
					path="/profile"
					element={<Profile />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App