import React, { memo } from 'react'

//components
import ListHeader from '../common/ListHeader'

//data
import { useRecoilValue } from 'recoil'
import { langState } from '../../data/recoil/system'

const HeaderItem = (props) => {
	const lang = useRecoilValue(langState)
	const { header, index } = props
	let styles = {}, formattedDate = new Date(header).toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
	
	if(index == 0) { styles={ roundedTop: "8" } }
	
	return (
		<ListHeader title={formattedDate} index={index} styles={styles} />
	)
}

export default memo(HeaderItem)
