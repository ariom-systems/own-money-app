import React, { useContext, useState, useEffect } from 'react'

//components
import { Select } from 'native-base'

//data
import { buildDataPath } from '../../data/Actions'
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
		case 'Purpose': return <Purpose {...props} />; break
		case 'State': return <State {...props} />; break
	}
}

export const AccountType = (props) => {
	const { auth } = useContext(AuthContext)
	const [ accountType, setAccountType ] = useState({
		loaded: false,
		types: [],
		error: null
	})

	useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'account_types'))
			.then(response => {
				let types = []
				if (Array.isArray(response.data)) {
					response.data[0].options.map((element, index) => {
						const value = element.value
						const label = element.label
						types.push(<Select.Item key={index} label={label} value={value} />)
					})
					setAccountType({
						loaded: true,
						types: types
					})
				}
			}, error => {
				setAccountType({
					loaded: true,
					error
				})
			})
	}, [])

	const placeholder = props.placeholder
	const { error, loaded, types } = accountType
	if (error) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
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
				{types}
			</Select>
		)
	}
}


export const BankName = (props) => {
	const { auth } = useContext(AuthContext)
	const [ bankName, setBankName ] = useState({
		loaded: false,
		names: [],
		error: null
	})

	useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'bank_names'))
			.then(response => {
				let names = []
				if (Array.isArray(response.data)) {
					response.data[0].options.map((element, index) => {
						const value = element.value
						const label = element.label
						names.push(<Select.Item key={index} label={label} value={value} />)
					})
					setBankName({
						loaded: true,
						names: names
					})
				}
			}, error => {
				setBankName({
					loaded: true,
					error
				})
			})
	}, [])
	
	const placeholder = props.placeholder
	const { error, loaded, names } = bankName
	if (error) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
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
				{names}
			</Select>
		)
	}
}


export const BranchCity = (props) => {
	const { auth } = useContext(AuthContext)
	const [ city, setCity ] = useState({
		loaded: false,
		cities: [],
		error: null
	})

	useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'provinces'))
		.then(response => {
			let cities = []
			if(Array.isArray(response.data)) {
				response.data.map((element, index) => {
					const value = element.name_en
					const label = element.name_en + ' (' + element.name_th + ')'
					cities.push(<Select.Item key={index} label={label} value={value}/>)
				})
				setCity({
					loaded: true,
					cities: cities
				})
			}
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
	const { auth } = useContext(AuthContext)
	const [ province, setProvince ] = useState({
		loaded: false,
		provinces: [],
		error: null
	})

	useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		getProvinces()
	}, [])

	const getProvinces = () => {
		api.get(buildDataPath('globals', null, 'provinces'))
		.then(response => {
			let list = []
			if(response.ok == true) {
				if(Array.isArray(response.data)) {
					response.data.map((element, index) => {
						const value = element.name_en
						const label = element.name_en + ' (' + element.name_th + ')'
						list.push(<Select.Item key={index} label={label} value={value}/>)
					})
					setProvince({...province, loaded: true, provinces: list})
				}
			}
		})
		.catch(error => console.log(error))
	}

	const handleChange = (value) => {
		setValue('state', value, { shouldTouch: true })
	}

	const placeholder = props.placeholder
	const { error, loaded, provinces } = province

	if (error) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
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
	const { auth } = useContext(AuthContext)
	const state = watch("state")
	const city = watch("city")
	const [district, setDistrict] = useState({
		loaded: false,
		districts: [],
		postcode: "",
		error: null
	})

	useEffect(() => {
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
				if(Array.isArray(response.data)) {
					response.data.map((item, index) => {
						const label = item.district + ' (' + item.name_th + ')'
						const value = item.district
						list.push(<Select.Item key={index} label={label} value={value} />)
					})
					setDistrict({...district, loaded: true, districts: list})
				}
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
	
	const { error, loaded, districts } = district
	if (error) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
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
				{districts}
			</Select>
		)
	}	
}

export const Purpose = (props) => {
	const { auth } = useContext(AuthContext)
	const [purpose, setPurpose] = useState({
		loaded: false,
		purpose: [],
		error: null
	})

	useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'purpose'))
			.then(response => {
				let purposes = []
				if (Array.isArray(response.data)) {
					response.data.map((element, index) => {
						purposes.push(<Select.Item key={index} label={element.purpose} value={element.purpose} />)
					})
					if (auth.uid == 16) { //ME!!!
						purposes.push(<Select.Item key={'999'} label={"API Testing Only"} value={"API Testing Only"} />)
					}
					setPurpose({
						loaded: true,
						purposes: purposes
					})
				}
			}, error => {
				setPurpose({
					loaded: true,
					error
				})
			})
	}, [])

	const placeholder = props.placeholder
	const { error, loaded, purposes } = purpose
	if (error) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
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
				{purposes}
			</Select>
		)
	}
}

export const State = (props) => {
	const { auth } = useContext(AuthContext)
	const [state, setState] = useState({
		loaded: false,
		states: [],
		error: null
	})

	useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, 'au_states'))
			.then(response => {
				let states = []
				if (Array.isArray(response.data)) {
					response.data[0].options.map((element, index) => {
						const value = element.value
						const label = element.label
						states.push(<Select.Item key={index} label={label} value={value} />)
					})
					setState({
						loaded: true,
						states: states
					})
				}
			}, error => {
				setState({
					loaded: true,
					error
				})
			})
	}, [])

	const placeholder = props.placeholder
	const { error, loaded, states } = state
	if (error) {
		return (
			<Select fontSize={"lg"} placeholder={placeholder}>
				<Select.Item label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
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
				{states}
			</Select>
		)
	}
}