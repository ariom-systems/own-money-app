import React from 'react'

export function useInterval(callback, delay, cancel = null) {
	const savedCallback = React.useRef()

	React.useEffect(() => {
		savedCallback.current = callback
	})

	React.useEffect(() => {
		function tick() {
			savedCallback.current()
		}

		if(delay !== null) {
			let id = setInterval(tick, delay)
			return () => clearInterval(id)
		}

		if(cancel === undefined) {
			let id = setInterval(tick, delay)
			return () => clearInterval(id)
		}


	}, [delay])
}

export function useAspect(initial) {
	const [ aspect, setAspect ] = React.useState(initial)
	let current = aspect;
	const get = () => current
	const set = newValue => {
			current = newValue
			setAspect(newValue)
			return current
	}
	return { get, set }
}

export const useEffectOnce = (effect) => {
	const destroyFunc = React.useRef()
	const effectCalled = React.useRef(false)
	const renderAfterCalled = React.useRef(false)
	const [ val, setVal ] = React.useState(0)

	if(effectCalled.current) {
		renderAfterCalled.current = true
	}

	React.useEffect(() => {
		if(!effectCalled.current) {
			destroyFunc.current = effect()
			effectCalled.current = true
		}

		setVal(val => val + 1)

		return () => {
			if(!renderAfterCalled.current) { return }
			if(destroyFunc.current) { destroyFunc.current() }
		}
	}, [])
}