

export function adaptProposalData(proposalData, hour=25) {
    let result=[];

    const aggregationNum = proposalData.result.length;
    console.log(aggregationNum);

    //initialize result for each aggregation
    for (var j=0; j<aggregationNum; j++) {
        result[j]={};
        result[j]['result']=[];

        //initialize hours
        for (var i=0; i<hour; i++)
            result[j]['result'][i]={name: i+":00"}
    }
    const count = 1;
    proposalData.result.map(function(aggregation, i) {
        if (i<count){

        const prediction = aggregation.result.sum;
        const aggregationTitle = aggregation.aggregation;
        const aggregationID = aggregation.aggregation_id;
        //console.dir(Object.keys(aggregation.result.sum));

        //convert incoming string to array
        const aggregationComponentsArray = JSON.parse(aggregationTitle.replace(/'/g, '"'));
        const aggregationComponentsNumber = aggregationComponentsArray.length;

        console.log(aggregationTitle,"xx", aggregationComponentsArray);

        //for each returning entry of the API, extract the HOUR, the component (aggregation) and insert in the result propertly
        Object.keys(prediction).map( function(hour, y) {

            const hourComponentsArray = JSON.parse(hour.replace(/'/g, '"'));
            const hourDetail = "" + hourComponentsArray[0];
            const hourExact = hourDetail.slice(12,13);
            const hourAggregation = hourComponentsArray.slice(1, hourComponentsArray.length);
            console.log(hourExact,hourAggregation);

            result[i]['result'][hourExact][hourAggregation]=prediction[hour];
        })
    }
    });
    console.dir(result)
    return result[0];
}


export function adaptProposalDataOld(proposalData, hour=25) {
    let result=[]
    for (var i=0; i<hour; i++)
        result[i]={name: i+":00"}

    proposalData.map(function(day, i) {
        day.consumption.map(function(hour, y){
            result[y][day.day]=hour;
        });
    });
    console.dir(result)
    return result;
}
