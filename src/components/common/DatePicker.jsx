import React from 'react'
import { Box, Button, Center, Divider, Factory, FormControl, Heading, 
	HStack, Input, InputGroup, InputRightAddon, ScrollView, Spacer, StatusBar, VStack } from 'native-base'
import { useFormContext } from 'react-hook-form'
import DatePicker from 'react-native-date-picker'
import Ionicon from 'react-native-vector-icons/Ionicons'
Ionicon.loadFont()

const NBIonicon = Factory(Ionicon)

export const OMDatePicker = (props) => {
	const [ date, setDate ] = React.useState(new Date())
	const [ visualDate, setVisualDate ] = React.useState({
		day: '',
		month: '',
		year: ''
	})
	const [ open, setOpen ] = React.useState(false)
	const { setValue, getValues, watch } = useFormContext()
	
	const dob = getValues("dateofbirth")

	React.useEffect(() => {
		const visual = formatTheDate(dob, 'visual')
		const dateObj = new Date(visual)
		if(!isNaN(Date.parse(dateObj))) {
			setDate(dateObj)
			splitDate(visual)
		}
	}, [dob])

	const handleChange = (newDate) => {
		const visual = formatTheDate(newDate, 'visual')
		const dbstring = formatTheDate(newDate, 'database')
		splitDate(visual)
		setValue("dateofbirth", dbstring)
	}

	function splitDate(theDate) {
		let newDate = theDate.split(' ')
		setVisualDate({
			day: newDate[0],
			month: newDate[1],
			year: newDate[2]
		})
	}

	function formatTheDate(theDate, type) {
		if(type == 'visual') {
			return new Date(theDate).toLocaleDateString('en-AU', {year: 'numeric', month: 'long', day: 'numeric' })
		} else {
			//couldnt find a good way to do this. en-AU year numeric is bugged when using the below options
			let tmp = new Date(theDate).toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
			//and americans are weird. how on earth is YYYY/DD/MM a good format? seriously?
			let tmpArray = tmp.split('/')
			tmpArray = tmpArray.reverse()
			tmpArray.push(tmpArray.splice(1,1)[0])
			return tmpArray.join('-')
		}
	}

	return (
		<>
			<InputGroup w={"100%"}>
				<Input value={visualDate.day} textAlign={"center"} borderRightWidth={"0"} isReadOnly fontSize={"lg"} flexGrow={"2"} />
				<Input value={visualDate.month} textAlign={"center"} borderRightWidth={"0"} isReadOnly fontSize={"lg"} flexGrow={"3"} />
				<Input value={visualDate.year} textAlign={"center"} borderRightWidth={"0"} isReadOnly fontSize={"lg"} flexGrow={"2"} />
				<Button flexGrow={"1"} onPress={() => {setOpen(true)}}>
					<NBIonicon name={"calendar-sharp"} color={"white"} fontSize={"2xl"} />
				</Button>
			</InputGroup>
			<DatePicker
				modal
				title={ props.title }
				mode={"date"}
				maximumDate={new Date(Date.now())}
				open={open}
				date={date}
				locale={'en-AU'}
				onConfirm={(newDate) => {
					setOpen(false)
					setDate(newDate)
					handleChange(newDate)
				}}
				onCancel={() => {
					setOpen(false)
				}}
			/>
		</>
	)
}