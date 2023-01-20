import React, { useContext, memo } from 'react'

//components
import ListHeader from '../common/ListHeader'

//data
import { AuthContext } from '../../data/Context'

const HeaderItem = (props) => {
	const { auth } = useContext(AuthContext)
	const { header, index } = props
	let styles = {}, formattedDate = new Date(header).toLocaleDateString(auth.lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
	
	if(index == 0) { styles={ roundedTop: "8" } }
	
	return (
		<ListHeader title={formattedDate} index={index} styles={styles} />
	)
}

export default memo(HeaderItem)
