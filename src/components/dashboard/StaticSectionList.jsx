import React from 'react'
import { Box, Divider, VStack } from 'native-base'
import HeaderItem from './HeaderItem'
import ListItem from './ListItem'

const StaticSectionList = (props) => {
	let { sections, sectionProps, listProps } = props 
	let topProps = Object.keys(sectionProps).filter(key => key.match(/Top/)).reduce((obj, key) => {obj[key] = sectionProps[key]; return obj},{})
	let bottomProps = Object.keys(sectionProps).filter(key => key.match(/Bottom/)).reduce((obj, key) => {obj[key] = sectionProps[key]; return obj},{})
	
	let listContents = []
	sections.forEach((section, index) => {
		let [sectionInner, sectionLength] =  [[], section.data.length]
	
		sectionInner.push(<HeaderItem key={'h_' + index} header={section.header} styles={topProps} />)
		section.data.forEach((item, rowIndex) => {
			let subIndex = index + '_' + rowIndex
			sectionInner.push(
				<ListItem key={subIndex} data={item}
					section={{ sectionIndex: index, sectionLength: sectionLength, itemIndex: rowIndex}}
					styles={ rowIndex == sectionLength -1 ? bottomProps : null } />)
			if(rowIndex != sectionLength - 1) {
				sectionInner.push(<Divider key={'div_' + subIndex} />)
			}	
		})

		let sectionBlock = (	
			<Box key={index} {...sectionProps}>
				{sectionInner}
			</Box>
		)

		listContents.push(sectionBlock)
	})

	let output = (
		<VStack {...listProps}>
			{listContents}
		</VStack>
	)

	return output
}

export default StaticSectionList
