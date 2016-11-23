

export function adaptProposalData(proposalData, hour=25) {
    let result=[];

    const aggregationNum = proposalData.result.length;
    console.log(aggregationNum);

    //initialize result for each aggregation
    for (var j=0; j<aggregationNum; j++) {
        result[j]={};
        result[j]['result']=[];

        //the stacked components for the aggregation values ie F1, F5D, ... or F1,girona; F5D,girona; F1,barcelona; F5D,barcelona
        result[j]['components']={};

        //initialize hours
        for (var i=0; i<hour; i++)
            result[j]['result'][i]={name: i+":00"}
    }
    proposalData.result.map(function(aggregation, i) {
        const prediction = aggregation.result.sum;
        const aggregationTitle = aggregation.aggregation;
        const aggregationID = aggregation.aggregation_id;
        //console.dir(Object.keys(aggregation.result.sum));

        //convert incoming string to array
        const aggregationComponentsArray = JSON.parse(aggregationTitle.replace(/'/g, '"'));
        const aggregationComponentsNumber = aggregationComponentsArray.length;

        result[i]['aggregation'] = Object.assign([],aggregationComponentsArray);
        result[i]['aggregationID'] = "" + aggregationID;

        console.log(aggregationTitle,"xx", aggregationComponentsArray);


        //for each returning entry of the API, extract the HOUR, the component (aggregation) and insert in the result propertly
        Object.keys(prediction).map( function(hour, y) {
            const hourComponentsArray = JSON.parse(hour.replace(/'/g, '"'));

            //Hour is ever fixed (and must be extracted from the aggregations name)
            const hourDetail = "" + hourComponentsArray[0];
            const hourExact = hourDetail.slice(12,13);

            //Aggregations can be dynamic (one, two, ...) but used as the other dimension of the array (x=hour, y=aggregations ), ie. x=8:00, y="F1:50" / x=8:00 y="F5D:30"
            //If there are just one aggregation (hour), create the y="*"
            const hourAggregation = (hourComponentsArray.length == 1)?["*"]:hourComponentsArray.slice(1, hourComponentsArray.length);
            console.log(hourExact,hourAggregation);

            result[i]['result'][hourExact][hourAggregation] = 0 + prediction[hour];

            //append aggregation value if so far not exist

            const componentName = "" + hourAggregation.toString();
            result[i]['components'][componentName] = componentName;
            console.log(componentName);
        })
    });
    console.dir(result)
    return result;
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
