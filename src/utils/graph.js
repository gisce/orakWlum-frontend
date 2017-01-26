

export function adaptProposalData(proposalData, hour=24) {
  console.log("entro");
    let result={};
    const aggregationNum = proposalData.result.length;

    //initialize result for each aggregation
    for (var j=0; j<aggregationNum; j++) {
        const aggID = proposalData.result[j].aggregation_id;

        result[aggID]={};
        result[aggID]['result']=[];

        //the stacked components for the aggregation values ie F1, F5D, ... or F1,girona; F5D,girona; F1,barcelona; F5D,barcelona
        result[aggID]['components']={};

        //initialize hours
        for (var i=0; i<hour; i++) {
            result[aggID]['result'][i]={total: 0, name: i+1};
        }
    }

    proposalData.result.map(function(aggregation, i) {
        const prediction = aggregation.result.sum;
        const aggregationTitle = aggregation.aggregation;
        const aggregationID = aggregation.aggregation_id;

        //convert incoming string to array
        const aggregationComponentsArray = JSON.parse(aggregationTitle.replace(/'/g, '"'));
        const aggregationComponentsNumber = aggregationComponentsArray.length;

        result[aggregationID]['aggregation'] = Object.assign([],aggregationComponentsArray);
        result[aggregationID]['aggregationID'] = "" + aggregationID;

        //for each returning entry of the API, extract the HOUR, the component (aggregation) and insert in the result propertly
        Object.keys(prediction).map( function(hour, y) {
            const hourComponentsArray = JSON.parse(hour.replace(/'/g, '"'));

            //Hour is ever fixed (and must be extracted from the aggregations name)
            const hourDetail = "" + hourComponentsArray[0];
            let hourExact = parseInt(hourDetail.slice(11,13));

            //Aggregations can be dynamic (one, two, ...) but used as the other dimension of the array (x=hour, y=aggregations ), ie. x=8:00, y="F1:50" / x=8:00 y="F5D:30"
            //If there are just one aggregation (hour), create the y="*"
            const hourAggregation = (hourComponentsArray.length == 1)?["Amount"]:hourComponentsArray.slice(1, hourComponentsArray.length);

            // Handle the last hour as hour #24
            if (hourExact == 0)
                hourExact = 24;

            result[aggregationID]['result'][hourExact-1][hourAggregation] = 0 + prediction[hour];
            result[aggregationID]['result'][hourExact-1]["total"] += 0 + prediction[hour];

            //append aggregation value if so far not exist
            const componentName = "" + hourAggregation.toString();
            result[aggregationID]['components'][componentName] = componentName;
        })
    });

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
    return result;
}
