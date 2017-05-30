import React from 'react'
import PropTypes from 'prop-types'

class Reproducer extends React.Component {
	render() {
		let foobar = this.props.maybe ? __("foo") : __("bar")           
		return <div>{foobar}</div>;                                                                              
	}
}

Reproducer.propTypes = {
	maybe: PropTypes.bool,
}

console.log( new Reproducer({maybe: true}).render() )
