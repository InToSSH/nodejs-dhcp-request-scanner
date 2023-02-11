function requestTypeToString(type) {
    const stringMap = {
        1: 'DISCOVER',
        3: 'REQUEST'
    }

    return stringMap[type] ?? type
}

module.exports = {requestTypeToString}