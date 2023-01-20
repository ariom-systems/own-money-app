import React, { useState, useEffect, useRef } from 'react'

export function useInterval(callback, delay, cancel = null) {
	const savedCallback = useRef()

	useEffect(() => {
		savedCallback.current = callback
	})

	useEffect(() => {
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
	const [ aspect, setAspect ] = useState(initial)
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
	const destroyFunc = useRef()
	const effectCalled = useRef(false)
	const renderAfterCalled = useRef(false)
	const [ val, setVal ] = useState(0)

	if(effectCalled.current) {
		renderAfterCalled.current = true
	}

	useEffect(() => {
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