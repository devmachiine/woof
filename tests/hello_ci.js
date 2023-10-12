module.exports = ({test, equal}) => [
    test("it runs the tests", () => {
        equal(true, !!'yes')
    })
]
