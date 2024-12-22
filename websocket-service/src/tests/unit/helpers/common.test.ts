import formatRedisSortedSetData from 'helpers/common';

describe('formatRedisSortedSetData', () => {
    test('should format data from a redis sorted set correctly', () => {
        const input = ["tieulonglanh1", "100", "tieulonglanh2", "95", "tieulonglanh3", "90"];
        const expected = [
            {"id": "tieulonglanh1", "score": 100}, 
            {"id": "tieulonglanh2", "score": 95}, 
            {"id": "tieulonglanh3", "score": 90}
        ];
        const received = formatRedisSortedSetData(input);

        // Ensure data types and orders are correct
        expect(received).toEqual(expected);
    });
});