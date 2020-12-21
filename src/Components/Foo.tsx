function Foo() {
    const derp = [
        'hurr',
        'durr',
        'herp',
        'derp'
    ]

    const handleClick = () => {
        console.debug('fooo')
    }

    return (
        <>
            <button onClick={() => handleClick}>clicky</button>
            {derp.map(o => <div>{o}</div>)}
        </>
    )
}

export default Foo;