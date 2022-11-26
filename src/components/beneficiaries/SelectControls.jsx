import React from 'react'
import { Select } from 'native-base'
import { buildDataPath, buildSearchPath } from '../../data/Actions'
import { AuthContext } from '../../data/Context'
import { api } from '../../config'
import { useFormContext } from 'react-hook-form'

export const Controlled = (props) => {
	switch(props.component) {
		case 'AccountType': return <AccountType {...props} /> ; break
		case 'BankName': return <BankName {...props} /> ; break
		case 'BranchCity': return <BranchCity {...props} /> ; break
		case 'Province': return <Province {...props} /> ; break
		case 'District': return <District {...props} /> ; break
	}
}


export const AccountType = (props) => {
	const [ accountType, setAccountType ] = React.useState({
		types: []
	})
	
	React.useEffect(() => {
		const data = require('../../json/account_types.json')
		let types = []
		data.map((element, index) => {
			types.push(<Select.Item key={index} label={element.label} value={element.value} />)
		})
		setAccountType({ types: types })
	}, [])

	const types = accountType.types
	const placeholder = props.placeholder
	return(
		<Select fontSize={"lg"} placeholder={placeholder} onValueChange={props.onValueChange} selectedValue={props.value}>
			{types}
		</Select>
	)
}


export const BankName = (props) => {
	const [ bankName, setBankName ] = React.useState({
		names: []
	})
	
	React.useEffect(() => {
		const data = require('../../json/bank_names.json')
		let names = []
		data.map((element, index) => {
			if(element.hasOwnProperty('type')) {
				names.push(<Select.Item key={index} label={"--------------------"} value={""} disabled={true} />)
			} else {
				names.push(<Select.Item key={index} label={element.label} value={element.value} />)
			}
		})
		setBankName({ names: names })
	}, [])

	const names = bankName.names
	const placeholder = props.placeholder
	return(
		<Select fontSize={"lg"} placeholder={placeholder} onValueChange={props.onValueChange} selectedValue={props.value}>
			{names}
		</Select>
	)
}


export const BranchCity = (props) => {
	const { auth } = React.useContext(AuthContext)
	const [ city, setCity ] = React.useState({
		loaded: false,
		cities: [],
		error: null
	})

	React.useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'provinces'))
		.then(response => {
			let cities = []
			//console.log('branch-cities')
			response.data.map((element, index) => {
				const value = element.name_en
				const label = element.name_en + ' (' + element.name_th + ')'
				cities.push(<Select.Item key={index} label={label} value={value}/>)
			})
			setCity({
				loaded: true,
				cities: cities
			})
		}, error => {
			setCity({
				loaded: true,
				error
			})
		})
	}, [])

	const placeholder = props.placeholder
	const { error, loaded, cities } = city
	if(error) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={error.message} value={"nothing"} />
			</Select>
		)
	} else if(!loaded) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={"loading..."} value={"loading"} />
			</Select>
		)
	} else {
		return (
			<Select fontSize={"lg"} placeholder={placeholder} selectedValue={props.value} value={props.value} onValueChange={
				(itemValue) => {
					props.onValueChange(itemValue)
				}}>
				{cities}
			</Select>
		)
	}
}


export const Province = (props) => {
	const { setValue } = useFormContext()
	const { auth } = React.useContext(AuthContext)
	const [ province, setProvince ] = React.useState({
		isLoaded: false,
		provinces: []
	})

	React.useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		getProvinces()
	}, [])

	const getProvinces = () => {
		api.get(buildDataPath('globals', null, 'provinces'))
		.then(response => {
			let list = []
			if(response.ok == true) {
				response.data.map((element, index) => {
					const value = element.name_en
					const label = element.name_en + ' (' + element.name_th + ')'
					list.push(<Select.Item key={index} label={label} value={value}/>)
				})
				setProvince({...province, isLoaded: true, provinces: list})
			}
		})
		.catch(error => console.log(error))
	}


	const handleChange = (value) => {
		setValue('state', value, { shouldTouch: true })
	}

	const placeholder = props.placeholder
	const { isLoaded, provinces } = province
	if(!isLoaded) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={"loading..."} value={"loading"} />
			</Select>
		)
	} else {

		return (
			<Select fontSize={"lg"} placeholder={placeholder} selectedValue={props.value} value={props.value} onValueChange={
				(itemValue) => {
					handleChange(itemValue)
					props.onValueChange(itemValue)
				}}>
				{provinces}
			</Select>
		)
	}
}


export const District = (props) => {
	const { setValue, getValues, watch } = useFormContext()
	const { auth } = React.useContext(AuthContext)
	const state = watch("state")
	const city = watch("city")
	const [district, setDistrict] = React.useState({
		isLoaded: false,
		districts: [],
		postcode: ""
	})

	React.useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		getDistricts()
	}, [state])

	const handleChange = (value) => {
		setValue('city', value, { shouldTouch: true})
		getPostcode()
	}

	const getDistricts = () => {
		const province = getValues("state")
		api.post(buildDataPath('globals', null, 'districts'), { province: province })
		.then(response => {
			if(response.ok == true) {
				let list = []
				response.data.map((item, index) => {
					const label = item.district + ' (' + item.name_th + ')'
					const value = item.district
					list.push(<Select.Item key={index} label={label} value={value} />)
				})
				setDistrict({...district, isLoaded: true, districts: list})
			}
		})
		.catch(error => console.log(error))
	}
	
	const getPostcode = () => {
		api.post(buildDataPath('globals', null, 'postcode'), { district: city })
		.then(response => {
			if(response.ok == true) {
				setValue("postcode", response.data[0].zip_code)
			}
		})
		.catch(error => console.log(error))
	}
	
	const placeholder = props.placeholder
	
	const { isLoaded, districts } = district
	if(!isLoaded) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={"Please select a Province first"} value={""} />
			</Select>
		)
	} else {
		return (
			<Select fontSize={"lg"} placeholder={placeholder} selectedValue={props.value} value={props.value} onValueChange={
				(itemValue) => {
					handleChange(itemValue)
					props.onValueChange(itemValue)
				}}>
				{districts}
			</Select>
		)
	}	
}