function convertTimestampToString(timestamp){
    const the_hour = new Date(timestamp);

    return "" +
        ("0" + the_hour.getHours()).slice(-2) +
        ":" +
        ("0" + the_hour.getMinutes()).slice(-2)
    ;

}

export function adaptProposalData(proposalData, hour=24) {
    let result={};

    Object.keys(proposalData).map( function(current_aggregation, j) {
            const aggregation = proposalData[current_aggregation];

            //initialize result for each aggregation
            result[current_aggregation]={}
            result[current_aggregation]['result']=[];

            let tmp_result={}; //the temp dict

            //the stacked components for the aggregation values ie F1, F5D, ... or F1,girona; F5D,girona; F1,barcelona; F5D,barcelona
            result[current_aggregation]['components']={};


            //set current aggregation ID and fields
            result[current_aggregation]['aggregation']=aggregation['aggregation']['fields'];
            result[current_aggregation]['aggregationID']=aggregation['aggregation']['id'];


            aggregation.result.map( function(entry, i) {
                const hour=entry['hour'];
                const amount=entry['amount'];
                const title=entry['title'];

                // initialize result hour with an empty dict
                if (!tmp_result[hour])
                    tmp_result[hour]={total: 0, name: hour};

                tmp_result[hour][title] = amount;
                tmp_result[hour]["total"] += amount;

                result[current_aggregation]['components'][title] = {
                    'title': title,
                };
            });

            //Adapt the tmp_result dict to an ordered list (based on the timestamp, incremental)
            Object.keys(tmp_result).sort().map( function( tmp_entry, i) {
                result[current_aggregation]['result'][i] = tmp_result[tmp_entry];

                const hour_string = convertTimestampToString(parseInt(tmp_entry));
                result[current_aggregation]['result'][i]['name'] = hour_string;
            });

    });

    return result;
}
