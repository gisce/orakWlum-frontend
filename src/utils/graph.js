

export function adaptProposalData(proposalData, hour=25) {
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
