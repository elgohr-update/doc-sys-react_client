import * as React from 'react'
import { NormalPeoplePicker, Persona, PersonaSize } from '@fluentui/react'

import { authHeader } from '../../redux/_helpers/authHeader'

export function PeopleAutosuggest(props) {
	const [peopleList, setPeopleList] = React.useState([])
	// const [selectedList, setSelectedList] = React.useState([])

	const suggestionProps = {
		suggestionHeaderText: 'Suggested People',
		noResultsFoundText: 'No results found',
		loadingText: 'Loading',
		showRemoveButton: true,
	}

	const ResolveSuggestions = (filterText, currentPersonas, limitResults) => {
		if (filterText) {
			let filteredPersons = filterPersons(filterText)
			console.log(filteredPersons)
			filteredPersons = filteredPersons.filter(
				persona => !listContainsPersona(filteredPersons, currentPersonas)
			)
			console.log(filteredPersons)
			filteredPersons = limitResults
				? filteredPersons.slice(0, limitResults)
				: filteredPersons

			return filteredPersons
		} else {
			return []
		}
	}
	const listContainsPersona = (person, persons) => {
		if (!persons || !persons.length || persons.length === 0) {
			return false
		}
		return persons.filter(item => item.text === person.text).length > 0
	}

	const removeDuplicates = (personas, possibleDupes) => {
		return personas.filter(
			persona => !listContainsPersona(persona, possibleDupes)
		)
	}

	const filterPersons = filterText =>
		peopleList.filter(
			i =>
				i.settings.displayName.toLowerCase().indexOf(filterText.toLowerCase()) === 0
		)

	const requestOptions = {
		method: 'GET',
		headers: authHeader({ 'Content-Type': 'application/json' }),
	}
	fetch(
		`http://${process.env.API_BASE || 'localhost:3001'}/user/`,
		requestOptions
	)
		.then(response => response.json())
		.then(data => {
			setPeopleList(data.user)
		})

	return (
		<NormalPeoplePicker
			onResolveSuggestions={ResolveSuggestions}
			pickerSuggestionsProps={suggestionProps}
			onEmptyInputFocus={currentPersonas =>
				peopleList
					.filter(persona => !listContainsPersona(persona, currentPersonas))
					.splice(0, 5)
			}
			getTextFromItem={i => i.settings.displayName}
			className={'ms-PeoplePicker'}
			onRenderSuggestionsItem={i => (
				<Persona
					size={PersonaSize.size24}
					imageUrl={`data:image/png;base64,${i.avatar}`}
					text={i.settings.displayName}
					styles={{ inner: { padding: 5 } }}
				/>
			)}
			onRenderItem={i => (
				<Persona
					size={PersonaSize.size24}
					imageUrl={`data:image/png;base64,${i.item.avatar}`}
					text={i.item.settings.displayName}
					styles={{ inner: { padding: 5 } }}
					key={i.key}
				/>
			)}
			onChange={props.onChangeHandler}
		/>
	)
}
