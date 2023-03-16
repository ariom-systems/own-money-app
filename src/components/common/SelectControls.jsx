import React, { useContext, useState, useEffect } from 'react'

//components
import { Select } from 'native-base'

//data
import { useRecoilValue } from 'recoil'
import { useFormContext } from 'react-hook-form'
import { buildDataPath } from '../../data/Actions'
import { api, Sizes } from '../../config'
import { AuthContext } from '../../data/Context'
import { debugState } from '../../data/recoil/system'


export const Controlled = (props) => {
	switch(props.component) {
		case 'AccountType': return <AccountType {...props} /> ; break
		case 'BankName': return <BankName {...props} /> ; break
		case 'BranchCity': return <BranchCity {...props} /> ; break
		case 'Province': return <Province {...props} /> ; break
		case 'District': return <District {...props} /> ; break
		case 'Purpose': return <Purpose {...props} />; break
		case 'State': return <State {...props} />; break
		case 'IDType': return <IDType {...props} />; break
		case 'IDIssuer': return <IDIssuer {...props} />; break
	}
}

const SelectControlScaffold = (props) => {
	const { auth } = useContext(AuthContext)
	const [accountType, setAccountType] = useState({
		loaded: false,
		data_types: [],
		error: null
	})

	useEffect(() => {
		api.setHeader('Authorization', 'Bearer ' + auth.token)
		api.get(buildDataPath('globals', null, props.endpoint))
			.then(response => {
				let data_types = []
				if (Array.isArray(response.data)) {
					response.data[0].options.map((element, index) => {
						const value = element.value
						const label = element.label
						data_types.push(<Select.Item fontSize={Sizes.inputs} key={index} label={label} value={value} />)
					})
					setAccountType({
						loaded: true,
						data_types: data_types
					})
				}
			}, error => {
				setAccountType({
					loaded: true,
					error
				})
			})
	}, [])

	const { error, loaded, data_types } = accountType
	if (error) {
		return (
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={props.placeholder} isDisabled={props.isDisabled}>
				<Select.Item fontSize={Sizes.inputs} label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
		return (
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={props.placeholder} isDisabled={props.isDisabled}>
				<Select.Item fontSize={Sizes.inputs} label={"loading..."} value={"loading"} />
			</Select>
		)
	} else {
		return (
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={props.placeholder} selectedValue={props.value} value={props.value} onValueChange={
				(itemValue) => {
					props.onValueChange(itemValue)
				}} isDisabled={props.isDisabled}>
				{data_types}
			</Select>
		)
	}
}

export const AccountType = (props) => {
	return <SelectControlScaffold endpoint={'account_types'} placeholder={props.placeholder} value={props.value} onValueChange={props.onValueChange} isDisabled={props.isDisabled} />
}

export const BankName = (props) => {
	return <SelectControlScaffold endpoint={'bank_names'} placeholder={props.placeholder} value={props.value} onValueChange={props.onValueChange} isDisabled={props.isDisabled} />
}

export const BranchCity = (props) => {
	return <SelectControlScaffold endpoint={'branch_cities'} placeholder={props.placeholder} value={props.value} onValueChange={props.onValueChange} isDisabled={props.isDisabled} />
}

export const State = (props) => {
	return <SelectControlScaffold endpoint={'au_states'} placeholder={props.placeholder} value={props.value} onValueChange={props.onValueChange} isDisabled={props.isDisabled} />
}

export const IDType = (props) => {
	return <SelectControlScaffold endpoint={'id_types'} placeholder={props.placeholder} value={props.value} onValueChange={props.onValueChange} isDisabled={props.isDisabled} />
}

export const IDIssuer = (props) => {
	return <SelectControlScaffold endpoint={'issuer_types'} placeholder={props.placeholder} value={props.value} onValueChange={props.onValueChange} isDisabled={props.isDisabled} />
}

//not using the scaffold as we're pulling data from another table
export const Purpose = (props) => {
	const { setValue } = useFormContext()
	const { auth } = useContext(AuthContext)
	const debug = useRecoilValue(debugState)
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
					if (debug == true) {
						purposes.push(<Select.Item key={'999'} label={"API Testing"} value={"API Testing"} />)
						purposes.push(<Select.Item key={'998'} label={"iOS App Testing"} value={"iOS App Testing"} />)
						purposes.push(<Select.Item key={'997'} label={"Android App Testing"} value={"Android App Testing"} />)
					}
					response.data.map((element, index) => {
						purposes.push(<Select.Item key={index} label={element.purpose} value={element.purpose} />)
					})
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

	const handleChange = (value) => {
		setValue('purpose', value, { shouldTouch: true })
	}

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
					handleChange(itemValue)
					props.onValueChange(itemValue)
				}}>
				{purposes}
			</Select>
		)
	}
}

//not using the scaffold as we're pulling data from another table
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
						list.push(<Select.Item fontSize={Sizes.inputs} key={index} label={label} value={value}/>)
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
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={placeholder}>
				<Select.Item fontSize={Sizes.inputs} label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
		return (
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={placeholder}>
				<Select.Item fontSize={Sizes.inputs} label={"loading..."} value={"loading"} />
			</Select>
		)
	} else {
		return (
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={placeholder} selectedValue={props.value} value={props.value} onValueChange={
				(itemValue) => {
					handleChange(itemValue)
					props.onValueChange(itemValue)
				}}>
				{provinces}
			</Select>
		)
	}
}

//not using the scaffold as we're pulling data from multiple tables
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
						list.push(<Select.Item fontSize={Sizes.inputs} key={index} label={label} value={value} />)
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
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={placeholder}>
				<Select.Item fontSize={Sizes.inputs} label={error.message} value={"nothing"} />
			</Select>
		)
	} else if (!loaded) {
		return (
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={placeholder}>
				<Select.Item fontSize={Sizes.inputs} label={"loading..."} value={"loading"} />
			</Select>
		)
	} else {
		return (
			<Select _selectedItem={{ fontSize: Sizes.inputs }} placeholder={placeholder} selectedValue={props.value} value={props.value} onValueChange={
				(itemValue) => {
					handleChange(itemValue)
					props.onValueChange(itemValue)
				}}>
				{districts}
			</Select>
		)
	}	
}