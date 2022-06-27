import React from 'react'
import './App.css'

function App() {
	const inputRef = React.useRef()
	const [animals, setAnimals] = React.useState([])
	const timeout = React.useRef()
	const throttling = React.useRef(false)

	const handleDebounceSearch = () => {
		clearTimeout(timeout.current)

		if (!inputRef.current.value.trim()) {
			setAnimals([])
			return
		}

		// API call happens only after 600ms after the user has stopped typing.

		timeout.current = setTimeout(() => {
			fetch(` http://localhost:4000/animals?q=${inputRef.current.value}`)
				.then(async (response) => {
					if (!response.ok) {
						alert('Somethin went wrong')
					} else {
						const data = await response.json()
						setAnimals(data)
					}
				})
				.catch((err) => {
					console.error(err)
				})
		}, 600)
	}

	const handleThrottleSearch = () => {
		if (throttling.current) {
			return
		}

		if (!inputRef.current.value.trim()) {
			setAnimals([])
			return
		}

		throttling.current = true

		setTimeout(() => {
			throttling.current = false
			fetch(` http://localhost:4000/animals?q=${inputRef.current.value}`)
				.then(async (response) => {
					if (!response.ok) {
						alert('Somethin went wrong')
					} else {
						const data = await response.json()
						setAnimals(data)
					}
				})
				.catch((err) => {
					console.error(err)
				})
		}, 600)
	}

	return (
		<div className="App">
			<p>Seach Input</p>
			<input
				type="text"
				ref={inputRef}
				onChange={handleThrottleSearch}
				className="search-input"
			/>
			{inputRef.current?.value && animals.length > 0 && (
				<ul>
					{animals.map((animal) => {
						return <li key={animal.id}>{animal.name}</li>
					})}
				</ul>
			)}
		</div>
	)
}

export default App
