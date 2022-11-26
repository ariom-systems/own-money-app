import React from 'react'
import { AlertDialog, Box, Button, Center, Divider, Factory,
	Heading, HStack, Pressable, SectionList, Spacer, StatusBar, Text, VStack } from 'native-base'
import * as Recoil from 'recoil'
import * as Atoms from '../../data/recoil/Atoms'
import { BeneficiaryBlank } from '../../data/templates/BeneficiariesDetailSectionList'
import { mapSectionDataFromTemplate } from '../../data/Actions'

const DetailsSectionList = (props) => {

	const [ beneficiaries, setBeneficiaries ] = Recoil.useRecoilState(Atoms.beneficiaries)
	const [ sections, setSections ] = React.useState(BeneficiaryBlank)
	const [ ignored, forceUpdate] = React.useReducer((x) => x +1, 0)


	React.useEffect(() => {
		let newSections = mapSectionDataFromTemplate(beneficiaries, BeneficiaryBlank)
		setSections(newSections)
	},[beneficiaries.view])

	return (
		<SectionList
			sections={ sections }
			keyExtractor={(item, index) => item + index }
			renderItem={(item, index) => <ListItem data={item} key={index} />}
			renderSectionHeader={({section: { title }}) => <HeaderItem title={title} />}
			stickySectionHeadersEnabled={false}
		/>
	)
}

const ListItem = (data) => {
	const { label, value } = data.data.item
	return (
		<>
			<VStack px={"4"} py={"2"}>
				<Text fontSize={"xs"} color={"coolGray.500"}>{label}</Text>
				<Text fontSize={"lg"}>{value}</Text>
			</VStack>
			<Divider />
		</>
	)
}

const HeaderItem = (data) => {
	const title = data.title
	return (
		<Box px={"2"} py={"4"} backgroundColor={"coolGray.200"} key={title.replace(' ', '_').toLowerCase()}>
			<Heading size={"sm"}>{title}</Heading>
		</Box>
	)
}

export default DetailsSectionList
