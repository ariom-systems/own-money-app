import React from 'react'
import { Select } from 'native-base'
import { AuthContext } from '../../data/Context'
import { buildDataPath } from '../../data/Actions'
import { api } from '../../config'

export const Controlled = (props) => {
	switch(props.component) {
		case 'Purpose': return <Purpose {...props} /> ; break
	}
}

export const Purpose = (props) => {
	const { auth } = React.useContext(AuthContext)
	const [ purposes, setPurposes ] = React.useState([])

	React.useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'purpose'))
		.then(response => {
			let list = []
			if(response.ok == true) {
				if(Array.isArray(response.data)) {
					response.data.map((element, index) => {
						list.push(<Select.Item key={index} label={element.purpose} value={element.purpose}/>)
					})
					if(auth.uid == 16) { //ME!!!
						list.push(<Select.Item key={'999'} label={"API Testing Only"} value={"API Testing Only"}/>)
					}
					setPurposes(list)
				}
			}
		})
		.catch(error => console.log(error))
	}, [])

	return (
		<Select fontSize={"md"} placeholder={props.placeholder} selectedValue={props.value} value={props.value} onValueChange={props.onValueChange}>
			{purposes}
		</Select>
	)
}