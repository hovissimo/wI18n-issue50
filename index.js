import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'

import './index.css'

class Reproducer extends React.Component {
	render() {
		let foobar = this.props.maybe ? __("foo") : __("bar")           
		return <div>{foobar}
		<DatePicker />
			</div>;                                                                              
	}
}

Reproducer.propTypes = {
	maybe: PropTypes.bool,
}

console.log( new Reproducer({maybe: true}).render() )
