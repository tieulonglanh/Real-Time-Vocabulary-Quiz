export const formatRedisSortedSetData = (data: any) => {
    const formatedData = [];
    for (let i = 0; i < data.length; i += 2) {
        formatedData.push({ id: data[i], score: parseInt(data[i + 1]) });
    }
    return formatedData;
}

export default formatRedisSortedSetData;