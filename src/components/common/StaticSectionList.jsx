import React from 'react'
import { Box, Divider } from 'native-base'

const StaticSectionList = (props) => {
	const sections = props.sections
	let item, index, section 
	React.useEffect(() => {

	}, [props])
	// let { sections, sectionProps, renderItem, renderSectionHeader } = props 
	//let topProps = Object.keys(sectionProps).filter(key => key.match(/Top/)).reduce((obj, key) => {obj[key] = sectionProps[key]; return obj},{})
	//let bottomProps = Object.keys(sectionProps).filter(key => key.match(/Bottom/)).reduce((obj, key) => {obj[key] = sectionProps[key]; return obj},{})
	
	const renderItem = () => {
		return "test"
	}

	console.log(sections)


	let output = []
	// sections.forEach((section, index) => {
	// 	let [sectionInner, sectionLength] =  [[], section.data.length]
	
	// 	sectionInner.push(<HeaderItem key={'h_' + index} header={section.header} styles={topProps} />)
	// 	section.data.forEach((item, rowIndex) => {
	// 		let subIndex = index + '_' + rowIndex
	// 		sectionInner.push(
	// 			<ListItem key={subIndex} data={item}
	// 				section={{ sectionIndex: index, sectionLength: sectionLength, itemIndex: rowIndex}}
	// 				styles={ rowIndex == sectionLength -1 ? bottomProps : null } />)
	// 		if(rowIndex != sectionLength - 1) {
	// 			sectionInner.push(<Divider key={'div_' + subIndex} />)
	// 		}	
	// 	})

	// 	let sectionBlock = (	
	// 		<Box key={index} {...sectionProps}>
	// 			{sectionInner}
	// 		</Box>
	// 	)

	// 	output.push(sectionBlock)
	// })
	return output
}

export default StaticSectionList
